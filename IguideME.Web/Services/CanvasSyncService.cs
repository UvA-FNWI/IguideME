using System;
using System.Collections.Generic;
using System.Data;
using System.Diagnostics;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

using IguideME.Web.Models.Service;
using IguideME.Web.Services.Workers;

using Microsoft.Extensions.Logging;

namespace IguideME.Web.Services
{
    struct WorkerStatus
    {
        public int counter;
        public string[] tasks;
        public string[] statuses;
    }

    // Not strictly necessary since we only have 1 class but apparently good practice for DI and testing.
    public interface ICanvasSyncService
    {
        Task<JobResultModel> DoWorkAsync(string jobId, JobParametersModel work,
            CancellationToken cancellationToken);
    }

    /// <summary>
    /// Class <a>CanvasSyncService</a> implements ICanvasSyncService and is a service that manages syncs. .
    /// </summary>
    public sealed class CanvasSyncService : ICanvasSyncService
    {
        private readonly ILogger<SyncManager> _logger;
        private readonly IComputationJobStatusService _computationJobStatus;
        private readonly CanvasHandler _canvasHandler;
        private readonly DatabaseManager _databaseManager;
        private WorkerStatus workerStatus;

        /// <summary>
        /// This constructor initializes the new CanvasSyncService to
        /// (<paramref name="computationJobStatus"/>, <paramref name="canvasHandler"/>, <paramref name="logger"/>).
        /// </summary>
        /// <param name="computationJobStatus"></param>
        /// <param name="canvasHandler"></param>
        /// <param name="logger"></param>
        public CanvasSyncService(
            IComputationJobStatusService computationJobStatus,
            CanvasHandler canvasHandler,
            DatabaseManager databaseManager,
            ILogger<SyncManager> logger)
        {
            _logger = logger;
            _computationJobStatus = computationJobStatus;
            _canvasHandler = canvasHandler;
            _databaseManager = databaseManager;
        }

        /// <summary>
        /// Performs the sync with camvas.
        /// </summary>
        /// <param name="jobId">The id of the job in storage.</param>
        /// <param name="work">Data for the service.</param>
        /// <param name="cancellationToken">Token used to cancel the sync.</param>
        /// <returns>A task containging the result of the sync</returns>
        public async Task<JobResultModel> DoWorkAsync(string jobId, JobParametersModel work,
            CancellationToken cancellationToken)
        {
            JobResultModel result = new();
            int courseID = work.CourseID;

            this.workerStatus = new()
            {
                counter = 0,
                tasks = new string[] { "boot-up", "students", "quizzes", "discussions", "assignments", "grade-predictor", "peer-groups", "notifications", "done" }
            };
            this.workerStatus.statuses = this.workerStatus.tasks.Select((_) => "Pending").ToArray();
            UpdateStatus(jobId);

            _logger.LogInformation("{Time}: Starting sync for course {CourseID}", DateTime.Now, courseID);

            long timestamp = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds();

            // Renew the connection with canvas.
            _canvasHandler.CreateConnection();

            // Don't keep ancient syncs in the database.
            _databaseManager.CleanupSync(courseID);

            // Register the new sync in the database.
            _databaseManager.RegisterSync(courseID, timestamp);
            _logger.LogInformation("Sync hash: {Hash}", timestamp);
            _logger.LogInformation("Course: {Course}", work.CourseID);

            // Time how long the sync takes.
            Stopwatch sw = new();
            sw.Start();

            this.workerStatus.statuses[0] = "Success";
            this.workerStatus.counter++;
            UpdateStatus(jobId);

            RunWorker(jobId, new UserWorker(courseID, timestamp, _canvasHandler, _databaseManager, _logger));
            RunWorker(jobId, new QuizWorker(courseID, timestamp, _canvasHandler, _databaseManager, _logger));
            RunWorker(jobId, new DiscussionWorker(courseID, timestamp, _canvasHandler, _databaseManager, _logger));
            RunWorker(jobId, new AssignmentWorker(courseID, timestamp, _canvasHandler, _databaseManager, _logger));
            RunWorker(jobId, new GradePredictorWorker(courseID, timestamp, _databaseManager, _logger));
            RunWorker(jobId, new PeerGroupWorker(courseID, timestamp, _databaseManager, _logger));
            RunWorker(jobId, new NotificationsWorker(courseID, timestamp, _canvasHandler, _databaseManager, work.SendNotifications, _logger));

            _logger.LogInformation("Finishing sync");
            this.workerStatus.statuses[this.workerStatus.counter] = "Success";
            UpdateStatus(jobId);

            long duration = sw.ElapsedMilliseconds;
            Console.WriteLine("Took: " + duration.ToString() + "ms");
            _databaseManager.CompleteSync(timestamp);

            return result;
        }

        private void RunWorker(string jobId, IWorker worker)
        {
            this.workerStatus.statuses[this.workerStatus.counter] = "Processing";
            UpdateStatus(jobId);

            try { worker.Start(); }
            catch (Exception)
            {
                this.workerStatus.statuses[this.workerStatus.counter] = "Errored";
                UpdateStatus(jobId);
                throw;
            }

            this.workerStatus.statuses[this.workerStatus.counter] = "Success";
            UpdateStatus(jobId);
            this.workerStatus.counter++;
        }

        private async void UpdateStatus(string jobId)
        {
            IEnumerable<string> status = this.workerStatus.tasks.Zip(this.workerStatus.statuses, (task, status) => "tasks." + task + ":" + status);
            await _computationJobStatus.UpdateJobProgressInformationAsync(
                jobId, string.Join(",", status), 0
            ).ConfigureAwait(false);
        }
    }
}
