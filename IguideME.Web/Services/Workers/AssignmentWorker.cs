using System;
using Microsoft.Extensions.Logging;


namespace IguideME.Web.Services.Workers
{
    public class AssignmentWorker
    {
        private readonly ILogger<SyncManager> _logger;
		private readonly int _courseID;
		private readonly string _hashCode;
		private readonly CanvasTest _canvasTest;

        public AssignmentWorker(
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
			var assignments = this._canvasTest.GetAssignments(this._courseID);
			var entries = DatabaseManager.Instance.GetEntries(this._courseID);

			_logger.LogInformation("Starting assignment registry...");
			foreach (var assignment in assignments)
			{
				if (assignment == null) continue;
				_logger.LogInformation($"Processing assignment: {assignment.Name}");

				DatabaseManager.Instance.RegisterAssignment(
					assignment.ID,
					assignment.CourseID,
					assignment.Name ??= "?",
					assignment.IsPublished,
					assignment.IsMuted,
					assignment.DueDate.HasValue ? assignment.DueDate.Value.ToShortDateString() : "",
					assignment.PointsPossible ??= 0,
					assignment.Position ??= 0,
					(int) assignment.GradingType,
					assignment.SubmissionType,
					_hashCode
				);

				var submissions = assignment.Submissions;
				foreach (var submission in submissions)
				{
					// don't register data from students that did not give consent
					if (DatabaseManager.Instance.GetConsent(this._courseID, submission.User.LoginID) != 1) {
						continue;
					}

					// only register graded submissions
					if (submission.Grade == null) continue;

					// Don't register submissions that aren't used by the application
					var entry = entries.Find(e => e.Title == assignment.Name);
					if (entry != null)
                    {
							float grade;

							switch (assignment.GradingType) {
								case UvA.DataNose.Connectors.Canvas.GradingType.Points:
									grade = float.Parse(submission.Grade);
									break;
								case UvA.DataNose.Connectors.Canvas.GradingType.Percentage:
									grade = float.Parse(submission.Grade)/10;
									break;
								default:
									grade = -1; // TODO: handle the letter grading options etc
									_logger.LogError($"Grade format {assignment.GradingType} is not supported, grade = {submission.Grade}");
									break;
							}
							DatabaseManager.Instance.CreateUserSubmission(
								this._courseID,
								entry.ID,
								submission.User.LoginID,
								grade,
								"",//submission.SubmittedAt.Value.ToShortDateString(),
								_hashCode);
					}
				}

			}
		}
    }
}
