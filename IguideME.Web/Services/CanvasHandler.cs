using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using UvA.DataNose.Connectors.Canvas;
using Microsoft.Extensions.Logging;

namespace IguideME.Web.Services
{
    /// <summary>
    /// Class <a>CanvasHandler</a> models a singelton service that handles the communication with Canvas LMS..
    /// </summary>
    public class CanvasHandler
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
            this.CreateConnection();
        }

        /// <summary>
        /// Creates or renews a connection with canvas. We always initialize and keep one because we communicate with canvas outside of syncs as well.
        /// </summary>
        public void CreateConnection()
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

        /// <summary>
        /// Get a user for a course.
        /// </summary>
        /// <param name="courseID">The course to get the user from.</param>
        /// <param name="userID">The id of the user.</param>
        /// <returns>The requested user if found.</returns>
        public User GetUser(int courseID, string userID)
        {
            _logger.LogInformation("Trying to get user\ncourseID: {courseID}, userID: {userID}", courseID, userID);
            List<Enrollment> users = Connector.FindCourseById(courseID).Enrollments;
            return users.First(x => x.UserID == userID).User;
        }

        /// <summary>
        /// Translate the sisID to the loginID. We use the latter throughout IguideME.
        /// </summary>
        /// <param name="courseID">The course the student is a part of.</param>
        /// <param name="sisID">The sisID of the user.</param>
        /// <returns>The loginID of the user.</returns>
        public string TranslateSISToLoginID(int courseID, string sisID)
        {
            List<Enrollment> users = Connector.FindCourseById(courseID).Enrollments;
            return users.First(x => x.User.SISUserID == sisID).User.LoginID;
        }

        // TODO: change many of these arrays to Enumerables.

        /// <summary>
        /// Get all the users with the student role for a course.
        /// </summary>
        /// <param name="courseID">The id of the course.</param>
        /// <returns>A list of students for the course.</returns>
        public User[] GetStudents(int courseID)
        {
            Course course = Connector.FindCourseById(courseID);
            User[] students = course.GetUsersByType(EnrollmentType.Student).ToArray();
            return students;
        }

        /// <summary>
        /// Get all the users with the admin role for a course.
        /// </summary>
        /// <param name="courseID">The id of the course.</param>
        /// <returns>A list of administrators for the course.</returns>
        public User[] GetAdministrators(int courseID)
        {
            return Connector.FindCourseById(courseID).GetUsersByType(EnrollmentType.Teacher).ToArray();
        }

        /// <summary>
        /// Gets all the non null assignemnts for a course from canvas.
        /// </summary>
        /// <param name="courseID">The id of the course the assignments are from.</param>
        /// <returns>An iterable with assignments for the course.</returns>
        public IEnumerable<Assignment> GetAssignments(int courseID)
        {
            return Connector
                .FindCourseById(courseID)
                .Assignments
                .Where(assignment => assignment != null)
                .OrderBy(a => a.Position);
        }

        /// <summary>
        /// Gets all the submissions for a lis of (consented) students for a course from canvas.
        /// </summary>
        /// <param name="courseID">The id of the course the assignments are from.</param>
        /// <param name="userIDs">The list of student ids that have given consent that the submissions are from.</param>
        /// <returns>An iterable with submissions for the course.</returns>
        public IEnumerable<SubmissionGroup> GetSubmissions(int courseID, string[] userIDs)
        {
            return Connector
                .FindCourseById(courseID)
                .GetSubmissions(userIDs, false);
        }

        /// <summary>
        /// Gets all the quizzes for a course.
        /// </summary>
        /// <param name="courseID">The id of the course the quizzes are from.</param>
        /// <returns>A list of quizzes.</returns>
        public List<Quiz> GetQuizzes(int courseID)
        {
            return Connector
                .FindCourseById(courseID)
                .Quizzes;
        }

        /// <summary>
        /// Gets all the Discussions for a course.
        /// </summary>
        /// <param name="courseID">The id of the course the quizzes are from.</param>
        /// <returns>A list of discussions.</returns>
        public List<Discussion> GetDiscussions(int courseID)
        {
            return Connector
                .FindCourseById(courseID)
                .Discussions;
        }
    }
}
