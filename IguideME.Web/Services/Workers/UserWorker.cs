using System;
using Microsoft.Extensions.Logging;

namespace IguideME.Web.Services.Workers
{
    public class UserWorker
    {
        private readonly ILogger<SyncManager> _logger;
        private CanvasTest canvasTest;
        private int courseID;
        private string hashCode;

        public UserWorker(
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
            _logger.LogInformation("Starting user sync...");

            var students = this.canvasTest.GetStudents(this.courseID);
            var test = this.canvasTest.GetAdministrators(this.courseID);
            foreach (var student in test)
            {
                try
                {
                    if (!String.IsNullOrEmpty(student.ID.ToString()))
                        this.canvasTest.sendMessage((int)student.ID);
                }
                catch { }

            }

            _logger.LogInformation("Starting student registry, about to process " + students.Length.ToString() + " students...");
            foreach (var student in students)
            {
                _logger.LogInformation("Processing " + student.ID.ToString() + "...");

                if (DatabaseManager.Instance.GetUserGoalGrade(courseID, student.SISUserID) < 0)
                {
                    DatabaseManager.Instance.CreateEmptyUserGoalGrade(courseID, student.SISUserID);
                    //DatabaseManager.Instance.UpdateUserGoalGrade(courseID, student.SISUserID, 7);
                }

                DatabaseManager.Instance.RegisterUser(
                    courseID,
                    student.ID,
                    student.SISUserID,
                    student.SISUserID,
                    student.Name,
                    student.SortableName,
                    "student",
                    this.hashCode
                );
            }

            var instructors = this.canvasTest.GetAdministrators(courseID);

            _logger.LogInformation("Starting instructor registry, about to process " + instructors.Length + " instructurs...");

            foreach (var instructor in instructors)
            {
                _logger.LogInformation("Processing " + instructor.ID.ToString() + "...");

                DatabaseManager.Instance.RegisterUser(
                    courseID,
                    instructor.ID,
                    instructor.SISUserID,
                    instructor.SISUserID,
                    instructor.Name,
                    instructor.SortableName,
                    "instructor",
                    this.hashCode
                );
            }
        }
    }
}
