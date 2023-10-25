using IguideME.Web.Models.Service;
using Microsoft.Extensions.Hosting;
using System;
using System.Collections.Concurrent;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;

namespace IguideME.Web.Services
{
    // Not strictly necessary since we only have 1 class but apparently good practice for DI and testing.
    public interface IQueuedBackgroundService
    {
        /// <summary>
        /// Posts a job to the queue and returns a model containing the job ID and queue position.
        /// </summary>
        /// <param name="jobParameters">The parameters for the job.</param>
        /// <returns>A <see cref="JobCreatedModel"/> containing the job ID and queue position.</returns>
        Task<JobCreatedModel> PostWorkItemAsync(JobParametersModel jobParameters);
    }

    /// <summary>
    /// A background service that processes queued jobs.
    /// </summary>
    public sealed class QueuedBackgroundService : BackgroundService, IQueuedBackgroundService
    {
        /// <summary>
        /// Represents a job in the queue.
        /// </summary>
        private sealed class JobQueueItem
        {
            public string JobId { get; set; }
            public JobParametersModel JobParameters { get; set; }
        }

        private readonly ICanvasSyncService _workService;

        private readonly ILogger<QueuedBackgroundService> _logger;

        private readonly IComputationJobStatusService _jobStatusService;

        /// <summary>
        /// The queue of jobs waiting to be processed.
        /// </summary>
        private static readonly ConcurrentQueue<JobQueueItem> Queue = new();

        /// <summary>
        /// The signal used to indicate that there is work to be done.
        /// </summary>
        private static readonly SemaphoreSlim Signal = new(0);

        /// <summary>
        /// Initializes the new <see cref="QueuedBackgroundService"/> to
        /// (<paramref name="workService"/>, <paramref name="jobStatusService"/>, <paramref name="logger"/>).
        /// </summary>
        /// <param name="workService">The service used to perform the work for each job.</param>
        /// <param name="jobStatusService">The service used to manage the status of computation jobs.</param>
        /// <param name="logger">The logger used to log events for this service.</param>
		public QueuedBackgroundService(
            ICanvasSyncService workService,
            IComputationJobStatusService jobStatusService,
            ILogger<QueuedBackgroundService> logger)
        {
            _workService = workService;
            _jobStatusService = jobStatusService;
            _logger = logger;
        }

        /// <inheritdoc />
        public async Task<JobCreatedModel> PostWorkItemAsync(JobParametersModel jobParameters)
        {
            string jobId = await _jobStatusService.CreateJobAsync(jobParameters).ConfigureAwait(false);
            Queue.Enqueue(new JobQueueItem { JobId = jobId, JobParameters = jobParameters });
            Signal.Release(); // signal for background service to start working on the job
            return new JobCreatedModel { JobId = jobId, QueuePosition = Queue.Count };
        }

        /// <summary>
        /// Executes the job processing loop.
        /// </summary>
        /// <param name="stoppingToken">The token used to stop the service.</param>
        /// <returns>A task representing the background job processing.</returns>
        /// <remark>
        /// Long running task via BackgroundService
        /// </remark>
        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                JobQueueItem jobQueueItem = null;
                try
                {
                    // wait for the queue to signal there is something that needs to be done
                    await Signal.WaitAsync(stoppingToken).ConfigureAwait(false);

                    // dequeue the item
                    jobQueueItem = Queue.TryDequeue(out var workItem) ? workItem : null;

                    if (jobQueueItem != null)
                    {
                        // put the job in to a "processing" state
                        await _jobStatusService.UpdateJobStatusAsync(
                            jobQueueItem.JobId, JobStatus.Processing).ConfigureAwait(false);

                        // the heavy lifting is done here...
                        JobResultModel result = await _workService.DoWorkAsync(
                            jobQueueItem.JobId, jobQueueItem.JobParameters,
                            stoppingToken).ConfigureAwait(false);

                        // store the result of the work and set the status to "finished"
                        await _jobStatusService.StoreJobResultAsync(
                            jobQueueItem.JobId, result, JobStatus.Success).ConfigureAwait(false);
                    }
                }
                catch (TaskCanceledException ex)
                {
                    _logger.LogError("Task canceled: {exception}", ex.StackTrace);
                    break;
                }
                catch (Exception ex)
                {
                    try
                    {
                        _logger.LogError("Error caught, setting the job as errored: {message}, {trace}", ex.Message, ex.StackTrace);
                        // something went wrong. Put the job in to an errored state and continue on
                        // application will use latest successful state
                        await _jobStatusService.StoreJobResultAsync(jobQueueItem.JobId, new JobResultModel
                        {
                            Exception = new JobExceptionModel(ex)
                        }, JobStatus.Errored).ConfigureAwait(false);
                    }
                    catch (Exception e)
                    {
                        _logger.LogError("Something went wrong while moving job to errored state: {error}", e.StackTrace);
                    }
                }
            }
        }
    }
}
