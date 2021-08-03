using System;
namespace IguideME.Web.Services.Workers
{
    public class QuizWorker
    {
		int courseID;
		string hashCode;
		CanvasTest canvasTest;

        public QuizWorker(
			int courseID,
			string hashCode,
			CanvasTest canvasTest)
        {
			this.courseID = courseID;
			this.hashCode = hashCode;
			this.canvasTest = canvasTest;
        }

        public void Register()
        {
			var quizzes = this.canvasTest.GetQuizzes(courseID);
			foreach (var quiz in quizzes)
			{
				Console.WriteLine("\t" + quiz.Name);
				DatabaseManager.Instance.RegisterAssignment(
					quiz.ID,
					quiz.CourseID,
					quiz.Name,
					quiz.IsPublished,
					false,
					quiz.DueDate.HasValue ? quiz.DueDate.Value.ToShortDateString() : "",
					0,
					0,
					"online",
					this.hashCode
				);
			}
		}
	}
}
