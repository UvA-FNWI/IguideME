using System;
using System.Collections.Generic;
using System.Linq;

using IguideME.Web.Models;

using Microsoft.Extensions.Logging;

using UvA.DataNose.Connectors.Canvas;

namespace IguideME.Web.Services.Workers
{

	/// <summary>
    /// Class <a>AssignemntWorker</a> models a worker that handles registering assignments during a sync..
    /// </summary>
    public class AssignmentWorker
    {
        readonly private ILogger<SyncManager> _logger;
		readonly private CanvasHandler _canvasHandler;
		readonly private int _courseID;
		readonly private string _hashCode;

		/// <summary>
        /// This constructor initializes the new AssignmentWorker to:
        /// (<paramref name="courseID"/>, <paramref name="hashCode"/>, <paramref name="canvasHandler"/>, <paramref name="logger"/>).
        /// </summary>
        /// <param name="courseID">the id of the course.</param>
        /// <param name="hashCode">the hash code associated to the current sync.</param>
        /// <param name="canvasHandler">a reference to the class managing the connection with canvas.</param>
        /// <param name="logger">a reference to the logger used for the sync.</param>
        public AssignmentWorker(
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
        /// Convert letter grading systems to our internal system of grades between 0 and 100.
        /// </summary>
        /// <param name="grade">the grade as a letter that should be converted.</param>
        /// <returns>The grade as a percentage.</returns>
		static private double LetterToGrade(string grade){

            return grade switch
            {
                "A"  => 100,
                "A-" => 93,
                "B+" => 89,
                "B"  => 86,
                "B-" => 83,
                "C+" => 79,
                "C"  => 76,
                "C-" => 73,
                "D+" => 69,
                "D"  => 66,
                "D-" => 63,
                "F"  => 60,
                _    => 0.00,
            };
        }

		/// <summary>
        /// Register submissions associated to an assignment in the database.
        /// </summary>
        /// <param name="assignment">the assignment the submissions are associated to.</param>
        /// <param name="entry">the tile entry the submissions are associated to.</param>
		private void RegisterSubmissions(Assignment assignment, TileEntry entry) {

			// Filter out students that did not give consent and that don't have a grade.
            IEnumerable<Submission> submissions = assignment.Submissions
                .Where(submission =>
					submission.Grade != null &&
					DatabaseManager.Instance.GetConsent(this._courseID, submission.User.LoginID) == 1
				);

            foreach (Submission submission in submissions)
			{
				double grade;

				switch (assignment.GradingType) {
					case GradingType.Points:
						// grade = (double.Parse(submission.Grade) - 1)/0.09; // should switch to this
						grade = double.Parse(submission.Grade);
						break;
					case GradingType.Percentage:
						grade = double.Parse(submission.Grade);
						break;
					case GradingType.GPA:
					case GradingType.Letters:
						grade = LetterToGrade(submission.Grade);
						break;
					case GradingType.PassFail:
						_logger.LogInformation("passfail text: {Grade}", submission.Grade);
                        grade = submission.Grade == "PASS" ? 100 : 0;
                        break;
					case GradingType.NotGraded:
                        grade = -1;
                        break;
                    default:
						grade = -1;
						_logger.LogError("Grade format {Type} is not supported, grade = {Grade}", assignment.GradingType, submission.Grade);
						break;
				}
                _logger.LogInformation("loginid {ID}", submission.User.LoginID);
				DatabaseManager.Instance.CreateUserSubmission(
						this._courseID,
						entry.ID,
						submission.User.LoginID,
						grade,
						"",//submission.SubmittedAt.Value.ToShortDateString(),
						_hashCode);
			}
		}

		/// <summary>
        /// Starts the assignment worker.
        /// </summary>S
        public void Start()
        {
			_logger.LogInformation("Starting assignment registry...");

			IEnumerable<Assignment> assignments = this._canvasHandler.GetAssignments(this._courseID);
			List<TileEntry> entries = DatabaseManager.Instance.GetEntries(this._courseID);

            foreach (Assignment assignment in assignments)
            {
                _logger.LogInformation("Processing assignment: {Name}", assignment.Name);

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

                // Don't register submissions that aren't assigned to tiles (as entries).
                TileEntry entry = entries.Find(e => e.Title == assignment.Name);
                if (entry == null) continue;

                this.RegisterSubmissions(assignment, entry);

            }
        }

    }
}
