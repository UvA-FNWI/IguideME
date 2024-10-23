using System;
using System.Collections.Generic;
using System.Linq;
using IguideME.Web.Models.App;
using IguideME.Web.Models.Impl;
using IguideME.Web.Services.LMSHandlers;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using UvA.DataNose.Connectors.Canvas;
using CanvasUser = UvA.DataNose.Connectors.Canvas.User;
using User = IguideME.Web.Models.Impl.User;

namespace IguideME.Web.Services
{
    /// <summary>
    /// Class <a>CanvasHandler</a> models a singelton service that handles the communication with Canvas LMS..
    /// </summary>
    public class CanvasHandler : ILMSHandler
    {
        private readonly ILogger<SyncManager> _logger;
        public CanvasApiConnector Connector;
        public string BaseUrl;
        public string AccessToken;
        public DatabaseManager _databaseManager;

        /// <summary>
        /// This constructor initializes the new CanvasHandler to
        /// (<paramref name="config"/>, <paramref name="logger"/>).
        /// </summary>
        /// <param name="config">The configuration for the instance.</param>
        /// <param name="logger">A reference to the logger used for this service.</param>
        public CanvasHandler(IConfiguration config, ILogger<SyncManager> logger, DatabaseManager databaseManager)
        {
            _logger = logger;
            this.AccessToken = config["LMS:Canvas:AccessToken"];
            this.BaseUrl = config["LMS:Canvas:Url"];
            this._databaseManager = databaseManager;
            this.SyncInit();
        }

        /// <inheritdoc />
        /// <summary>
        /// Creates or renews a connection with canvas. We always initialize and keep one because we communicate with canvas outside of syncs as well.
        /// </summary>
        public void SyncInit()
        {
            this.Connector = new CanvasApiConnector(this.BaseUrl, this.AccessToken);
        }

        /// <inheritdoc />
        public void SendMessage(string userID, string subject, string body)
        {
            _logger.LogInformation("Created conversation for userID: {userID}", userID);
            string recipient = userID.ToString();
            _logger.LogInformation("Attempting to send message to {recipient}", recipient);

            try
            {
                Conversation conv = new(this.Connector)
                {
                    Subject = subject,
                    Body = body,
                    Recipients = new string[] { recipient }
                };

                _logger.LogInformation(
                    "Created conversation with subject: {subject}, body: {body}, recipients: {recipients}",
                    conv.Subject,
                    conv.Body,
                    string.Join(", ", conv.Recipients)
                );

                conv.Save();
            }
            catch (System.Net.WebException e)
            {
                _logger.LogError("Error sending message: {error}", e);
                _logger.LogError(
                    "Status description: {status}",
                    ((System.Net.HttpWebResponse)e.Response).StatusDescription
                );
                _logger.LogError(
                    "Response: {response}",
                    new System.IO.StreamReader(
                        ((System.Net.HttpWebResponse)e.Response).GetResponseStream()
                    ).ReadToEnd()
                );
            }
        }

        /// <inheritdoc />
        public string[] GetUserIDs(int courseID, string userID)
        {
            _logger.LogInformation(
                "Trying to get user\ncourseID: {courseID}, userID: {userID}",
                courseID,
                userID
            );
            List<Enrollment> users = Connector.FindCourseById(courseID).Enrollments;
            CanvasUser user = users.First(x => x.UserID == userID).User;
            return new string[] { user.LoginID, user.SISUserID, user.ID.ToString() };
        }

        /// <inheritdoc />
        public IEnumerable<User> GetStudents(int courseID)
        {
            Course course = Connector.FindCourseById(courseID);
            IEnumerable<CanvasUser> students = course
                .GetUsersByType(EnrollmentType.Student)
                .ToArray();

            return students.Select(student => new User(
                student.SISUserID,
                courseID,
                student.ID ?? -1,
                student.Name,
                student.SortableName,
                (int)UserRoles.student
            ));
        }

        /// <inheritdoc />
        public IEnumerable<User> GetAdministrators(int courseID)
        {
            IEnumerable<CanvasUser> admins = Connector
                .FindCourseById(courseID)
                .GetUsersByType(EnrollmentType.Teacher)
                .ToArray();
            return admins.Select(admin => new User(
                admin.SISUserID,
                courseID,
                admin.ID ?? -1,
                admin.Name,
                admin.SortableName,
                (int)UserRoles.instructor
            ));
        }

        /// <inheritdoc />
        public IEnumerable<AppAssignment> GetAssignments(int courseID)
        {
            return Connector
                .FindCourseById(courseID)
                .Assignments.Where(assignment => assignment != null)
                .OrderBy(a => a.Position)
                .Select(ass => new AppAssignment(
                    courseID,
                    ass.Name,
                    ass.Url,
                    ass.ID ?? -1,
                    ass.IsPublished ? 1 : 0,
                    ass.IsMuted,
                    ass.DueDate.HasValue
                        ? ((DateTimeOffset)ass.DueDate.Value).ToUnixTimeMilliseconds()
                        : 0,
                    ass.PointsPossible ?? 0,
                    mapGradingType(ass.GradingType)
                ));
        }

