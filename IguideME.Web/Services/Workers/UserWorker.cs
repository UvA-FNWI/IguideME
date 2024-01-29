using System;
using System.Collections.Generic;
using IguideME.Web.Models.Impl;
using IguideME.Web.Services.LMSHandlers;
using Microsoft.Extensions.Logging;

namespace IguideME.Web.Services.Workers
{
    /// <summary>
    /// Class <a>UserWorker</a> models a worker that handles registering users during a sync.
    /// </summary>
    public class UserWorker
    {
        readonly private ILogger<SyncManager> _logger;
        readonly private ILMSHandler _lmsHandler;
        readonly private int _courseID;
        readonly private string _hashCode;

        /// <summary>
        /// This constructor initializes the new UserWorker to:
        /// (<paramref name="courseID"/>, <paramref name="hashCode"/>, <paramref name="lmsHandler"/>, <paramref name="logger"/>).
        /// </summary>
        /// <param name="courseID">the id of the course.</param>
        /// <param name="hashCode">the hash code associated to the current sync.</param>
        /// <param name="lmsHandler">a reference to the class managing the connection with canvas.</param>
        /// <param name="logger">a reference to the logger used for the sync.</param>
        public UserWorker(
            int courseID,
            string hashCode,
            ILMSHandler lmsHandler,
            ILogger<SyncManager> logger)
        {
            _logger = logger;
            this._courseID = courseID;
            this._hashCode = hashCode;
            this._lmsHandler = lmsHandler;
        }

        /// <summary>
        /// Registers the given students and initializes their settings in the database.
        /// </summary>
        /// <param name="students">list of students to be registered.</param>
        private void RegisterStudents(IEnumerable<User> students)
        {

            foreach (User student in students)
            {
                // _logger.LogInformation("Processing student {ID}...", student.ID);
                try
                {
                    DatabaseManager.Instance.RegisterUserSettings(new Models.ConsentData(_courseID, student.UserID, student.Name, -1));

                    // _logger.LogInformation("registering student with login {l} sis {s} user {u}", student.LoginID, student.SISUserID, student.ID);

                    DatabaseManager.Instance.RegisterUser(
                        _courseID,
                        student.StudentNumber,
                        student.UserID,
                        student.Name,
                        student.SortableName,
                        "student",
                        this._hashCode
                    );
                }
                catch (Exception e)
                {
                    _logger.LogError("Error registering student: {Error} {StackTrace}", e, e.StackTrace);
                }
            }
        }

        /// <summary>
        /// Registers the given students in the database.
        /// </summary>
        /// <param name="instructors">list of instructors to be registered.</param>
        private void RegisterInstructors(IEnumerable<User> instructors)
        {
            foreach (var instructor in instructors)
            {
                _logger.LogInformation("Processing instructor {ID} ...", instructor.ID);

                DatabaseManager.Instance.RegisterUser(
                    _courseID,
                    instructor.StudentNumber,
                    instructor.UserID,
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

            IEnumerable<User> students = this._lmsHandler.GetStudents(this._courseID);

            _logger.LogInformation("Starting student registry, about to process students...");

            this.RegisterStudents(students);

            var instructors = this._lmsHandler.GetAdministrators(_courseID);

            _logger.LogInformation("Starting instructor registry, about to process instructurs...");

            this.RegisterInstructors(instructors);
        }
    }
}
