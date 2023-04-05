using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using IguideME.Web.Models.Service;
using IguideME.Web.Services.Data;

namespace IguideME.Web.Services
{
    // Not strictly necessary since we only have 1 class but apparently good practice for DI and testing.
	public interface IComputationJobStatusService
	{
		Task<string> CreateJobAsync(JobParametersModel jobParameters);
		Task StoreJobResultAsync(string jobId, JobResultModel result, JobStatus jobStatus);
		Task UpdateJobProgressInformationAsync(string jobId, string value, double percentage);
		Task UpdateJobStatusAsync(string jobId, JobStatus jobStatus);
		Task<JobModel> GetJobAsync(string jobId);
		Task<IReadOnlyDictionary<string, JobModel>> GetAllJobsAsync();
		Task ClearAllJobsAsync();
	}

	public sealed class ComputationJobStatusService : IComputationJobStatusService
	{
		private const string DatabaseKey = "_ComputationJobStatus";
		private readonly IJobStorageService _jobStorage;

		/// <summary>
        /// This constructor initializes the new ComputationJobStatusService to (<paramref name="jobStorageService"/>).
        /// </summary>
        /// <param name="jobStorageService">A reference to the service that manages the storage of jobs (rediscache/memory).</param>
		public ComputationJobStatusService(IJobStorageService jobStorageService)
		{
			_jobStorage = jobStorageService;
		}

		/// <summary>
        /// Creates a job and writes it to storage.
        /// </summary>
        /// <param name="jobParameters">The parameters used to instantiate the job.</param>
        /// <returns>The id of the job.</returns>
		public async Task<string> CreateJobAsync(JobParametersModel jobParameters)
		{
			// find a jobId that isn't in use (this may be pointless, but could you imagine?)
			string jobId;
			do
			{
				jobId = Guid.NewGuid().ToString();
			} while (await _jobStorage.ExistsAsync(DatabaseKey, jobId).ConfigureAwait(false));

			await WriteAsync(new JobModel
			{
				JobId = jobId,
				StartTime = DateTime.UtcNow,
				Status = JobStatus.Pending,
				WorkParameters = jobParameters
			}).ConfigureAwait(false);

			return jobId;
		}

		/// <summary>
        /// Retrieves a job from storage.
        /// </summary>
        /// <param name="jobId">The id of the job to retrieve.</param>
        /// <returns>A task containing the job or null.</returns>
		public async Task<JobModel> GetJobAsync(string jobId)
		{
            return !await _jobStorage.ExistsAsync(DatabaseKey, jobId).ConfigureAwait(false)
                ? null
                : await _jobStorage.ReadAsync(DatabaseKey, jobId).ConfigureAwait(false);
        }

		/// <summary>
        /// Retrieves all the jobs from storage.
        /// </summary>
        /// <returns>A task containing a dictionary with all the jobs.</returns>
        public Task<IReadOnlyDictionary<string, JobModel>> GetAllJobsAsync()
		{
			return _jobStorage.GetAllAsync(DatabaseKey);
		}

		/// <summary>
        /// Updates the job's status to the given status.
        /// </summary>
        /// <param name="jobId">The id of the job to update.</param>
        /// <param name="jobStatus">The new status of the job.</param>
        /// <returns>The completed task.</returns>
		public async Task UpdateJobStatusAsync(string jobId, JobStatus jobStatus)
		{
			JobModel job = await _jobStorage.ReadAsync(DatabaseKey, jobId).ConfigureAwait(false);
			job.Status = jobStatus;
			await WriteAsync(job).ConfigureAwait(false);
		}

		/// <summary>
        /// Updates the result and status of a job.
        /// </summary>
        /// <param name="jobId">The id of the job to update.</param>
        /// <param name="result">The result of the job.</param>
        /// <param name="jobStatus">The new status of the job</param>
        /// <returns>The completed task.</returns>
		public async Task StoreJobResultAsync(string jobId, JobResultModel result, JobStatus jobStatus)
		{
			JobModel job = await _jobStorage.ReadAsync(DatabaseKey, jobId).ConfigureAwait(false);
			job.Status = jobStatus;
			job.JobResult = result;
			await WriteAsync(job).ConfigureAwait(false);
		}

		/// <summary>
        /// Updates the progression of the job.
        /// </summary>
        /// <param name="jobId">The id of the job to update.</param>
        /// <param name="value">The new information about the progress.</param>
        /// <param name="percentage">The current percentage of completion.</param>
        /// <returns>The completed task.</returns>
		public async Task UpdateJobProgressInformationAsync(string jobId, string value, double percentage)
		{
			JobModel job = await _jobStorage.ReadAsync(DatabaseKey, jobId).ConfigureAwait(false);
			job.ProgressInformation = value;
			job.ProgressPercentage = percentage;
			await WriteAsync(job).ConfigureAwait(false);
		}

		/// <summary>
        /// Write a job to storage.
        /// </summary>
        /// <param name="job">A reference to the job to store.</param>
        /// <returns>The completed task.</returns>
		private Task WriteAsync(JobModel job)
		{
			job.LastUpdate = DateTime.UtcNow;
			return _jobStorage.WriteAsync(DatabaseKey, job);
		}

		/// <summary>
        /// Clear all the jobs from storage.
        /// </summary>
        /// <returns>The completed task.</returns>
		public Task ClearAllJobsAsync()
		{
			return _jobStorage.ClearAllAsync(DatabaseKey);
		}
	}
}
