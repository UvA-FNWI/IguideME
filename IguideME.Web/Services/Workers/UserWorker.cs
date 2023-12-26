using System;
using System.Collections.Generic;
using IguideME.Web.Models.Impl;
using Microsoft.Extensions.Logging;

using UserRoles = IguideME.Web.Models.Impl.UserRoles;

namespace IguideME.Web.Services.Workers
{
    /// <summary>
    /// Class <a>UserWorker</a> models a worker that handles registering users during a sync.
    /// </summary>
    public class UserWorker : IWorker
    {
        readonly private ILogger<SyncManager> _logger;
        readonly private CanvasHandler _canvasHandler;
        readonly private DatabaseManager _databaseManager;
        readonly private int _courseID;
        readonly private long _syncID;

        /// <summary>
        /// This constructor initializes the new UserWorker to:
        /// (<paramref name="courseID"/>, <paramref name="syncID"/>, <paramref name="canvasHandler"/>, <paramref name="logger"/>).
        /// </summary>
        /// <param name="courseID">the id of the course.</param>
        /// <param name="syncID">the hash code associated to the current sync.</param>
        /// <param name="canvasHandler">a reference to the class managing the connection with canvas.</param>
        /// <param name="logger">a reference to the logger used for the sync.</param>
        public UserWorker(
            int courseID,
            long syncID,
            CanvasHandler canvasHandler,
            DatabaseManager databaseManager,
            ILogger<SyncManager> logger)
        {
            _logger = logger;
            this._courseID = courseID;
            this._syncID = syncID;
            this._canvasHandler = canvasHandler;
            this._databaseManager = databaseManager;
        }

        /// <summary>
        /// Registers the given students and initializes their settings in the database.
        /// </summary>
        /// <param name="students">list of students to be registered.</param>
        private void InitializeStudents(IEnumerable<User> students)
        {

            foreach (User student in students)
            {
                // _logger.LogInformation("Processing student {ID}...", student.ID);
                try
                {
                    _databaseManager.RegisterUser(student);

                    _databaseManager.InitializeUserSettings(_courseID, student.UserID, this._syncID);

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
            foreach (User instructor in instructors)
            {
                _logger.LogInformation("Processing instructor {ID} ...", instructor.UserID);

                _databaseManager.RegisterUser(instructor);
            }
        }

        /// <summary>
        /// Starts the user worker.
        /// </summary>
        public void Start()
        {
            _logger.LogInformation("Starting user registry...");

            IEnumerable<User> students = this._canvasHandler.GetStudents(this._courseID);

            _logger.LogInformation("Starting student registry, about to process students...");

            this.InitializeStudents(students);

            var instructors = this._canvasHandler.GetAdministrators(_courseID);

            _logger.LogInformation("Starting instructor registry, about to process instructurs...");

            this.RegisterInstructors(instructors);
        }
    }
}
