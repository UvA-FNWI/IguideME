using System.Collections.Generic;
using IguideME.Web.Models;
using IguideME.Web.Models.App;
using IguideME.Web.Models.Impl;
using IguideME.Web.Services.LMSHandlers;
using Microsoft.EntityFrameworkCore.Query.SqlExpressions;
using Microsoft.Extensions.Logging;

namespace IguideME.Web.Services.Workers
{
    /// <summary>
    /// Class <a>AssignemntWorker</a> models a worker that handles registering assignments during a sync..
    /// </summary>
    public class AssignmentWorker
    {
        private readonly ILogger<SyncManager> _logger;
        private readonly ILMSHandler _lmsHandler;
        private readonly int _courseID;
        private readonly string _hashCode;

        /// <summary>
        /// This constructor initializes the new AssignmentWorker to:
        /// (<paramref name="courseID"/>, <paramref name="hashCode"/>, <paramref name="lmsHandler"/>, <paramref name="logger"/>).
        /// </summary>
        /// <param name="courseID">the id of the course.</param>
        /// <param name="hashCode">the hash code associated to the current sync.</param>
        /// <param name="lmsHandler">a reference to the class managing the connection with canvas.</param>
        /// <param name="logger">a reference to the logger used for the sync.</param>
        public AssignmentWorker(
            int courseID,
            string hashCode,
            ILMSHandler lmsHandler,
            ILogger<SyncManager> logger
        )
        {
            _logger = logger;
            this._courseID = courseID;
            this._hashCode = hashCode;
            this._lmsHandler = lmsHandler;
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
        /// <param name="submissions">the submissions to be registered.</param>
        /// <param name="gradingTypes">A map of tile id's to the max grades and grading types.</param>
        private void RegisterSubmissions(
            IEnumerable<AssignmentSubmission> submissions,
            Dictionary<int, (double, AppGradingType, int)> gradingTypes
        )
        {
            _logger.LogInformation("Starting submission registry...");

            double max;
            AppGradingType type;
            int entry_id;
            (double, AppGradingType, int) elem;

            foreach (AssignmentSubmission submission in submissions)
            {
                double grade;
                if (gradingTypes.TryGetValue(submission.AssignmentID.Value, out elem))
                {
                    (max, type, entry_id) = elem;
                    submission.EntryID = entry_id;
                    switch (type)
                    {
                        case AppGradingType.Points:
                            if (submission.rawGrade != null)
                            {
                                submission.Grade = (double.Parse(submission.rawGrade)) * 100 / max;
                            }
                            else
                            {
                                submission.Grade = 0;
                            }
                            break;
                        case AppGradingType.Percentage:
                            string clean = submission.rawGrade.Replace(
                                System
                                    .Globalization
                                    .CultureInfo
                                    .CurrentCulture
                                    .NumberFormat
                                    .PercentSymbol,
                                ""
                            );

                            grade = double.Parse(clean);
                            break;
                        case AppGradingType.Letters:
                            grade = LetterToGrade(submission.rawGrade);
                            break;
                        case AppGradingType.PassFail:
                            _logger.LogInformation("passfail text: {Grade}", submission.Grade);
                            grade = submission.rawGrade == "PASS" ? 100 : 0;
                            break;
                        case AppGradingType.NotGraded:
                            grade = -1;
                            break;
                        default:
                            grade = -1;
                            _logger.LogError(
                                "Grade format {Type} is not supported, grade = {Grade}",
                                type,
                                submission.Grade
                            );
                            break;
                    }

                    _logger.LogInformation("processing entryid {}", submission.EntryID);
                    DatabaseManager.Instance.CreateUserSubmission(
                        this._courseID,
                        submission,
                        _hashCode
                    );
                }
            }
        }

        /// <summary>
        /// Starts the assignment worker.
        /// </summary>S
        public void Start()
        {
            _logger.LogInformation("Starting assignment registry...");

            IEnumerable<AppAssignment> assignments = this._lmsHandler.GetAssignments(
                this._courseID
            );
            List<TileEntry> entries = DatabaseManager.Instance.GetEntries(this._courseID);

            List<User> users = DatabaseManager.Instance.GetUsersWithGrantedConsent(this._courseID);

            IEnumerable<AssignmentSubmission> submissions = this._lmsHandler.GetSubmissions(
                this._courseID,
                users
            );
            Dictionary<int, (double, AppGradingType, int)> gradingTypes = new();
            List<AssignmentSubmission> assignmentSubmissionsWithTiles = new ();

            foreach (AppAssignment assignment in assignments)
            {
                _logger.LogInformation("Processing assignment: {Name}", assignment.Name);

                DatabaseManager.Instance.RegisterAssignment(assignment, _hashCode);

                // Don't register submissions that aren't assigned to tiles (as entries).
                TileEntry entry = entries.Find(e => e.Title == assignment.Name);
                if (entry == null)
                    continue;

                gradingTypes.Add(
                    assignment.AssignmentID,
                    (assignment.PointsPossible, assignment.GradingType, entry.ID)
                );

                // We find all submissions for this assignment, and save them with the corresponding entryID that we found
                foreach (AssignmentSubmission sub in submissions) {
                    if(sub.AssignmentID == assignment.AssignmentID){
                        sub.EntryID = entry.ID;
                        assignmentSubmissionsWithTiles.Add(sub);
                    }
                }
            }

            // Finally we register the submissions
            this.RegisterSubmissions(assignmentSubmissionsWithTiles, gradingTypes);
        }
    }
}
