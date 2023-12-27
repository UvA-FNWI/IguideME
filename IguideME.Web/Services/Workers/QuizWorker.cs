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
	public class QuizWorker : IWorker
	{
		readonly private ILogger<SyncManager> _logger;
		readonly private ILMSHandler _canvasHandler;
		private readonly DatabaseManager _databaseManager;

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
			ILMSHandler canvasHandler,
			DatabaseManager databaseManager,
			ILogger<SyncManager> logger)

		{
			_logger = logger;
			_courseID = courseID;
			_syncID = syncID;
			_canvasHandler = canvasHandler;
			_databaseManager = databaseManager;
		}

		/// <summary>
		/// Register submissions associated to a quiz in the database.
		/// </summary>
		/// <param name="quiz">the quiz the submissions are associated to.</param>
		/// <param name="entry">the tile entry the submissions are associated to.</param>
		public void RegisterSubmissions(IEnumerable<AssignmentSubmission> submissions, TileEntry entry)
		{
			foreach (AssignmentSubmission sub in submissions)
			{
				// TODO: WE NEED TO CHANGE THE SUBMISSION IDs FROM EXTERNAL QUIZ ID TO INTERNAL ASSIGNMENT ID
				sub.AssignmentID = _databaseManager.GetInternalAssignmentID(_courseID, sub.AssignmentID);
				_databaseManager.CreateUserSubmission(sub);
			}
		}

		/// <summary>
		/// Starts the quiz worker.
		/// </summary>
		public void Start()
		{
			_logger.LogInformation("Starting quiz registry...");

			// Get the quizzes from canvas.
			IEnumerable<(AppAssignment, IEnumerable<AssignmentSubmission>)> quizzes = this._canvasHandler.GetQuizzes(_courseID);
			List<TileEntry> entries = _databaseManager.GetAllTileEntries(this._courseID);

			// Get the consented users and only ask for their submissions
			List<Models.Impl.User> users = _databaseManager.GetUsersWithGrantedConsent(this._courseID);
            // IEnumerable<SubmissionGroup> submissions = this._canvasHandler.GetQuizzes(this._courseID, users.Select(user => user.UserID).ToArray());

			// Register the quizzes in the database.
			foreach ((AppAssignment quiz, IEnumerable<AssignmentSubmission> submissions) in quizzes)
			{

				_logger.LogInformation("Processing quiz: {Name}", quiz.Title);
				_databaseManager.RegisterAssignment(quiz);

				// Don't register submissions that aren't assigned to tiles (as entries).
				TileEntry entry = entries.Find(e => e.ContentID == quiz.ID);
				if (entry == null) continue;

				this.RegisterSubmissions(submissions, entry);
			}
		}
	}
}
