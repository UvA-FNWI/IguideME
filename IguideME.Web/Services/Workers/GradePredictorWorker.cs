using System.Collections.Generic;

using IguideME.Web.Models;
using IguideME.Web.Models.App;
using IguideME.Web.Models.Impl;
using Microsoft.Extensions.Logging;

namespace IguideME.Web.Services.Workers
{
    /// <summary>
    /// Class <a>GradePredictorWorker</a> models a worker that handle making grade predictions for users.
    /// </summary>
	public class GradePredictorWorker
	{
        readonly private ILogger<SyncManager> _logger;
		readonly private int _courseID;
        readonly private long _syncID;
        readonly private GradePredictionModel _model;

        /// <summary>
        /// This constructor initializes the new GradePredictorWorker to
        /// (<paramref name="courseID"/>, <paramref name="syncID"/>, <paramref name="logger"/>).
        /// </summary>
        /// <param name="courseID">the id of the course.</param>
        /// <param name="syncID">the hash code associated to the current sync.</param>
        /// <param name="logger">a reference to the logger used for the sync.</param>
		public GradePredictorWorker(int courseID, long syncID, ILogger<SyncManager> logger)
        {
            _logger = logger;
            this._courseID = courseID;
            this._syncID = syncID;
            this._model = DatabaseManager.Instance.GetGradePredictionModel(courseID);
        }

        /// <summary>
        /// Starts the grade prediction worker.
        /// </summary>
        public void Start()
        {
            _logger.LogInformation("Making grade predictions");
            if (this._model == null)
            {
                _logger.LogInformation("No suitible grade prediction model found for courseID {ID}", this._courseID);
                return;
            }

            List<User> students = DatabaseManager.Instance.GetUsers(this._courseID, "student", this._syncID);

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
            List<AssignmentSubmission> submissions = DatabaseManager.Instance.GetCourseSubmissionsForStudent(this._courseID,
                                                                                      student.UserID,
                                                                                      this._syncID);

            List<TileEntry> tileEntries = DatabaseManager.Instance.GetEntries(this._courseID);

            double wGrade = 0.0;

            // foreach (GradePredictionModelParameter modelParameter in this._model.Parameters)
            // {
            //     AssignmentSubmission submission = submissions.Find(sub => sub.EntryID == modelParameter.ParameterID);
            //     if (submission == null)
            //     {
            //         _logger.LogInformation("Student {UserID} has no submission for EntryID {ParamID}", student.UserID, modelParameter.ParameterID);
            //         continue;
            //     }

            //     _logger.LogInformation("grade += {grade} * {Weight}", submission.Grade, modelParameter.Weight);

            //     wGrade += submission.Grade * modelParameter.Weight;
            // } TODO: fix

            DatabaseManager.Instance.CreatePredictedGrade(this._courseID,
                                                          student.UserID,
                                                          wGrade);
        }
    }
}
