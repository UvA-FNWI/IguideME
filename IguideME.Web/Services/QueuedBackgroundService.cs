using IguideME.Web.Models.Service;
using Microsoft.Extensions.Hosting;
using System;
using System.Collections.Concurrent;
using System.Threading;
using System.Threading.Tasks;

namespace IguideME.Web.Services
{
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
		private readonly IComputationJobStatusService _jobStatusService;

		private static readonly ConcurrentQueue<JobQueueItem> _queue = new ConcurrentQueue<JobQueueItem>();
		private static readonly SemaphoreSlim _signal = new SemaphoreSlim(0);

		public QueuedBackgroundService(
			ICanvasSyncService workService,
			IComputationJobStatusService jobStatusService)
		{
			_workService = workService;
			_jobStatusService = jobStatusService;
		}

		// Transient method via IQueuedBackgroundService
		public async Task<JobCreatedModel> PostWorkItemAsync(JobParametersModel jobParameters)
		{
			var jobId = await _jobStatusService.CreateJobAsync(jobParameters).ConfigureAwait(false);
			_queue.Enqueue(new JobQueueItem { JobId = jobId, JobParameters = jobParameters });
			_signal.Release(); // signal for background service to start working on the job
			return new JobCreatedModel { JobId = jobId, QueuePosition = _queue.Count };
		}

		// Long running task via BackgroundService
		protected override async Task ExecuteAsync(CancellationToken stoppingToken)
		{
			while (!stoppingToken.IsCancellationRequested)
			{
				JobQueueItem jobQueueItem = null;
				try
				{
					// wait for the queue to signal there is something that needs to be done
					await _signal.WaitAsync(stoppingToken).ConfigureAwait(false);

					// dequeue the item
					jobQueueItem = _queue.TryDequeue(out var workItem) ? workItem : null;

					if (jobQueueItem != null)
					{
						// put the job in to a "processing" state
						await _jobStatusService.UpdateJobStatusAsync(
							jobQueueItem.JobId, JobStatus.Processing).ConfigureAwait(false);

						// the heavy lifting is done here...
						var result = await _workService.DoWorkAsync(
							jobQueueItem.JobId, jobQueueItem.JobParameters,
							stoppingToken).ConfigureAwait(false);

						// store the result of the work and set the status to "finished"
						await _jobStatusService.StoreJobResultAsync(
							jobQueueItem.JobId, result, JobStatus.Success).ConfigureAwait(false);
					}
				}
				catch (TaskCanceledException)
				{
					break;
				}
				catch (Exception ex)
				{
					try
					{
						// something went wrong. Put the job in to an errored state and continue on
						// application will use latest successful state
						await _jobStatusService.StoreJobResultAsync(jobQueueItem.JobId, new JobResultModel
						{
							Exception = new JobExceptionModel(ex)
						}, JobStatus.Errored).ConfigureAwait(false);
					}
					catch (Exception)
					{
						// TODO: log this?
					}
				}
			}
		}
	}
}