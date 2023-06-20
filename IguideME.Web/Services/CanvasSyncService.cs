using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Threading;
using System.Threading.Tasks;
using IguideME.Web.Models.Service;
using IguideME.Web.Services.Workers;
using Microsoft.Extensions.Logging;

namespace IguideME.Web.Services
{
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
            ILogger<SyncManager> logger)
        {
            _logger = logger;
            _computationJobStatus = computationJobStatus;
            _canvasHandler = canvasHandler;
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
            bool notifications_bool = false;

            static bool isBetweenDates (DateTime input, DateTime startDate, DateTime endDate){
                return (input >= startDate && input <= endDate);
            }

            List<string> notificationDates = DatabaseManager.Instance.GetNotificationDates(courseID);
            if (notificationDates[0].Contains("-")) {
                // We are looking in a range of dates
                foreach(string datepair in notificationDates)
                {
                    string[] splittedDates = datepair.Split("-");
                    if (isBetweenDates(DateTime.Parse(String.Format("{0:yyyy/MM/dd}", DateTime.Now)), DateTime.Parse(splittedDates[0]), DateTime.Parse(splittedDates[1]))) {
                        notifications_bool = work.Notifications_bool; // What is this bool??
                        break;
                    }
                }
            } else
                notifications_bool = work.Notifications_bool && notificationDates.Contains(String.Format("{0:yyyy/MM/dd}", DateTime.Now));

            _logger.LogInformation("{Time}: Starting sync for course {CourseID}", DateTime.Now, courseID);

            string timestamp = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds().ToString();

            // Renew the connection with canvas.
            _canvasHandler.CreateConnection();

            // Don't keep ancient syncs in the database.
            DatabaseManager.Instance.CleanupSync(courseID);

            // Register the new sync in the database.
            DatabaseManager.Instance.RegisterSync(courseID, timestamp);
            _logger.LogInformation("Sync hash: {Hash}", timestamp);
            _logger.LogInformation("Course: {Course}", work.CourseID);

            // Time how long the sync takes.
            Stopwatch sw = new();
            sw.Start();

            new UserWorker(courseID, timestamp, _canvasHandler, _logger).Start();
            await _computationJobStatus.UpdateJobProgressInformationAsync(
                jobId, $"tasks.students", 0
            ).ConfigureAwait(false);

            new QuizWorker(courseID, timestamp, _canvasHandler, _logger).Start();
            await _computationJobStatus.UpdateJobProgressInformationAsync(
                jobId, $"tasks.quizzes", 0
            ).ConfigureAwait(false);

            new DiscussionWorker(courseID, timestamp, _canvasHandler, _logger).Start();
            await _computationJobStatus.UpdateJobProgressInformationAsync(
                jobId, $"tasks.discussions", 0
            ).ConfigureAwait(false);

            new AssignmentWorker(courseID, timestamp, _canvasHandler, _logger).Start();
            await _computationJobStatus.UpdateJobProgressInformationAsync(
                jobId, $"tasks.assignments", 0
            ).ConfigureAwait(false);

            _logger.LogInformation("Starting recycleexternaldata");
            DatabaseManager.Instance.RecycleExternalData(courseID, timestamp);

            new GradePredictorWorker(courseID, timestamp, _logger).Start();
            await _computationJobStatus.UpdateJobProgressInformationAsync(
                jobId, $"tasks.grade-predictor", 0
            ).ConfigureAwait(false);

            new PeerGroupWorker(courseID, timestamp, _logger).Start();
            await _computationJobStatus.UpdateJobProgressInformationAsync(
                jobId, $"tasks.peer-groups", 0
            ).ConfigureAwait(false);

            new NotificationsWorker(courseID, timestamp, _canvasHandler, notifications_bool, _logger).Start();
            await _computationJobStatus.UpdateJobProgressInformationAsync(
                jobId, $"tasks.notifications", 0
            ).ConfigureAwait(false);

            _logger.LogInformation("Finishing sync");
            await _computationJobStatus.UpdateJobProgressInformationAsync(
                jobId, $"tasks.done", 0
            ).ConfigureAwait(false);

            long duration = sw.ElapsedMilliseconds;
            Console.WriteLine("Took: " + duration.ToString() + "ms");
            DatabaseManager.Instance.CompleteSync(timestamp);

            return result;
        }
    }
}
