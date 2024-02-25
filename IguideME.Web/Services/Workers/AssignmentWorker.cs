using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection.Metadata;
using IguideME.Web.Models;
using IguideME.Web.Models.App;
using IguideME.Web.Services.LMSHandlers;

using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;

namespace IguideME.Web.Services.Workers
{

    /// <summary>
    /// Class <a>AssignemntWorker</a> models a worker that handles registering assignments during a sync..
    /// </summary>
    public class AssignmentWorker : IWorker
    {
        readonly private ILogger<SyncManager> _logger;
        readonly private ILMSHandler _ILMSHandler;
        private readonly DatabaseManager _databaseManager;

        readonly private int _courseID;
        readonly private long _syncID;

        /// <summary>
        /// This constructor initializes the new AssignmentWorker to:
        /// (<paramref name="courseID"/>, <paramref name="syncID"/>, <paramref name="ILMSHandler"/>, <paramref name="logger"/>).
        /// </summary>
        /// <param name="courseID">the id of the course.</param>
        /// <param name="syncID">the hash code associated to the current sync.</param>
        /// <param name="ILMSHandler">a reference to the class managing the connection with canvas.</param>
        /// <param name="logger">a reference to the logger used for the sync.</param>
        public AssignmentWorker(
            int courseID,
            long syncID,
            ILMSHandler ILMSHandler,
            DatabaseManager databaseManager,
            ILogger<SyncManager> logger)
        {
            _logger = logger;
            _courseID = courseID;
            _syncID = syncID;
            _ILMSHandler = ILMSHandler;
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
        private void RegisterSubmissions(IEnumerable<AssignmentSubmission> submissions, Dictionary<int, (double, AppGradingType)> gradingTypes)
        {
            _logger.LogInformation("Starting submission registry...");

            double max;
            AppGradingType type;
            (double, AppGradingType) elem;
            foreach (AssignmentSubmission submission in submissions)
            {
                if (gradingTypes.TryGetValue(submission.AssignmentID, out elem))
                {
                    (max, type) = elem;
                    switch (type)
                    {
                        case AppGradingType.Points:
                            submission.Grade = (submission.RawGrade != null ? double.Parse(submission.RawGrade): submission.Grade) * 100/max;
                            break;
                        case AppGradingType.Percentage:
                            submission.Grade = submission.RawGrade != null ? double.Parse(submission.RawGrade): submission.Grade;
                            break;
                        case AppGradingType.Letters:
                            submission.Grade = LetterToGrade(submission.RawGrade??"0");
                            break;
                        case AppGradingType.PassFail:
                            _logger.LogInformation("passfail text: {Grade}", submission.RawGrade);
                            submission.Grade = submission.RawGrade == "PASS" ? 100 : 0;
                            break;
                        case AppGradingType.NotGraded:
                            submission.Grade = -1;
                            break;
                        default:
                            submission.Grade = -1;
                            _logger.LogWarning("Grade format {Type} is not supported, submissions.Grade = {Grade}, treating as not graded...", gradingTypes[submission.AssignmentID], submission.RawGrade);
                            break;
                    }

                    _databaseManager.CreateUserSubmission(submission);
                }
            }
        }

        /// <summary>
        /// Starts the assignment worker.
        /// </summary>S
        public void Start()
        {
            _logger.LogInformation("Starting assignment registry...");

            // Get the assignments from the ILMS.
            IEnumerable<AppAssignment> assignments = this._ILMSHandler.GetAssignments(this._courseID);
            List<TileEntry> entries = _databaseManager.GetAllTileEntries(this._courseID);

            // Get the consented users and only ask for their submissions
            List<Models.Impl.User> users = _databaseManager.GetUsersWithGrantedConsent(this._courseID);
            if (users.Count == 0) //if no users have given consent yet, no point to continue
                return;
            IEnumerable<AssignmentSubmission> submissions = this._ILMSHandler.GetSubmissions(this._courseID, users);

            Dictionary<int, (double, AppGradingType)> gradingTypes = new();
            List<AssignmentSubmission> assignmentSubmissionsWithTiles = new ();

            foreach (AppAssignment assignment in assignments)
            {
                _logger.LogInformation("Processing assignment: {Name}", assignment.Title);
                assignment.ID = _databaseManager.RegisterAssignment(assignment);

                // Don't register submissions that aren't assigned to tiles (as entries).
                TileEntry entry = entries.Find(e => e.ContentID == assignment.ID);
                if (entry == null) continue;

                // We register the internal assignmentID in the submission entity
                foreach (AssignmentSubmission sub in submissions) {
                    if (sub.AssignmentID == assignment.ExternalID) {
                        sub.AssignmentID = assignment.ID;
                        assignmentSubmissionsWithTiles.Add(sub);
                    }
                }

                gradingTypes.Add(assignment.ID, (assignment.MaxGrade, assignment.GradingType));
            }

            if (assignmentSubmissionsWithTiles.Count() > 0 && gradingTypes.Count() > 0)
                this.RegisterSubmissions(assignmentSubmissionsWithTiles, gradingTypes);
        }
    }
}
