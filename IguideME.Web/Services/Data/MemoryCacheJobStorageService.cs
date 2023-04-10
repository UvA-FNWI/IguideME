using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Collections.Immutable;
using System.Linq;
using System.Threading.Tasks;
using IguideME.Web.Models.Service;

namespace IguideME.Web.Services.Data
{
	/// <summary>
	/// A job storage service implementation that stores jobs in memory for testing purposes..
    /// This class provides methods for reading, writing, deleting, and checking the existence of jobs stored in memory.
	/// </summary>
	public sealed class MemoryCacheJobStorageService : IJobStorageService
	{
		private static readonly ConcurrentDictionary<string, JobModel> Jobs = new();

		private static string Key(string databaseKey, string jobId) => $"{databaseKey}:{jobId}";

		/// <inheritdoc />
		public Task ClearAllAsync(string databaseKey)
		{
			IEnumerable<string> keys = Jobs.Where(x => x.Key.StartsWith(databaseKey)).Select(x => x.Key);
			foreach (string key in keys)
			{
				Jobs.Remove(key, out _);
			}
			return Task.CompletedTask;
		}

		/// <inheritdoc />
		public Task<bool> ExistsAsync(string databaseKey, string jobId)
		{
			return Task.FromResult(Jobs.ContainsKey(Key(databaseKey, jobId)));
		}

		/// <inheritdoc />
		public Task<IReadOnlyDictionary<string, JobModel>> GetAllAsync(string databaseKey)
		{
			ImmutableDictionary<string, JobModel> dict = Jobs.Where(
				x => x.Key.StartsWith(databaseKey)).ToDictionary(
					y => y.Value.JobId, y => y.Value).ToImmutableDictionary();

			return Task.FromResult<IReadOnlyDictionary<string, JobModel>>(dict);
		}

		/// <inheritdoc />
		public Task<JobModel> ReadAsync(string databaseKey, string jobId)
		{
			string key = Key(databaseKey, jobId);
            return !Jobs.ContainsKey(key) ? null : Task.FromResult(Jobs[key]);
        }

		/// <inheritdoc />
		public Task WriteAsync(string databaseKey, JobModel job)
		{
			Jobs[Key(databaseKey, job.JobId)] = job;
			return Task.CompletedTask;
		}
    }
}
