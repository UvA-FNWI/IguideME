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
    public class CanvasTest
    {
        private readonly ILogger<SyncManager> _logger;
        CanvasApiConnector connector;
        public string baseUrl;
        public string accessToken;
        private static readonly HttpClient client = new HttpClient();

        public CanvasTest(IConfiguration config, ILogger<SyncManager> logger)
        {
            _logger = logger;
            this.accessToken = config["Canvas:AccessToken"];
            this.baseUrl = config["Canvas:Url"];
            this.connector = new CanvasApiConnector(config["Canvas:Url"], config["Canvas:AccessToken"]);
        }

        public void sendMessage(string LoginID, string subject, string body)
        {
            try {
                var conv = new Conversation(this.connector)
                {
                    Subject = subject,
                    Body = body,
                    Recipients = new string[1] { "sis_user_id:" + LoginID }
                };
                _logger.LogInformation("Created conversation " + conv + " " + conv.Recipients);

                conv.Save();
            }
            catch (System.Net.WebException e) {
                _logger.LogError(e.ToString());
                _logger.LogError( ((System.Net.HttpWebResponse) e.Response).StatusDescription);
                _logger.LogError(new System.IO.StreamReader(((System.Net.HttpWebResponse) e.Response).GetResponseStream()).ReadToEnd());
                _logger.LogError( ((System.Net.HttpWebResponse) e.Response).ToString());
            }
        }

        public User GetUser(int courseID, string sisLoginID)
        {
            var users = connector.FindCourseById(courseID).UserEnrollments.Select(x => x.User).ToArray();
            return users.First(x => x.SISUserID == sisLoginID);
        }

        public User[] GetStudents(int courseID)
        {
            _logger.LogInformation("Finding course by id, id = " + courseID);
            _logger.LogInformation("Course = " + connector.FindCourseById(courseID));
            _logger.LogInformation("Getting users " + connector.FindCourseById(courseID).GetUsersByType(EnrollmentType.Student).ToArray());

            return connector.FindCourseById(courseID).GetUsersByType(EnrollmentType.Student).ToArray();
        }

        public User[] GetAdministrators(int courseID)
        {
            return connector.FindCourseById(courseID).GetUsersByType(EnrollmentType.Teacher).ToArray();
        }

        public Assignment[] GetCanvasAssignments(int courseID)
        {
            return connector
                .FindCourseById(courseID)
                .Assignments
                .OrderBy(a => a.Position).ToArray();
        }


        public Discussion[] GetCanvasDiscussions(int courseID)
        {
            return connector
                .FindCourseById(courseID)
                .Discussions.ToArray();
        }

        public Assignment[] GetAssignments(int courseID)
        {
            return connector
                .FindCourseById(courseID)
                .Assignments
                .OrderBy(a => a.Position).ToArray();
        }

        public Assignment[] GetAssignments(int courseID, params string[] titles)
        {
            return connector
                .FindCourseById(courseID)
                .Assignments.Where(a => titles.Contains(a.Name.ToLower()))
                .OrderBy(a => a.Position).ToArray();
        }

        public Submission[] GetSubmissions(int courseID, int userID)
        {
            var whitelist = DatabaseManager.Instance.GetGrantedConsents(courseID).Select(x => x.UserID.ToString());

            // Returns all submissions of type 'on_paper' for a specified user.
            Submission[] submissions = connector
                .FindCourseById(courseID)
                .Assignments.Where(a => a.SubmissionTypes.ToList().Contains(SubmissionType.OnPaper))
                .Select(a => a.Submissions.Where(s => s.UserID == userID.ToString()))
                .SelectMany(i => i).Where(x => whitelist.Contains(x.UserID)).ToArray();

            return submissions;
        }

        public float[] GetAllSubmissionGrades(int courseID)
        {
            float[] grades = connector
                .FindCourseById(courseID)
                .Assignments
                .Select(a => a.Submissions).SelectMany(i => i)
                .Where(x => x.Grade != null)
                .Select(x => float.Parse(x.Grade)).ToArray();

            return grades;
        }

        public List<Quiz> GetQuizzes(int courseID)
        {
            return connector
                .FindCourseById(courseID)
                .Quizzes;
        }

        public List<Discussion> GetDiscussions(int courseID)
        {
            return connector
                .FindCourseById(courseID)
                .Discussions;
        }

        public Submission[] GetAssignmentSubmissions(int courseID, string userLoginID, string name)
        {
            var assignment = connector
                .FindCourseById(courseID)
                .Assignments.Find(a => a.Name == name);

            var userSubmissions = userLoginID != null ?
                assignment.Submissions.Where(x => x.User.LoginID == userLoginID) :
                assignment.Submissions;

            var submissions = connector
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