        private AppGradingType mapGradingType(GradingType type)
        {
            switch (type)
            {
                case GradingType.Points:
                    return AppGradingType.Points;
                case GradingType.Percentage:
                    return AppGradingType.Percentage;
                case GradingType.Letters:
                case GradingType.GPA:
                    return AppGradingType.Letters;
                case GradingType.PassFail:
                    return AppGradingType.PassFail;
                case GradingType.NotGraded:
                    return AppGradingType.NotGraded;
                default:
                    _logger.LogWarning(
                        "Grade format {Type} is not supported, treating as not graded...",
                        type
                    );
                    return AppGradingType.NotGraded;
            }
        }

        /// <inheritdoc />
        public IEnumerable<AssignmentSubmission> GetSubmissions(int courseID, List<User> users)
        {
            return Connector
                .FindCourseById(courseID)
                .GetSubmissions(users.Select(user => user.UserID).ToArray(), false)
                .SelectMany(group =>
                    group.Submissions.Select(sub => new AssignmentSubmission(
                        -1,
                        sub.AssignmentID,
                        group.SISUserID,
                        sub.Grade,
                        sub.SubmittedAt != null
                            ? ((DateTimeOffset)sub.SubmittedAt.Value).ToUnixTimeMilliseconds()
                            : -1
                    ))
                );
        }

        /// <inheritdoc />
        public IEnumerable<(AppAssignment, IEnumerable<AssignmentSubmission>)> GetQuizzes(
            int courseID
        )
        {
            // Graded quizzes (assignment quizzes) are also treated as assignments by canvas and will be handled accordingly.
            return Connector
                .FindCourseById(courseID)
                .Quizzes.Where(quiz => quiz.Type != QuizType.Assignment)
                // TODO: Filter out graded survey from assignments
                .Select(quiz =>
                    (
                        new AppAssignment(
                            courseID,
                            quiz.Name,
                            quiz.Url,
                            quiz.ID ?? -1,
                            quiz.IsPublished ? 1 : 0,
                            false,
                            quiz.DueDate.HasValue
                                ? ((DateTimeOffset)quiz.DueDate.Value).ToUnixTimeMilliseconds()
                                : 0,
                            quiz.PointsPossible ?? 0,
                            quiz.Type == QuizType.Survey || quiz.PointsPossible == null ? AppGradingType.PassFail : AppGradingType.Points
                        ),
                        quiz.Submissions.Where(sub => sub.Score != null)
                            .Select(sub => new AssignmentSubmission(
                                -1,
                                quiz.ID ?? -1,
                                _databaseManager.GetUserID(sub.UserID),
                                sub.Score.ToString(),
                                sub.FinishedDate.HasValue ? ((DateTimeOffset)sub.FinishedDate.Value).ToUnixTimeMilliseconds() : 0
                            ))
                    )
                );
        }

        /// <inheritdoc />
        public IEnumerable<AppDiscussionTopic> GetDiscussions(int courseID)
        {
            return Connector
                .FindCourseById(courseID)
                .Discussions.Select(topic =>
                            new AppDiscussionTopic(
                                topic.ID ?? -1,
                                courseID,
                                topic.Title,
                                _databaseManager.GetUserIDFromName(courseID, topic.UserName),
                                topic.Url,
                                topic.PostedAt.HasValue ? ((DateTimeOffset)topic.PostedAt).ToUnixTimeMilliseconds() : 0,
                                topic.Message,
                                topic.Entries.SelectMany(entry =>
                                        entry
                                            .Replies.Select(reply => new AppDiscussionEntry(
                                                reply.ID ?? -1,
                                                topic.ID ?? -1,
                                                entry.ID ?? -1,
                                                courseID,
                                                reply.UserID.HasValue ? reply.UserID.ToString() : "Admin",
                                                reply.CreatedAt.HasValue ? (
                                                    (DateTimeOffset)reply.CreatedAt.Value
                                                ).ToUnixTimeMilliseconds() : 0,
                                                reply.Message
                                            ))
                                            .Append(
                                                new AppDiscussionEntry(
                                                    entry.ID ?? -1,
                                                    topic.ID ?? -1,
                                                    topic.ID ?? -1,
                                                    courseID,
                                                    entry.UserID.HasValue ? entry.UserID.ToString() : "Admin",
                                                    entry.CreatedAt.HasValue ? ((DateTimeOffset)entry.CreatedAt).ToUnixTimeMilliseconds() : 0,
                                                    entry.Message
                                                )
                                            )
                                    )
                            )
                );
        }
    }
}
