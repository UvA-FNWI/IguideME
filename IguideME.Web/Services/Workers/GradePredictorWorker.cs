using System.Collections.Generic;

using IguideME.Web.Models;
using IguideME.Web.Models.App;
using IguideME.Web.Models.Impl;

using Microsoft.Extensions.Logging;

namespace IguideME.Web.Services.Workers
{
    /// <summary>
    /// Class <a>GradePredictorWorker</a> models a worker that handle making Grade predictions for users.
    /// </summary>
	public class GradePredictorWorker : IWorker
    {
        readonly private ILogger<SyncManager> _logger;
        readonly private int _courseID;
        readonly private long _syncID;
        readonly private GradePredictionModel _model;
        private readonly DatabaseManager _databaseManager;

        /// <summary>
        /// This constructor initializes the new GradePredictorWorker to
        /// (<paramref name="courseID"/>, <paramref name="syncID"/>, <paramref name="logger"/>).
        /// </summary>
        /// <param name="courseID">the id of the course.</param>
        /// <param name="syncID">the hash code associated to the current sync.</param>
        /// <param name="logger">a reference to the logger used for the sync.</param>
		public GradePredictorWorker(int courseID, long syncID, DatabaseManager databaseManager, ILogger<SyncManager> logger)
        {
            _logger = logger;
            _courseID = courseID;
            _syncID = syncID;
            _databaseManager = databaseManager;
            _model = _databaseManager.GetGradePredictionModel(courseID);
        }

        /// <summary>
        /// Starts the Grade prediction worker.
        /// </summary>
        public void Start()
        {
            _logger.LogInformation("Making Grade predictions");
            if (this._model == null)
            {
                _logger.LogWarning("No suitible Grade prediction model found for courseID {ID}", this._courseID);
                return;
            }

            List<User> students = _databaseManager.GetUsers(this._courseID, (int)UserRoles.student, this._syncID);

            foreach (User student in students)
            {
                this.PredictGradesForStudent(student);
            }
        }

        /// <summary>
        /// Make predictions for a student
        /// </summary>
        /// <param name="student">the student to make predictions for.</param>
        private void PredictGradesForStudent(User student)
        {
            // _logger.LogInformation("Processing student: {ID}", student.UserID);
            List<AssignmentSubmission> submissions = _databaseManager.GetCourseSubmissionsForStudent(this._courseID,
                                                                                      student.UserID,
                                                                                      this._syncID);

            List<TileEntry> tileEntries = _databaseManager.GetAllTileEntries(this._courseID);

            double wGrade = 0.0;

            // TODO: COMMENTED OUT CODE THAT SHOULD GO BACK IN ---------------------------------------------------------------------
            // foreach (GradePredictionModelParameter modelParameter in this._model.Parameters)
            // {
            //     AssignmentSubmission submission = submissions.Find(sub => sub.EntryID == modelParameter.ParameterID);
            //     if (submission == null)
            //     {
            //         _logger.LogInformation("Student {UserID} has no submission for EntryID {ParamID}", student.UserID, modelParameter.ParameterID);
            //         continue;
            //     }

            //     _logger.LogInformation("Grade += {Grade} * {Weight}", submission.Grade, modelParameter.Weight);

            //     wGrade += submission.Grade * modelParameter.Weight;
            // } TODO: fix
            //----------------------------------------------------------------------------------------------------------------------

            _databaseManager.UpdateUserSettings(
                                        _courseID,
                                        student.UserID,
                                        null,
                                        null,
                                        null,
                                        wGrade,
                                        null,
                                        _syncID);
        }
    }
}
