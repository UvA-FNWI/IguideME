﻿using Microsoft.Extensions.Configuration;
using System.Collections.Generic;
using System.Linq;
using UvA.DataNose.Connectors.Canvas;
using Microsoft.Extensions.Logging;
using IguideME.Web.Services.LMSHandlers;
using IguideME.Web.Models.App;
using IguideME.Web.Models.Impl;

using User = IguideME.Web.Models.Impl.User;
using CanvasUser = UvA.DataNose.Connectors.Canvas.User;
using System;

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
            this.AccessToken = config["Canvas:AccessToken"];
            this.BaseUrl = config["Canvas:Url"];
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
            try
            {
                Conversation conv = new(this.Connector)
                {
                    Subject = subject,
                    Body = body,
                    Recipients = new string[1] { userID }
                };
                _logger.LogInformation("Created conversation {title} for {recipients}", conv, conv.Recipients[0]);

                conv.Save();
            }
            catch (System.Net.WebException e)
            {
                _logger.LogError("Error sending message: {error}", e);
                _logger.LogError("Status description: {status}", ((System.Net.HttpWebResponse)e.Response).StatusDescription);
                _logger.LogError("Response: {response}", new System.IO.StreamReader(((System.Net.HttpWebResponse)e.Response).GetResponseStream()).ReadToEnd());
            }
        }

        /// <inheritdoc />
        public string[] GetUserIDs(int courseID, string userID)
        {
            _logger.LogInformation("Trying to get user\ncourseID: {courseID}, userID: {userID}", courseID, userID);
            List<Enrollment> users = Connector.FindCourseById(courseID).Enrollments;
            CanvasUser user = users.First(x => x.UserID == userID).User;
            return new string[]{user.LoginID, user.SISUserID, user.ID.ToString()};
        }

        /// <inheritdoc />
        public IEnumerable<User> GetStudents(int courseID)
        {
            Course course = Connector.FindCourseById(courseID);
            IEnumerable<CanvasUser> students = course.GetUsersByType(EnrollmentType.Student).ToArray();
            
            return students.Select(student => new User(student.SISUserID, courseID, student.ID.Value, student.Name, student.SortableName, (int) UserRoles.student));
        }

        /// <inheritdoc />
        public IEnumerable<User> GetAdministrators(int courseID)
        {
            IEnumerable<CanvasUser> admins = Connector.FindCourseById(courseID).GetUsersByType(EnrollmentType.Teacher).ToArray();
            return admins.Select(admin => new User(admin.SISUserID, courseID, admin.ID.Value, admin.Name, admin.SortableName, (int) UserRoles.instructor));
        }

        /// <inheritdoc />
        public IEnumerable<AppAssignment> GetAssignments(int courseID)
        {
            return Connector
                .FindCourseById(courseID)
                .Assignments
                .Where(assignment => assignment != null)
                .OrderBy(a => a.Position)

                .Select(ass => new AppAssignment(
                ass.ID.Value,
                courseID,
                ass.Name,
                ass.IsPublished,
                ass.IsMuted,
                ass.DueDate.HasValue ? (int)((DateTimeOffset) ass.DueDate.Value).ToUnixTimeSeconds() : 0,
                ass.PointsPossible ??= 0,
                (int) ass.GradingType));
        }

        /// <inheritdoc />
        public IEnumerable<AssignmentSubmission> GetSubmissions(int courseID, string[] userIDs)
        {
            return Connector
                .FindCourseById(courseID)
                .GetSubmissions(userIDs, false)
                .SelectMany(group => group.Submissions)
                .Select(sub => new AssignmentSubmission(
                    -1,
                    sub.AssignmentID,
                    sub.User.SISUserID,
                    null,
                    sub.Grade,
                    ((DateTimeOffset)sub.SubmittedAt.Value).ToUnixTimeMilliseconds()
                ));
        }

        /// <inheritdoc />
        public IEnumerable<(AppAssignment, IEnumerable<AssignmentSubmission>)> GetQuizzes(int courseID)
        {
			// Graded quizzes (assignment quizzes) are also treated as assignments by canvas and will be handled accordingly.
            return Connector
                .FindCourseById(courseID)
                .Quizzes
                .Where(quiz => quiz.Type != QuizType.Assignment)
                .Select(quiz => (
                    new AppAssignment(
                        quiz.ID ?? -1,
                        courseID,
                        quiz.Name,
                        quiz.IsPublished,
                        false,
                        quiz.DueDate.HasValue ? (int)((DateTimeOffset)quiz.DueDate.Value).ToUnixTimeSeconds() : 0, // TODO: should this be seconds or milliseconds?
                        quiz.PointsPossible ?? 0,
                        (int)GradingType.Points
                    ),
                    quiz.Submissions
                        .Where(sub => sub.Score != null)
                        .Select(sub => new AssignmentSubmission(-1, quiz.ID ?? -1, sub.UserID.ToString(), sub.Score ?? 1, ((DateTimeOffset)sub.FinishedDate.Value).ToUnixTimeMilliseconds() ))
                )
            );
        }

        /// <inheritdoc />
        public IEnumerable<AppDiscussion> GetDiscussions(int courseID)
        {
            return Connector
                .FindCourseById(courseID)
                .Discussions.SelectMany(topic => 
                    topic.Entries.SelectMany(entry => 
                        entry.Replies.Select(reply => new AppDiscussion(
                            Discussion_type.Reply,
                            reply.ID ?? -1,
                            entry.ID ?? -1,
                            courseID,
                            topic.Title,
                            reply.UserID.ToString(),
                            ((DateTimeOffset) reply.CreatedAt.Value).ToUnixTimeMilliseconds(),
                            reply.Message
                        ))
                        .Append(new AppDiscussion(
                            Discussion_type.Entry,
                            entry.ID ?? -1,
                            topic.ID ?? -1,
                            courseID,
                            topic.Title,
                            entry.UserID.ToString(),
                            ((DateTimeOffset) entry.CreatedAt).ToUnixTimeMilliseconds(),
                            entry.Message
                        ))
                    )
                    .Append(new AppDiscussion(
                        Discussion_type.Topic,
                        topic.ID ?? -1,
                        -1,
                        courseID,
                        topic.Title,
                        topic.UserName,
                        ((DateTimeOffset) topic.PostedAt).ToUnixTimeMilliseconds(),
                        topic.Message
                    ))
                );
        }
    }
}
