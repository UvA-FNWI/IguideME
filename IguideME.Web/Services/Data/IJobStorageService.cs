using System.Collections.Generic;
using System.Threading.Tasks;
using IguideME.Web.Models.Service;

namespace IguideME.Web.Services.Data
{
	/// <summary>
	/// Interface for a job storage service that allows for reading, writing, and deleting jobs from a data store.
	/// </summary>
	public interface IJobStorageService
	{
		/// <summary>
		/// Reads a job with the specified job ID from the data store.
		/// </summary>
		/// <param name="databaseKey">The key of the database to read the job from.</param>
		/// <param name="jobId">The ID of the job to read.</param>
		/// <returns>A <see cref="Task"/> representing the asynchronous operation that returns the job with the specified ID.</returns>
		Task<JobModel> ReadAsync(string databaseKey, string jobId);

		/// <summary>
		/// Writes a job to the data store.
		/// </summary>
		/// <param name="databaseKey">The key of the database to write the job to.</param>
		/// <param name="job">The job to write to the data store.</param>
		/// <returns>A <see cref="Task"/> representing the asynchronous operation that writes the job to the data store.</returns>
		Task WriteAsync(string databaseKey, JobModel job);

		/// <summary>
		/// Clears all jobs from the specified database.
		/// </summary>
		/// <param name="databaseKey">The key of the database to clear all jobs from.</param>
		/// <returns>A <see cref="Task"/> representing the asynchronous operation that clears all jobs from the specified database.</returns>
		Task ClearAllAsync(string databaseKey);

		/// <summary>
		/// Checks if a job with the specified ID exists in the data store.
		/// </summary>
		/// <param name="databaseKey">The key of the database to check for the job.</param>
		/// <param name="jobId">The ID of the job to check for.</param>
		/// <returns>A <see cref="Task"/> representing the asynchronous operation that returns true if the job exists, and false otherwise.</returns>
		Task<bool> ExistsAsync(string databaseKey, string jobId);

		/// <summary>
		/// Gets all jobs in the specified database.
		/// </summary>
		/// <param name="databaseKey">The key of the database to get all jobs from.</param>
		/// <returns>A <see cref="Task"/> representing the asynchronous operation that returns a dictionary of all jobs in the database, where the keys are the job IDs and the values are the jobs.</returns>
		Task<IReadOnlyDictionary<string, JobModel>> GetAllAsync(string databaseKey);
	}

}
