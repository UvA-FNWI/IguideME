using System;
using Microsoft.Extensions.Logging;

namespace IguideME.Web.Services.Workers
{
    public class QuizWorker
    {
        private readonly ILogger<SyncManager> _logger;
		readonly int _courseID;
		readonly string _hashCode;
		readonly CanvasTest _canvasTest;

        public QuizWorker(
			int courseID,
			string hashCode,
			CanvasTest canvasTest,
            ILogger<SyncManager> logger)

        {
			_logger = logger;
			this._courseID = courseID;
			this._hashCode = hashCode;
			this._canvasTest = canvasTest;
        }

        public void Register()
        {
			var quizzes = this._canvasTest.GetQuizzes(_courseID);
			foreach (var quiz in quizzes)
			{
				_logger.LogInformation("\t" + quiz.Name);
				try {
				DatabaseManager.Instance.RegisterAssignment(
					quiz.ID,
					quiz.CourseID,
					quiz.Name,
					quiz.IsPublished,
					false,
					quiz.DueDate.HasValue ? quiz.DueDate.Value.ToShortDateString() : "",
					0,
					0,
					4, //Grading type points = 4
					"online",
					this._hashCode
				);
				} catch (Exception e) {
					_logger.LogError(e.Message + e.StackTrace);
				}
			}
		}
	}
}
