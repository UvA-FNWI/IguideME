using System;
using System.Collections.Generic;

using Microsoft.Extensions.Logging;

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
		readonly private string _hashCode;

		/// <summary>
        /// This constructor initializes the new Quizworker to
        /// (<paramref name="courseID"/>, <paramref name="hashCode"/>, <paramref name="canvasHandler"/>, <paramref name="logger"/>).
        /// </summary>
        /// <param name="courseID">the id of the course.</param>
        /// <param name="hashCode">the hash code associated to the current sync.</param>
        /// <param name="canvasHandler">a reference to the class managing the connection with canvas.</param>
        /// <param name="logger">a reference to the logger used for the sync.</param>
        public QuizWorker(
			int courseID,
			string hashCode,
			CanvasHandler canvasHandler,
            ILogger<SyncManager> logger)

        {
			_logger = logger;
			this._courseID = courseID;
			this._hashCode = hashCode;
			this._canvasHandler = canvasHandler;
        }

		/// <summary>
        /// Starts the quiz worker.
        /// </summary>
        public void Start()
        {
			_logger.LogInformation("Starting quiz registry...");

			// Get the quizzes from canvas.
			List<Quiz> quizzes = this._canvasHandler.GetQuizzes(_courseID);

			// Register the quizzes in the database.
			foreach (Quiz quiz in quizzes)
			{
				_logger.LogInformation("Processing quiz: {Name}", quiz.Name);
				DatabaseManager.Instance.RegisterAssignment(
					quiz.ID,
					quiz.CourseID,
					quiz.Name,
					quiz.IsPublished,
					false,
					quiz.DueDate.HasValue ? quiz.DueDate.Value.ToShortDateString() : "",
					0,
					0,
					(int) GradingType.Points,
					"online",
					this._hashCode
				);
				foreach (QuizSubmission sub in quiz.Submissions) {
					foreach (QuizSubmissionQuestion q in sub.Answers ) {
						if (q.AnswerData == null) {
							_logger.LogInformation("Answerdata is null");
						} else {
							_logger.LogInformation("Answerdata {q}", q.AnswerData.ToString());
						}
					}
				}
			}
		}
	}
}
