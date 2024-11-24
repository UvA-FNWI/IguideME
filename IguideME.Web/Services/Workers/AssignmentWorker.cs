using System;
using System.Collections.Generic;
using System.Linq;
using IguideME.Web.Models.App;
using IguideME.Web.Services.LMSHandlers;
using Microsoft.Extensions.Logging;

namespace IguideME.Web.Services.Workers
{
    /// <summary>
    /// Class <a>AssignemntWorker</a> models a worker that handles registering assignments during a sync..
    /// </summary>
    public class AssignmentWorker : IWorker
    {
        private readonly ILogger<SyncManager> _logger;
        private readonly ILMSHandler _ILMSHandler;
        private readonly DatabaseManager _databaseManager;

        private readonly int _courseID;
        private readonly long _syncID;

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
            ILogger<SyncManager> logger
        )
        {
            _logger = logger;
            _courseID = courseID;
            _syncID = syncID;
            _ILMSHandler = ILMSHandler;
            _databaseManager = databaseManager;
        }

        /// <summary>
        /// Register submissions associated to an assignment in the database.
        /// </summary>
        /// <param name="assignment">the assignment the submissions are associated to.</param>
        /// <param name="entry">the tile entry the submissions are associated to.</param>
        private void RegisterSubmissions(
            IEnumerable<AssignmentSubmission> submissions,
            Dictionary<int, (double, AppGradingType)> gradingTypes
        )
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
                    submission.RawToGrade(type, max);

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
            List<AppAssignment> assignments = this._ILMSHandler.GetAssignments(
                this._courseID
            ).ToList();

            // Get the consented users and only ask for their submissions
            List<Models.Impl.User> users = _databaseManager.GetUsersWithGrantedConsent(
                this._courseID
            );
            if (users.Count == 0) //if no users have given consent yet, no point to continue
                return;
            IEnumerable<AssignmentSubmission> submissions = this._ILMSHandler.GetSubmissions(
                this._courseID,
                users
            );

            Dictionary<int, (double, AppGradingType)> gradingTypes = new();
            List<AssignmentSubmission> assignmentSubmissionsWithTiles = new();

            foreach (AppAssignment assignment in assignments)
            {
                _logger.LogInformation("Processing assignment: {Name}", assignment.Title);

                // The internal id is obtained after the assignment is registered in the database.
                assignment.ID = _databaseManager.RegisterAssignment(assignment);

                // Don't register submissions that aren't assigned to tiles (as entries).
                if (!_databaseManager.AssignmentHasEntry(this._courseID, assignment.ID))
                    continue;

                // We register the internal assignmentID in the submission entity, this is to support external data
                foreach (AssignmentSubmission sub in submissions)
                {
                    _logger.LogInformation("submission: {} {}", sub.UserID, sub.RawGrade);
                    if (sub.AssignmentID == assignment.ExternalID)
                    {
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
