using System;
using System.Collections.Generic;
using System.Linq;

using GraphQL;

using IguideME.Web.Models;

using Microsoft.Extensions.Logging;

using UvA.DataNose.Connectors.Canvas;

namespace IguideME.Web.Services.Workers
{

    /// <summary>
    /// Class <a>AssignemntWorker</a> models a worker that handles registering assignments during a sync..
    /// </summary>
    public class AssignmentWorker : IWorker
    {
        readonly private ILogger<SyncManager> _logger;
        readonly private CanvasHandler _canvasHandler;
        private readonly DatabaseManager _databaseManager;

        readonly private int _courseID;
        readonly private long _syncID;

        /// <summary>
        /// This constructor initializes the new AssignmentWorker to:
        /// (<paramref name="courseID"/>, <paramref name="syncID"/>, <paramref name="canvasHandler"/>, <paramref name="logger"/>).
        /// </summary>
        /// <param name="courseID">the id of the course.</param>
        /// <param name="syncID">the hash code associated to the current sync.</param>
        /// <param name="canvasHandler">a reference to the class managing the connection with canvas.</param>
        /// <param name="logger">a reference to the logger used for the sync.</param>
        public AssignmentWorker(
            int courseID,
            long syncID,
            CanvasHandler canvasHandler,
            DatabaseManager databaseManager,
            ILogger<SyncManager> logger)
        {
            _logger = logger;
            _courseID = courseID;
            _syncID = syncID;
            _canvasHandler = canvasHandler;
            _databaseManager = databaseManager;
        }

        /// <summary>
        /// Convert letter grading systems to our internal system of grades between 0 and 100.
        /// </summary>
        /// <param name="grade">the grade as a letter that should be converted.</param>
        /// <returns>The grade as a percentage.</returns>
        static private double LetterToGrade(string grade)
        {

            return grade switch
            {
                "A" => 100,
                "A-" => 93,
                "B+" => 89,
                "B" => 86,
                "B-" => 83,
                "C+" => 79,
                "C" => 76,
                "C-" => 73,
                "D+" => 69,
                "D" => 66,
                "D-" => 63,
                "F" => 60,
                _ => 0.00,
            };
        }

        /// <summary>
        /// Register submissions associated to an assignment in the database.
        /// </summary>
        /// <param name="assignment">the assignment the submissions are associated to.</param>
        /// <param name="entry">the tile entry the submissions are associated to.</param>
        private void RegisterSubmissions(IEnumerable<SubmissionGroup> submissionGroups, Dictionary<int, GradingType> gradingTypes)
        {
            GradingType type;
            foreach (SubmissionGroup group in submissionGroups)
            {

                foreach (Submission submission in group.Submissions)
                {
                    // WE NEED TO CHANGE THE SUBMISSION IDs FROM EXTERNAL ASSIGNMENT ID TO INTERNAL ASSIGNMENT ID
                    submission.AssignmentID = _databaseManager.GetInternalAssignmentID(_courseID, submission.AssignmentID);

                    if (gradingTypes.TryGetValue(submission.AssignmentID, out type))
                    {

                        double grade;

                        switch (gradingTypes[submission.AssignmentID])
                        {
                            case GradingType.Points:
                                // grade = (double.Parse(submission.Grade) - 1)/0.09; // should switch to this
                                grade = double.Parse(submission.Grade);
                                break;
                            case GradingType.Percentage:
                                grade = double.Parse(submission.Grade);
                                break;
                            case GradingType.GPA:
                            case GradingType.Letters:
                                grade = LetterToGrade(submission.Grade);
                                break;
                            case GradingType.PassFail:
                                _logger.LogInformation("passfail text: {Grade}", submission.Grade);
                                grade = submission.Grade == "PASS" ? 100 : 0;
                                break;
                            case GradingType.NotGraded:
                                grade = -1;
                                break;
                            default:
                                grade = -1;
                                _logger.LogWarning("Grade format {Type} is not supported, grade = {Grade}, treating as not graded...", gradingTypes[submission.AssignmentID], submission.Grade);
                                break;
                        }

                        _databaseManager.CreateUserSubmission(
                                submission.AssignmentID,
                                submission.User.LoginID,
                                grade,
                                ((DateTimeOffset)submission.SubmittedAt.Value).ToUnixTimeMilliseconds()
                                );
                    }
                }
            }
        }

        /// <summary>
        /// Starts the assignment worker.
        /// </summary>S
        public void Start()
        {
            _logger.LogInformation("Starting assignment registry...");

            IEnumerable<Assignment> assignments = this._canvasHandler.GetAssignments(this._courseID);
            List<TileEntry> entries = _databaseManager.GetEntries(this._courseID);

            List<Models.Impl.User> users = _databaseManager.GetUsersWithGrantedConsent(this._courseID);
            IEnumerable<SubmissionGroup> submissions = this._canvasHandler.GetSubmissions(this._courseID, users.Select(user => user.UserID).ToArray());

            Dictionary<int, GradingType> gradingTypes = new();

            foreach (Assignment assignment in assignments)
            {
                _logger.LogInformation("Processing assignment: {Name}", assignment.Name);

                _databaseManager.RegisterAssignment(
                    assignment.ID,
                    assignment.CourseID,
                    assignment.Name ??= "?",
                    assignment.IsPublished,
                    assignment.IsMuted,
                    assignment.DueDate.HasValue ? (int)((DateTimeOffset)assignment.DueDate.Value).ToUnixTimeSeconds() : 0,
                    assignment.PointsPossible ??= 0,
                    (int)assignment.GradingType
                );

                // Don't register submissions that aren't assigned to tiles (as entries).
                TileEntry entry = entries.Find(e => e.ContentID == assignment.ID);
                if (entry == null || assignment.ID == null) continue;

                gradingTypes.Add(assignment.ID.Value, assignment.GradingType);

            }

            this.RegisterSubmissions(submissions, gradingTypes);

        }

    }
}
