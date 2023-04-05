using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Collections.Immutable;
using System.Linq;
using System.Threading.Tasks;
using IguideME.Web.Models.Service;

namespace IguideME.Web.Services.Data
{
	public sealed class MemoryCacheJobStorageService : IJobStorageService
	{
		private static readonly ConcurrentDictionary<string, JobModel> Jobs = new();

		private static string Key(string databaseKey, string jobId) => $"{databaseKey}:{jobId}";

		/// <summary>
        /// Remove all jobs from storage.
        /// </summary>
        /// <param name="databaseKey">The key used to select which database to clear.</param>
        /// <returns>The completed task</returns>
		public Task ClearAllAsync(string databaseKey)
		{
			IEnumerable<string> keys = Jobs.Where(x => x.Key.StartsWith(databaseKey)).Select(x => x.Key);
			foreach (string key in keys)
			{
				Jobs.Remove(key, out _);
			}
			return Task.CompletedTask;
		}

		/// <summary>
        /// Checks if a task exists in storage.
        /// </summary>
        /// <param name="databaseKey">The key used to select which database to check.</param>
        /// <param name="jobId">The id of the job to look for.</param>
        /// <returns>A task containing the result of the check.</returns>
		public Task<bool> ExistsAsync(string databaseKey, string jobId)
		{
			return Task.FromResult(Jobs.ContainsKey(Key(databaseKey, jobId)));
		}

		/// <summary>
        /// Gets all jobs from storage.
        /// </summary>
        /// <param name="databaseKey">The key used to select which database to retrieve from.</param>
        /// <returns>A task containing a dictionary with the jobs</returns>
		public Task<IReadOnlyDictionary<string, JobModel>> GetAllAsync(string databaseKey)
		{
			ImmutableDictionary<string, JobModel> dict = Jobs.Where(
				x => x.Key.StartsWith(databaseKey)).ToDictionary(
					y => y.Value.JobId, y => y.Value).ToImmutableDictionary();

			return Task.FromResult<IReadOnlyDictionary<string, JobModel>>(dict);
		}

		/// <summary>
        /// Read a job from storage.
        /// </summary>
        /// <param name="databaseKey">The key used to select which database to read from.</param>
        /// <param name="jobId">The id of the job to read.</param>
        /// <returns>A task containing the job if found or null</returns>
		public Task<JobModel> ReadAsync(string databaseKey, string jobId)
		{
			string key = Key(databaseKey, jobId);
            return !Jobs.ContainsKey(key) ? null : Task.FromResult(Jobs[key]);
        }

		/// <summary>
        /// Write a job to storgae.
        /// </summary>
        /// <param name="databaseKey">The key used to select which database to store the job into.</param>
        /// <param name="job">A reference to the job to be stored.</param>
        /// <returns></returns>
		public Task WriteAsync(string databaseKey, JobModel job)
		{
			Jobs[Key(databaseKey, job.JobId)] = job;
			return Task.CompletedTask;
		}
    }
}
