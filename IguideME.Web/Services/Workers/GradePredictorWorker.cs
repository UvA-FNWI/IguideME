using System.Collections.Generic;
using System.Linq;

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
        readonly private string _hashCode;
        readonly private GradePredictionModel _model;

        /// <summary>
        /// This constructor initializes the new GradePredictorWorker to
        /// (<paramref name="courseID"/>, <paramref name="hashCode"/>, <paramref name="logger"/>).
        /// </summary>
        /// <param name="courseID">the id of the course.</param>
        /// <param name="hashCode">the hash code associated to the current sync.</param>
        /// <param name="logger">a reference to the logger used for the sync.</param>
		public GradePredictorWorker(int courseID, string hashCode, ILogger<SyncManager> logger)
        {
            _logger = logger;
            this._courseID = courseID;
            this._hashCode = hashCode;
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

            List<User> students = DatabaseManager.Instance.GetUsers(this._courseID, "student", this._hashCode);

            foreach (User student in students)
            {
                this.PredictGradesForStudent(student);
            }
        }

        /// Make predictions for a student
        /// </summary>
        /// <param name="student">the student to make predictions for.</param>
        private void PredictGradesForStudent(User student)
        {

            Dictionary<int, List<double>> grades = DatabaseManager.Instance.GetUserGrades(this._courseID,
                                                                                      student.UserID,
                                                                                      this._hashCode);

            double wGrade = 0.0;

            foreach (GradePredictionModelParameter modelParameter in this._model.Parameters)
            {
                double partialGrade = 0;

                if (grades.TryGetValue(modelParameter.ParameterID, out List<double> entryGrades))
                {
                    partialGrade = entryGrades.Average();
                }
                else
                {
                    _logger.LogInformation("User {id} has no grade for tile {tile}", student.UserID, modelParameter.ParameterID);
                }

                // _logger.LogInformation("grade += {partialGrade} * {Weight}", partialGrade, modelParameter.Weight);

                wGrade += partialGrade * modelParameter.Weight;
            }

            DatabaseManager.Instance.CreatePredictedGrade(this._courseID,
                                                          student.UserID,
                                                          wGrade);
        }
    }
}
