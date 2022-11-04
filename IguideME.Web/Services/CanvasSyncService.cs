using System;
using System.Diagnostics;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using IguideME.Web.Models.Service;
using IguideME.Web.Services.Workers;
using UvA.DataNose.Connectors.Canvas;
using Microsoft.Extensions.Logging;

namespace IguideME.Web.Services
{
    public interface ICanvasSyncService
    {
        Task<JobResultModel> DoWorkAsync(string JobId, JobParametersModel work,
            CancellationToken cancellationToken);
    }

    public sealed class CanvasSyncService : ICanvasSyncService
    {
        private readonly ILogger<SyncManager> _logger;
        private readonly IComputationJobStatusService _computationJobStatus;
        private readonly CanvasTest _canvasTest;

        public CanvasSyncService(
            IComputationJobStatusService computationJobStatus,
            CanvasTest canvasTest,
            ILogger<SyncManager> logger)
        {
            _logger = logger;
            _computationJobStatus = computationJobStatus;
            _canvasTest = canvasTest;
        }

        public async Task<JobResultModel> DoWorkAsync(string jobId, JobParametersModel work,
            CancellationToken cancellationToken)
        {
            var result = new JobResultModel();
            var courseID = work.CourseID;

            // TODO: check course dates
            var notifications_bool = (work.Notifications_bool && (DateTime.Now.DayOfWeek == DayOfWeek.Monday || DateTime.Now.DayOfWeek == DayOfWeek.Friday));

            _logger.LogInformation($"{DateTime.Now}: Starting sync of course {courseID}");

            string characters = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
            StringBuilder _result = new StringBuilder(10);
            Random random = new Random();
            for (int i = 0; i < 10; i++)
            {
                _result.Append(characters[random.Next(characters.Length)]);
            }
            string hashCode = _result.ToString().ToUpper();

            DatabaseManager.Instance.CleanupSync(courseID, "BUSY");

            DatabaseManager.Instance.RegisterSync(courseID, hashCode);
            _logger.LogInformation("Sync hash: " + hashCode);
            _logger.LogInformation("Course: " + work.CourseID);

            var sw = new Stopwatch();
            sw.Start();

            new UserWorker(courseID, hashCode, _canvasTest, _logger).Register();
            await _computationJobStatus.UpdateJobProgressInformationAsync(
                jobId, $"tasks.students", 0
            ).ConfigureAwait(false);

            new QuizWorker(courseID, hashCode, _canvasTest, _logger).Register();
            await _computationJobStatus.UpdateJobProgressInformationAsync(
                jobId, $"tasks.quizzes", 0
            ).ConfigureAwait(false);

            new DiscussionWorker(courseID, hashCode, this._canvasTest).Load();
            await _computationJobStatus.UpdateJobProgressInformationAsync(
                jobId, $"tasks.discussions", 0
            ).ConfigureAwait(false);

            new AssignmentWorker(courseID, hashCode, _canvasTest, _logger).Register();
            await _computationJobStatus.UpdateJobProgressInformationAsync(
                jobId, $"tasks.assignments", 0
            ).ConfigureAwait(false);

            new GradePredictorWorker(courseID, hashCode, _logger).MakePredictions();
            await _computationJobStatus.UpdateJobProgressInformationAsync(
                jobId, $"tasks.grade-predictor", 0
            ).ConfigureAwait(false);

            new PeerGroupWorker(courseID, hashCode, _logger).Create();
            await _computationJobStatus.UpdateJobProgressInformationAsync(
                jobId, $"tasks.peer-groups", 0
            ).ConfigureAwait(false);

            new NotificationsWorker(courseID, hashCode, _canvasTest, notifications_bool, _logger).Register();
            await _computationJobStatus.UpdateJobProgressInformationAsync(
                jobId, $"tasks.notifications", 0
            ).ConfigureAwait(false);

            _logger.LogInformation("Starting jobprogressinformation worker");
            await _computationJobStatus.UpdateJobProgressInformationAsync(
                jobId, $"tasks.done", 0
            ).ConfigureAwait(false);

            _logger.LogInformation("Starting recycleexternaldata");
            DatabaseManager.Instance.RecycleExternalData(courseID, hashCode);

            long duration = sw.ElapsedMilliseconds;
            Console.WriteLine("Took: " + duration.ToString() + "ms");
            DatabaseManager.Instance.CompleteSync(hashCode);

            return result;
        }
    }
}
