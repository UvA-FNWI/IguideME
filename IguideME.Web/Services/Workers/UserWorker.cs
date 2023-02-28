using System;
using Microsoft.Extensions.Logging;

using UvA.DataNose.Connectors.Canvas;

namespace IguideME.Web.Services.Workers
{
    public class UserWorker
    {
        private readonly ILogger<SyncManager> _logger;
        readonly private CanvasTest _canvasTest;
        readonly private int _courseID;
        readonly private string _hashCode;

        public UserWorker(
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
            _logger.LogInformation("Starting user sync...");

            User[] students = this._canvasTest.GetStudents(this._courseID);

            _logger.LogInformation($"Starting student registry, about to process {students.Length} students...");

            foreach (User student in students)
            {
                _logger.LogInformation("Processing student " + student.ID.ToString() + "...");
                try {
                    DatabaseManager.Instance.RegisterUserSettings(new Models.ConsentData(_courseID, student.LoginID, student.Name, -1));

                    DatabaseManager.Instance.RegisterUser(
                        _courseID,
                        student.ID,
                        student.LoginID,
                        student.Name,
                        student.SortableName,
                        "student",
                        this._hashCode
                    );
                } catch (Exception e) {
                    _logger.LogError($"{e} {e.StackTrace}");
                }
            }

            var instructors = this._canvasTest.GetAdministrators(_courseID);

            _logger.LogInformation($"Starting instructor registry, about to process {instructors.Length} instructurs...");

            foreach (var instructor in instructors)
            {
                _logger.LogInformation($"Processing instructor {instructor.ID} ...");

                DatabaseManager.Instance.RegisterUser(
                    _courseID,
                    instructor.ID,
                    instructor.LoginID,
                    instructor.Name,
                    instructor.SortableName,
                    "instructor",
                    this._hashCode
                );
            }
        }
    }
}
