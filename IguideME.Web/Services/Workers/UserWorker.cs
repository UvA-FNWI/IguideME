using System;
using Microsoft.Extensions.Logging;
using UvA.DataNose.Connectors.Canvas;

namespace IguideME.Web.Services.Workers
{
    /// <summary>
    /// Class <a>UserWorker</a> models a worker that handles registering users during a sync.
    /// </summary>
    public class UserWorker
    {
        readonly private ILogger<SyncManager> _logger;
        readonly private CanvasHandler _canvasHandler;
        readonly private int _courseID;
        readonly private string _hashCode;

        /// <summary>
        /// This constructor initializes the new UserWorker to:
        /// (<paramref name="courseID"/>, <paramref name="hashCode"/>, <paramref name="canvasHandler"/>, <paramref name="logger"/>).
        /// </summary>
        /// <param name="courseID">the id of the course.</param>
        /// <param name="hashCode">the hash code associated to the current sync.</param>
        /// <param name="canvasHandler">a reference to the class managing the connection with canvas.</param>
        /// <param name="logger">a reference to the logger used for the sync.</param>
        public UserWorker(
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
        /// Registers the given students and initializes their settings in the database.
        /// </summary>
        /// <param name="students">list of students to be registered.</param>
        private void RegisterStudents(User[] students) {

            foreach (User student in students)
            {
                _logger.LogInformation("Processing student {ID}...", student.ID);
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
                    _logger.LogError("Error registering student: {Error} {StackTrace}", e, e.StackTrace);
                }
            }
        }

        /// <summary>
        /// Registers the given students in the database.
        /// </summary>
        /// <param name="instructors">list of instructors to be registered.</param>
        private void RegisterInstructors(User[] instructors) {
            foreach (var instructor in instructors)
            {
                _logger.LogInformation("Processing instructor {ID} ...", instructor.ID);

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

        /// <summary>
        /// Starts the user worker.
        /// </summary>
        public void Start()
        {
            _logger.LogInformation("Starting user registry...");

            User[] students = this._canvasHandler.GetStudents(this._courseID);

            _logger.LogInformation("Starting student registry, about to process {StudentCount} students...", students.Length);

            this.RegisterStudents(students);

            var instructors = this._canvasHandler.GetAdministrators(_courseID);

            _logger.LogInformation("Starting instructor registry, about to process {InstructorCount} instructurs...", instructors.Length);

            this.RegisterInstructors(instructors);
        }
    }
}
