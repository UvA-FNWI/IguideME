﻿using System;
using System.Collections.Generic;
using System.Linq;

using IguideME.Web.Models;

using Microsoft.Extensions.Logging;

using Newtonsoft.Json;

using UvA.DataNose.Connectors.Canvas;

namespace IguideME.Web.Services.Workers
{
	/// <summary>
    /// Class <a>QuizWorker</a> models a worker that handles registering quizzes during a sync.
    /// </summary>
    public class QuizWorker
    {
        readonly private ILogger<SyncManager> _logger;
		readonly private CanvasHandler _canvasHandler;
		readonly private int _courseID;
		readonly private long _syncID;

		/// <summary>
        /// This constructor initializes the new Quizworker to
        /// (<paramref name="courseID"/>, <paramref name="syncID"/>, <paramref name="canvasHandler"/>, <paramref name="logger"/>).
        /// </summary>
        /// <param name="courseID">the id of the course.</param>
        /// <param name="syncID">the hash code associated to the current sync.</param>
        /// <param name="canvasHandler">a reference to the class managing the connection with canvas.</param>
        /// <param name="logger">a reference to the logger used for the sync.</param>
        public QuizWorker(
			int courseID,
			long syncID,
			CanvasHandler canvasHandler,
            ILogger<SyncManager> logger)

        {
			_logger = logger;
			this._courseID = courseID;
			this._syncID = syncID;
			this._canvasHandler = canvasHandler;
        }

		/// <summary>
        /// Register submissions associated to a quiz in the database.
        /// </summary>
        /// <param name="quiz">the quiz the submissions are associated to.</param>
        /// <param name="entry">the tile entry the submissions are associated to.</param>
        public void RegisterSubmissions(Quiz quiz, TileEntry entry)
        {
			IEnumerable<QuizSubmission> submissions = quiz.Submissions
                .Where(submission =>
					submission.Score != null &&
					DatabaseManager.getInstance().GetConsent(this._courseID,
						DatabaseManager.getInstance().GetUserID(this._courseID, submission.UserID), _syncID) > 0
				);

			foreach (QuizSubmission sub in quiz.Submissions) {
				DatabaseManager.getInstance().CreateUserSubmission(
					quiz.ID ?? -1, // TODO: handle properly when null
					DatabaseManager.getInstance().GetUserID(this._courseID, sub.UserID),
					sub.Score ?? 0,
					((DateTimeOffset)sub.FinishedDate.Value).ToUnixTimeMilliseconds()
				);
			}
        }

        /// <summary>
        /// Starts the quiz worker.
        /// </summary>
        public void Start()
        {
			_logger.LogInformation("Starting quiz registry...");

			// Get the quizzes from canvas.
			List<Quiz> quizzes = this._canvasHandler.GetQuizzes(_courseID);
			List<TileEntry> entries = DatabaseManager.getInstance().GetEntries(this._courseID);

			// Register the quizzes in the database.
			foreach (Quiz quiz in quizzes)
			{
				// Graded quizzes (assignment quizzes) are treated as assignments by canvas and will be handled in the assignment worker.
				if (quiz.Type == QuizType.Assignment)
                    continue;

                _logger.LogInformation("Processing quiz: {Name}", quiz.Name);
				DatabaseManager.getInstance().RegisterAssignment(
					quiz.ID,
					quiz.CourseID,
					quiz.Name,
					quiz.IsPublished,
					false,
					quiz.DueDate.HasValue ?(int) ((DateTimeOffset)quiz.DueDate.Value).ToUnixTimeSeconds() : 0,
					quiz.PointsPossible ?? 0,
					(int) GradingType.Points
				);

				// Don't register submissions that aren't assigned to tiles (as entries).
                TileEntry entry = entries.Find(e => e.ContentID == quiz.ID);
                if (entry == null) continue;

                this.RegisterSubmissions(quiz, entry);
			}
		}
	}
}
