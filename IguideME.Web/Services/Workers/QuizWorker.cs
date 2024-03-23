using System;
using System.Collections.Generic;
using IguideME.Web.Models;
using IguideME.Web.Models.App;
using IguideME.Web.Services.LMSHandlers;
using Microsoft.Extensions.Logging;

namespace IguideME.Web.Services.Workers
{
    /// <summary>
    /// Class <a>QuizWorker</a> models a worker that handles registering quizzes during a sync.
    /// </summary>
    public class QuizWorker
    {
        private readonly ILogger<SyncManager> _logger;
        private readonly ILMSHandler _lmsHandler;
        private readonly int _courseID;
        private readonly string _hashCode;

        /// <summary>
        /// This constructor initializes the new Quizworker to
        /// (<paramref name="courseID"/>, <paramref name="hashCode"/>, <paramref name="lmsHandler"/>, <paramref name="logger"/>).
        /// </summary>
        /// <param name="courseID">the id of the course.</param>
        /// <param name="hashCode">the hash code associated to the current sync.</param>
        /// <param name="lmsHandler">a reference to the class managing the connection with canvas.</param>
        /// <param name="logger">a reference to the logger used for the sync.</param>
        public QuizWorker(
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
        /// Register submissions associated to a quiz in the database.
        /// </summary>
        /// <param name="quiz">the quiz the submissions are associated to.</param>
        /// <param name="entry">the tile entry the submissions are associated to.</param>
        public void RegisterSubmissions(
            IEnumerable<AssignmentSubmission> submissions,
            TileEntry entry
        )
        {
            foreach (AssignmentSubmission sub in submissions)
            {
                sub.UserID = DatabaseManager.Instance.GetUserID(
                    this._courseID,
                    Int32.Parse(sub.UserID)
                );
                sub.EntryID = entry.ID;
                DatabaseManager.Instance.CreateUserSubmission(this._courseID, sub, this._hashCode);
            }
        }

        /// <summary>
        /// Starts the quiz worker.
        /// </summary>
        public void Start()
        {
            _logger.LogInformation("Starting quiz registry...");

            // Get the quizzes from canvas.
            IEnumerable<(AppAssignment, IEnumerable<AssignmentSubmission>)> quizzes =
                this._lmsHandler.GetQuizzes(_courseID);
            List<TileEntry> entries = DatabaseManager.Instance.GetEntries(this._courseID);

            // Register the quizzes in the database.

            foreach ((AppAssignment quiz, IEnumerable<AssignmentSubmission> submissions) in quizzes)
            {
                _logger.LogInformation("Processing quiz: {Name}", quiz.Name);
                DatabaseManager.Instance.RegisterAssignment(quiz, this._hashCode);

                // Don't register submissions that aren't assigned to tiles (as entries).
                TileEntry entry = entries.Find(e => e.Title == quiz.Name);
                if (entry == null)
                    continue;

                this.RegisterSubmissions(submissions, entry);
            }
        }
    }
}
