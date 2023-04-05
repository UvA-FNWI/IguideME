﻿using IguideME.Web.Models.Service;
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
        Task<JobCreatedModel> PostWorkItemAsync(JobParametersModel jobParameters);
    }

    public sealed class QueuedBackgroundService : BackgroundService, IQueuedBackgroundService
    {
        private sealed class JobQueueItem
        {
            public string JobId { get; set; }
            public JobParametersModel JobParameters { get; set; }
        }

		private readonly ICanvasSyncService _workService;

		private readonly ILogger<QueuedBackgroundService> _logger;

		private readonly IComputationJobStatusService _jobStatusService;

        private static readonly ConcurrentQueue<JobQueueItem> Queue = new();
        private static readonly SemaphoreSlim Signal = new(0);

		public QueuedBackgroundService(
			ICanvasSyncService workService,
			IComputationJobStatusService jobStatusService,
			ILogger<QueuedBackgroundService> logger)
		{
			_workService = workService;
			_jobStatusService = jobStatusService;
			_logger = logger;
		}

        // Transient method via IQueuedBackgroundService
        public async Task<JobCreatedModel> PostWorkItemAsync(JobParametersModel jobParameters)
        {
            string jobId = await _jobStatusService.CreateJobAsync(jobParameters).ConfigureAwait(false);
            Queue.Enqueue(new JobQueueItem { JobId = jobId, JobParameters = jobParameters });
            Signal.Release(); // signal for background service to start working on the job
            return new JobCreatedModel { JobId = jobId, QueuePosition = Queue.Count };
        }

        // Long running task via BackgroundService
        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("Test if this method (ExecuteAsync) is used somehow");
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
					_logger.LogError("Task canceled: {exception}", ex.StackTrace );
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
