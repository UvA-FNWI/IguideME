﻿using Microsoft.Extensions.Configuration;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using UvA.DataNose.Connectors.Canvas;

namespace IguideME.Web.Services
{
    public class CanvasTest
    {
        CanvasApiConnector connector;
        public string baseUrl;
        public string accessToken;
        public string apiVersioning = "api/v1/";
        private static readonly HttpClient client = new HttpClient();

        public CanvasTest(IConfiguration config)
        {
            this.accessToken = config["Canvas:AccessToken"];
            this.baseUrl = config["Canvas:Url"];
            connector = new CanvasApiConnector(config["Canvas:Url"], config["Canvas:AccessToken"]);
        }

        public string[] GetStudents(int courseId)
            => connector.FindCourseById(courseId).GetUsersByType(EnrollmentType.Student).Select(s => s.Name).ToArray();

        public Submission[] GetSubmissions(int courseID, int userID)
        {
            // Returns all submissions of type 'on_paper' for a specified user.
            Submission[] submissions = connector
                .FindCourseById(courseID)
                .Assignments.Where(a => a.SubmissionTypes.ToList().Contains(SubmissionType.OnPaper))
                .Select(a => a.Submissions.Where(s => s.UserID == userID.ToString()))
                .SelectMany(i => i).ToArray();

            return submissions;
        }

        public float[] GetAllSubmissionGrades(int courseID)
        {
            // Returns all submissions of type 'on_paper' for a specified user.
            float[] grades = connector
                .FindCourseById(courseID)
                .Assignments.Where(a => a.SubmissionTypes.ToList().Contains(SubmissionType.OnPaper))
                .Select(a => a.Submissions).SelectMany(i => i).Select(x => float.Parse(x.Grade)).ToArray();

            return grades;
        }

        public Dictionary<string, object> GetQuizzes(int courseID, int userID) {
            /*
             * Returns all quizzes available to a specified user.
             * 
             * Response format:
             * {
             *   "submissions": [List of submissions],
             *   "quizzes": [Lis of quizzes],
             *   "questions": [User answer per question]
             * }
             */

            IEnumerable<Assignment> assignments = connector
                .FindCourseById(courseID)
                .Assignments.Where(a => a.SubmissionTypes.ToList().Contains(SubmissionType.Quiz));

            // fetch all quiz submissions for specified user
            Submission[] submissions = assignments
                .Select(a => a.Submissions.Where(s => s.UserID == userID.ToString()))
                .SelectMany(i => i).ToArray();

            // fetch course quizzes
            Quiz[] quizzes = connector.FindCourseById(courseID).Quizzes.ToArray();

            return new Dictionary<string, object>
            {
                { "peer_comp",  assignments.Select(a => a.Submissions.Where(x => x.Grade != null).Select(x => float.Parse(x.Grade))).SelectMany(i => i)},
                { "submissions", submissions },
                { "quizzes", quizzes },
                { "questions", quizzes.Select(quiz => quiz.Submissions.Select(submission => submission.Answers)).ToArray() }
            };
        }

        public Discussion[] GetDiscussions(int courseId, string userName)
        {
            return connector.FindCourseById(courseId).Discussions.Where(d => d.UserName == userName).ToArray();
        }
    }
}
