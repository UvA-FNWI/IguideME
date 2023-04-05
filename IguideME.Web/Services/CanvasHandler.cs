using IguideME.Web.Models;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text.Json;
using UvA.DataNose.Connectors.Canvas;
using Microsoft.Extensions.Logging;

namespace IguideME.Web.Services
{
    public class CanvasHandler
    {
        private readonly ILogger<SyncManager> _logger;
        readonly CanvasApiConnector _connector;
        public string BaseUrl;
        public string AccessToken;
        private static readonly HttpClient Client = new();

        public CanvasHandler(IConfiguration config, ILogger<SyncManager> logger)
        {
            _logger = logger;
            this.AccessToken = config["Canvas:AccessToken"];
            this.BaseUrl = config["Canvas:Url"];
            this._connector = new CanvasApiConnector(config["Canvas:Url"], config["Canvas:AccessToken"]);
            _logger.LogInformation("creating canvas connection");
        }

        public void SendMessage(string userID, string subject, string body)
        {
            try {
                Conversation conv = new(this._connector)
                {
                    Subject = subject,
                    Body = body,
                    Recipients = new string[1] { userID }
                };
                _logger.LogInformation("Created conversation {Conversation} {Recipients}", conv, conv.Recipients[0]);

                conv.Save();
            }
            catch (System.Net.WebException e) {
                _logger.LogError("{Error}", e.ToString());
                _logger.LogError("{Error}", ((System.Net.HttpWebResponse) e.Response).StatusDescription);
                _logger.LogError("{Error}", new System.IO.StreamReader(((System.Net.HttpWebResponse) e.Response).GetResponseStream()).ReadToEnd());
                _logger.LogError("{Error}", ((System.Net.HttpWebResponse) e.Response).ToString());
            }
        }

        public User GetUser(int courseID, string userID)
        {
            _logger.LogInformation("Trying to get user\ncourseID: {CourseID}, userID: {UserID}", courseID, userID);
            Course course = _connector.FindCourseById(courseID);

            _logger.LogInformation("Found course {Course} for user", course);
            List<Enrollment> users = course.Enrollments;

            _logger.LogInformation("Found enrolments:");
            foreach (Enrollment e in users) {
                _logger.LogInformation(" - {enrolment}", e);
            }
            _logger.LogInformation("Found users:");
            foreach (Enrollment e in users) {
                _logger.LogInformation(" - {user} {uid} {login}", e.User, e.UserID, e.User.LoginID);
            }

            return users.First(x => x.UserID == userID).User;
        }

        public string GetLoginID(int courseID, string sisID) {
            List<Enrollment> users = _connector.FindCourseById(courseID).Enrollments;
            return users.First(x => x.User.SISUserID == sisID).User.LoginID;
        }

        public User[] GetStudents(int courseID)
        {
            _logger.LogInformation("Finding course by id, id = {CourseId}", courseID);

            Course course = _connector.FindCourseById(courseID);
            _logger.LogInformation("Course = {Course}", course);

            User[] students = course.GetUsersByType(EnrollmentType.Student).ToArray();
            _logger.LogInformation("Getting users {Students}", students);

            return students;
        }

        public User[] GetAdministrators(int courseID)
        {
            return _connector.FindCourseById(courseID).GetUsersByType(EnrollmentType.Teacher).ToArray();
        }

        public Assignment[] GetCanvasAssignments(int courseID)
        {
            return _connector
                .FindCourseById(courseID)
                .Assignments
                .OrderBy(a => a.Position).ToArray();
        }


        public Discussion[] GetCanvasDiscussions(int courseID)
        {
            return _connector
                .FindCourseById(courseID)
                .Discussions.ToArray();
        }

        /// <summary>
        /// Get's all the non null assignemnts for a course from canvas.
        /// </summary>
        /// <param name="courseID">the id of the course the assignment are from.</param>
        /// <returns></returns>
        public IEnumerable<Assignment> GetAssignments(int courseID)
        {
            return _connector
                .FindCourseById(courseID)
                .Assignments
                .OrderBy(a => a.Position).Where(assignment => assignment != null);
        }

        public Assignment[] GetAssignments(int courseID, params string[] titles)
        {
            return _connector
                .FindCourseById(courseID)
                .Assignments.Where(a => titles.Contains(a.Name.ToLower()))
                .OrderBy(a => a.Position).ToArray();
        }

        public Submission[] GetSubmissions(int courseID, int userID)
        {
            IEnumerable<string> whitelist = DatabaseManager.Instance.GetGrantedConsents(courseID).Select(x => x.UserID);

            // Returns all submissions of type 'on_paper' for a specified user.
            Submission[] submissions = _connector
                .FindCourseById(courseID)
                .Assignments.Where(a => a.SubmissionTypes.ToList().Contains(SubmissionType.OnPaper))
                .Select(a => a.Submissions.Where(s => s.UserID == userID.ToString()))
                .SelectMany(i => i).Where(x => whitelist.Contains(x.UserID)).ToArray();

            return submissions;
        }

        public float[] GetAllSubmissionGrades(int courseID)
        {
            float[] grades = _connector
                .FindCourseById(courseID)
                .Assignments
                .Select(a => a.Submissions).SelectMany(i => i)
                .Where(x => x.Grade != null)
                .Select(x => float.Parse(x.Grade)).ToArray();

            return grades;
        }

        public List<Quiz> GetQuizzes(int courseID)
        {
            return _connector
                .FindCourseById(courseID)
                .Quizzes;
        }

        public List<Discussion> GetDiscussions(int courseID)
        {
            return _connector
                .FindCourseById(courseID)
                .Discussions;
        }

        public Submission[] GetAssignmentSubmissions(int courseID, string userID, string name)
        {
            Assignment assignment = _connector
                .FindCourseById(courseID)
                .Assignments.Find(a => a.Name == name);

            IEnumerable<Submission> userSubmissions = userID != null ?
                assignment.Submissions.Where(x => x.User.LoginID == userID) :
                assignment.Submissions;

            IEnumerable<Submission> submissions = _connector
                .FindCourseById(courseID)
                .Assignments
                .Where(a => a.Name == name)
                .Select(x => userSubmissions.Where(
                    y => y.AssignmentID == x.ID
                )).SelectMany(i => i);

            return submissions.ToArray();
        }
    }
}
