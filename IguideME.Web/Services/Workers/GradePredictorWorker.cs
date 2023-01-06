using IguideME.Web.Models.App;
using IguideME.Web.Models.Impl;
using Microsoft.Extensions.Logging;

namespace IguideME.Web.Services.Workers
{
	public class GradePredictorWorker
	{
        private readonly ILogger<SyncManager> _logger;

		private int CourseID { get; set; }

        private string SyncHash { get; set; }

        private GradePredictionModel Model { get; set; }

		public GradePredictorWorker(int courseID, string syncHash, ILogger<SyncManager> logger)
        {
            _logger = logger;
            this.CourseID = courseID;
            this.SyncHash = syncHash;
            this.Model = DatabaseManager.Instance.GetGradePredictionModel(courseID);
        }

        public void MakePredictions()
        {
            _logger.LogInformation("Making grade predictions");
            if (this.Model == null)
            {
                _logger.LogInformation($"No suitible grade prediction model found for courseID {this.CourseID}");
                return;
            }

            var students = DatabaseManager.Instance.GetUsers(this.CourseID, "student", this.SyncHash);

            foreach (var student in students)
            {
                this.ProcessStudent(student);
            }
        }

        private void ProcessStudent(User student)
        {
            _logger.LogInformation($"Processing student: {student.LoginID}");
            var submissions = DatabaseManager.Instance.GetCourseSubmissionsForStudent(this.CourseID,
                                                                                      student.LoginID,
                                                                                      this.SyncHash);
            var tileEntries = DatabaseManager.Instance.GetEntries(this.CourseID);

            var wGrade = 0.0;

            foreach (GradePredictionModelParameter modelParameter in this.Model.Parameters)
            {
                var submission = submissions.Find(sub => sub.EntryID == modelParameter.ParameterID);
                if (submission == null)
                {
                    _logger.LogInformation($"Student {student.UserID} has no submission for EntryID {modelParameter.ParameterID}");
                    continue;
                }

                if (!double.TryParse(submission.Grade, out double partialGrade))
                {
                    _logger.LogInformation($"Error parsing submission grade as double: {submission.Grade}");
                    _logger.LogInformation("Aborting.");
                    return;
                }

                _logger.LogInformation($"grade += {partialGrade} * {modelParameter.Weight}");

                wGrade += partialGrade * modelParameter.Weight;
            }

            DatabaseManager.Instance.CreatePredictedGrade(this.CourseID,
                                                          student.LoginID,
                                                          (float)wGrade);
        }
    }
}
