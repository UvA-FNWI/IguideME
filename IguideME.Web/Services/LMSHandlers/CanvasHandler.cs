using System.Collections.Generic;
using System.Linq;
using IguideME.Web.Models.App;
using IguideME.Web.Services.LMSHandlers;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
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

        /// <summary>
        /// This constructor initializes the new CanvasHandler to
        /// (<paramref name="config"/>, <paramref name="logger"/>).
        /// </summary>
        /// <param name="config">The configuration for the instance.</param>
        /// <param name="logger">A reference to the logger used for this service.</param>
        public CanvasHandler(IConfiguration config, ILogger<SyncManager> logger)
        {
            _logger = logger;
            this.AccessToken = config["LMS:Canvas:AccessToken"];
            this.BaseUrl = config["LMS:Canvas:Url"];
            this.SyncInit();
        }

        /// <summary>
        /// Creates or renews a connection with canvas. We always initialize and keep one because we communicate with canvas outside of syncs as well.
        /// </summary>
        public void SyncInit()
        {
            this.Connector = new CanvasApiConnector(this.BaseUrl, this.AccessToken);
        }

        /// <summary>
        /// Sends a message to a user.
        /// </summary>
        /// <param name="userID">The id of the user to send the message to.</param>
        /// <param name="subject">The subject of the conversation.</param>
        /// <param name="body">The message to be send.</param>
        public void SendMessage(string userID, string subject, string body)
        {
            try
            {
                Conversation conv =
                    new(this.Connector)
                    {
                        Subject = subject,
                        Body = body,
                        Recipients = new string[1] { userID }
                    };
                _logger.LogInformation(
                    "Created conversation {title} for {recipients}",
                    conv,
                    conv.Recipients[0]
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

        /// <summary>
        /// Get a user for a course.
        /// </summary>
        /// <param name="courseID">The course to get the user from.</param>
        /// <param name="userID">The id of the user.</param>
        /// <returns>The requested user if found.</returns>
        public User GetUser(int courseID, string userID)
        {
            _logger.LogInformation(
                "Trying to get user from canvas:\ncourseID: {courseID}, userID: {userID}",
                courseID,
                userID
            );
            List<Enrollment> users = Connector.FindCourseById(courseID).Enrollments;
            CanvasUser user = users.First(x => x.UserID == userID).User;
            return new User(
                -1,
                courseID,
                user.ID.Value,
                user.SISUserID,
                user.Name,
                user.SortableName,
                "Student"
            );
        }

        /// <summary>
        /// Get all the users with the student role for a course.
        /// </summary>
        /// <param name="courseID">The id of the course.</param>
        /// <returns>A list of students for the course.</returns>
        public IEnumerable<User> GetStudents(int courseID)
        {
            _logger.LogInformation("Finding course by id, id = {ID}", courseID);

            Course course = Connector.FindCourseById(courseID);
            _logger.LogInformation("Course = {course}", course);

            IEnumerable<CanvasUser> students = course.GetUsersByType(EnrollmentType.Student);
            _logger.LogInformation("Getting users {students}", students);

            return students.Select(student => new User(
                -1,
                courseID,
                student.ID.Value,
                student.SISUserID,
                student.Name,
                student.SortableName,
                "Student"
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
                -1,
                courseID,
                admin.ID.Value,
                admin.SISUserID,
                admin.Name,
                admin.SortableName,
                "Teacher"
            ));
        }

        /// <summary>
        /// Gets all the non null assignemnts for a course from canvas.
        /// </summary>
        /// <param name="courseID">The id of the course the assignments are from.</param>
        /// <returns>An iterable with assignments for the course.</returns>
        public IEnumerable<AppAssignment> GetAssignments(int courseID)
        {
            return Connector
                .FindCourseById(courseID)
                .Assignments.Where(assignment => assignment != null)
                .OrderBy(a => a.Position)
                .Select(ass => new AppAssignment(
                    -1,
                    ass.ID.Value,
                    courseID,
                    ass.Name,
                    ass.IsPublished,
                    ass.IsMuted,
                    ass.DueDate.HasValue ? ass.DueDate.Value.ToShortDateString() : "",
                    ass.PointsPossible ??= 0,
                    ass.Position ?? 0,
                    mapGradingType(ass.GradingType),
                    ass.SubmissionType
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
        public IEnumerable<(AppAssignment, IEnumerable<AssignmentSubmission>)> GetQuizzes(
            int courseID
        )
        {
            // Graded quizzes (assignment quizzes) are also treated as assignments by canvas and will be handled accordingly.
            return Connector
                .FindCourseById(courseID)
                .Quizzes.Where(quiz => quiz.Type != QuizType.Assignment)
                .Select(quiz =>
                    (
                        new AppAssignment(
                            -1,
                            quiz.ID ?? -1,
                            courseID,
                            quiz.Name,
                            quiz.IsPublished,
                            false,
                            quiz.DueDate.HasValue ? quiz.DueDate.Value.ToShortDateString() : "0", // TODO: should this be seconds or milliseconds?
                            quiz.PointsPossible ?? 0,
                            0,
                            AppGradingType.Points,
                            JsonConvert.SerializeObject(quiz.Type)
                        ),
                        quiz.Submissions.Where(sub => sub.Score != null)
                            .Select(sub => new AssignmentSubmission(
                                -1,
                                -1,
                                quiz.ID ?? -1,
                                sub.UserID.ToString(),
                                sub.Score ?? 1,
                                sub.FinishedDate.Value.ToShortDateString()
                            ))
                    )
                );
        }

        /// <inheritdoc />
        public IEnumerable<AssignmentSubmission> GetSubmissions(int courseID, string[] userIDs)
        {
            if (userIDs.Length == 0)
            {
                return Enumerable.Empty<AssignmentSubmission>();
            }

            return Connector
                .FindCourseById(courseID)
                .GetSubmissions(userIDs, false)
                .SelectMany(group => group.Submissions)
                .Select(sub => new AssignmentSubmission(
                    -1,
                    sub.ID ?? -1,
                    sub.AssignmentID,
                    sub.User != null ? sub.User.SISUserID : sub.UserID, // FIXME: fsr both the .User and .UserID fields are always null
                    sub.Grade,
                    sub.SubmittedAt.HasValue ? sub.SubmittedAt.Value.ToShortDateString() : ""
                ));
        }

        /// <inheritdoc />
        public IEnumerable<AppDiscussion> GetDiscussions(int courseID)
        {
            return Connector
                .FindCourseById(courseID)
                .Discussions.SelectMany(topic =>
                    topic
                        .Entries.SelectMany(entry =>
                            entry
                                .Replies.Select(reply => new AppDiscussion(
                                    -1,
                                    Discussion_type.reply,
                                    reply.ID ?? -1,
                                    entry.ID ?? -1,
                                    courseID,
                                    topic.Title,
                                    reply.UserID.ToString(),
                                    reply.CreatedAt.Value.ToShortDateString(),
                                    reply.Message
                                ))
                                .Append(
                                    new AppDiscussion(
                                        -1,
                                        Discussion_type.entry,
                                        entry.ID ?? -1,
                                        topic.ID ?? -1,
                                        courseID,
                                        topic.Title,
                                        entry.UserID.ToString(),
                                        entry.CreatedAt.Value.ToShortDateString(),
                                        entry.Message
                                    )
                                )
                        )
                        .Append(
                            new AppDiscussion(
                                -1,
                                Discussion_type.topic,
                                topic.ID ?? -1,
                                -1,
                                courseID,
                                topic.Title,
                                topic.UserName,
                                topic.PostedAt.ToString(),
                                topic.Message
                            )
                        )
                );
        }
    }
}
