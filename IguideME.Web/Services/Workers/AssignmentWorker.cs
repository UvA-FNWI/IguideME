﻿using System;
using Microsoft.Extensions.Logging;


namespace IguideME.Web.Services.Workers
{
    public class AssignmentWorker
    {
        private readonly ILogger<SyncManager> _logger;
		private int courseID;
		private string hashCode;
		private CanvasTest canvasTest;

        public AssignmentWorker(
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
			var assignments = this.canvasTest.GetAssignments(this.courseID);
			var entries = DatabaseManager.Instance.GetEntries(this.courseID);

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
					assignment.SubmissionType,
					hashCode
				);

				var submissions = assignment.Submissions;
				foreach (var submission in submissions)
				{

					// don't register data from students that did not give consent
					if (DatabaseManager.Instance.GetConsent(this.courseID, submission.User.SISUserID) != 1) {
						continue;
					}

					// only register graded submissions
					if (submission.Grade == null) continue;

					// Don't register submissions that aren't used by the application
					var entry = entries.Find(e => e.Title == assignment.Name);
					if (entry != null)
                    {
							DatabaseManager.Instance.CreateUserSubmission(
								this.courseID,
								entry.ID,
								submission.User.SISUserID,
								submission.Grade,
								"",//submission.SubmittedAt.Value.ToShortDateString(),
								this.hashCode);
					}
				}

			}
		}
    }
}
