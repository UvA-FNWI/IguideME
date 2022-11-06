using System;
using Microsoft.Extensions.Logging;

namespace IguideME.Web.Services.Workers
{
    public class QuizWorker
    {
        private readonly ILogger<SyncManager> _logger;
		int courseID;
		string hashCode;
		CanvasTest canvasTest;

        public QuizWorker(
			int courseID,
			string hashCode,
			CanvasTest canvasTest,
            ILogger<SyncManager> logger)

        {
			_logger = logger;
			this.courseID = courseID;
			this.hashCode = hashCode;
			this.canvasTest = canvasTest;
        }

        public void Register()
        {
			var quizzes = this.canvasTest.GetQuizzes(courseID);
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
					this.hashCode
				);
				} catch (Exception e) {
					_logger.LogError(e.Message + e.StackTrace);
				}
			}
		}
	}
}
