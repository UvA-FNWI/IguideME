using System.Collections.Generic;
using System.Linq;
using IguideME.Web.Models;
using IguideME.Web.Models.App;
using IguideME.Web.Services.LMSHandlers;
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
        readonly private ILMSHandler _canvasHandler;
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
            ILMSHandler canvasHandler,
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
        private void RegisterSubmissions(IEnumerable<AssignmentSubmission> submissions, Dictionary<int, GradingType> gradingTypes)
        {
            GradingType type;
            foreach (AssignmentSubmission submission in submissions)
            {
                // WE NEED TO CHANGE THE SUBMISSION IDs FROM EXTERNAL ASSIGNMENT ID TO INTERNAL ASSIGNMENT ID
                submission.AssignmentID = _databaseManager.GetInternalAssignmentID(_courseID, submission.AssignmentID);

                if (gradingTypes.TryGetValue(submission.AssignmentID, out type))
                {

                    switch (gradingTypes[submission.AssignmentID])
                    {
                        case GradingType.Points:
                            // submissions.Grade = (double.Parse(submission.RawGrade) - 1)/0.09; // should switch to this
                            submission.Grade = double.Parse(submission.RawGrade);
                            break;
                        case GradingType.Percentage:
                            submission.Grade = double.Parse(submission.RawGrade);
                            break;
                        case GradingType.GPA:
                        case GradingType.Letters:
                            submission.Grade = LetterToGrade(submission.RawGrade);
                            break;
                        case GradingType.PassFail:
                            _logger.LogInformation("passfail text: {Grade}", submission.RawGrade);
                            submission.Grade = submission.RawGrade == "PASS" ? 100 : 0;
                            break;
                        case GradingType.NotGraded:
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

            // Get the assignments from canvas.
            IEnumerable<AppAssignment> assignments = this._canvasHandler.GetAssignments(this._courseID);
            List<TileEntry> entries = _databaseManager.GetAllTileEntries(this._courseID);

            // Get the consented users and only ask for their submissions
            List<Models.Impl.User> users = _databaseManager.GetUsersWithGrantedConsent(this._courseID);
            IEnumerable<AssignmentSubmission> submissions = this._canvasHandler.GetSubmissions(this._courseID, users.Select(user => user.UserID).ToArray());

            Dictionary<int, GradingType> gradingTypes = new();

            foreach (AppAssignment assignment in assignments)
            {
                _logger.LogInformation("Processing assignment: {Name}", assignment.Title);

                _databaseManager.RegisterAssignment(assignment);

                // Don't register submissions that aren't assigned to tiles (as entries).
                TileEntry entry = entries.Find(e => e.ContentID == assignment.ID);
                if (entry == null) continue;

                gradingTypes.Add(assignment.ID, assignment.GradingType);

            }

            this.RegisterSubmissions(submissions, gradingTypes);

        }

    }
}
