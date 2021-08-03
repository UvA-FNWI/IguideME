using System;

namespace IguideME.Web.Services.Workers
{
    public class AssignmentWorker
    {
		private int courseID;
		private string hashCode;
		private CanvasTest canvasTest;

        public AssignmentWorker(
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
			var assignments = this.canvasTest.GetAssignments(this.courseID);
			var entries = DatabaseManager.Instance.GetEntries(this.courseID);

			Console.WriteLine("Starting assignment registry...");
			foreach (var assignment in assignments)
			{
				Console.WriteLine("\t" + assignment.Name);

				/*
				DatabaseManager.Instance.RegisterAssignment(
					assignment.ID,
					assignment.CourseID,
					assignment.Name,
					assignment.IsPublished,
					assignment.IsMuted,
					assignment.DueDate.HasValue ? assignment.DueDate.Value.ToShortDateString() : "",
					assignment.PointsPossible,
					assignment.Position,
					assignment.SubmissionType,
					hashCode
				);
				*/

				var submissions = assignment.Submissions;
				foreach (var submission in submissions)
				{
					Console.WriteLine("\t\t" + submission.User.Name);
					// only register graded submissions
					if (submission.Grade == null) continue;

					// Don't register submissions that aren't used by the application
					var entry = entries.Find(e => e.Title == assignment.Name);
					if (entry != null)
                    {
						DatabaseManager.Instance.CreateUserSubmission(
							entry.ID,
							submission.User.LoginID,
							submission.Grade,
							submission.SubmittedAt.Value.ToShortDateString(),
							this.hashCode);
					}
				}

			}
		}
    }
}
