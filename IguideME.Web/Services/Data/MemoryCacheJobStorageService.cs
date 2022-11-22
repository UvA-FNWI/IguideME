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
		private static readonly ConcurrentDictionary<string, JobModel> Jobs = new ConcurrentDictionary<string, JobModel>();

		private static string Key(string databaseKey, string jobId) => $"{databaseKey}:{jobId}";

		public Task ClearAllAsync(string databaseKey)
		{
			var keys = Jobs.Where(x => x.Key.StartsWith(databaseKey)).Select(x => x.Key);
			foreach (var k in keys)
			{
				Jobs.Remove(k, out _);
			}
			return Task.CompletedTask;
		}

		public Task<bool> ExistsAsync(string databaseKey, string jobId)
		{
			return Task.FromResult(Jobs.ContainsKey(Key(databaseKey, jobId)));
		}

		public Task<IReadOnlyDictionary<string, JobModel>> GetAllAsync(string databaseKey)
		{
			var d = Jobs.Where(
				x => x.Key.StartsWith(databaseKey)).ToDictionary(
					y => y.Value.JobId, y => y.Value).ToImmutableDictionary();

			return Task.FromResult<IReadOnlyDictionary<string, JobModel>>(d);
		}

		public Task<JobModel> ReadAsync(string databaseKey, string jobId)
		{
			var key = Key(databaseKey, jobId);
			return Jobs.ContainsKey(key) ? Task.FromResult(Jobs[key]) : null;
		}

		public Task WriteAsync(string databaseKey, JobModel job)
		{
			Jobs[Key(databaseKey, job.JobId)] = job;
			return Task.CompletedTask;
		}
    }
}