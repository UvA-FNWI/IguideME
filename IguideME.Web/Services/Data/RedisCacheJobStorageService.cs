using IguideME.Web.Models.Service;
using Newtonsoft.Json;
using StackExchange.Redis;
using System.Collections.Generic;
using System.Collections.Immutable;
using System.Linq;
using System.Threading.Tasks;

namespace IguideME.Web.Services.Data
{
	/// <summary>
	/// A job storage service implementation that uses Redis as its data store.
    /// This class provides methods for reading, writing, deleting, and checking the existence of jobs stored in Redis cache.
	/// </summary>
	public sealed class RedisCacheJobStorageService : IJobStorageService
	{
		private readonly IDatabaseAsync _redis;

		/// <summary>
		/// Initializes a new instance of the <see cref="RedisCacheJobStorageService"/> class with the specified Redis connection multiplexer.
		/// </summary>
		/// <param name="redis">The Redis connection multiplexer.</param>
		public RedisCacheJobStorageService(IConnectionMultiplexer redis)
		{
			_redis = redis.GetDatabase();
		}

		/// <inheritdoc />
		public async Task ClearAllAsync(string databaseKey)
		{
			RedisValue[] keys = await _redis.HashKeysAsync(databaseKey).ConfigureAwait(false);
			await Task.WhenAll(keys.Select(x =>
				_redis.HashDeleteAsync(databaseKey, x))).ConfigureAwait(false);
		}

		/// <inheritdoc />
		public async Task WriteAsync(string databaseKey, JobModel job)
		{
			string data = await Task.Run(() =>
				JsonConvert.SerializeObject(job, Formatting.None)).ConfigureAwait(false);
			await _redis.HashSetAsync(databaseKey, job.JobId, data).ConfigureAwait(false);
		}

		/// <inheritdoc />
		public async Task<JobModel> ReadAsync(string databaseKey, string jobId)
		{
			RedisValue data = await _redis.HashGetAsync(databaseKey, jobId).ConfigureAwait(false);
			return await Task.Run(() =>
				JsonConvert.DeserializeObject<JobModel>(data)).ConfigureAwait(false);
		}

		/// <inheritdoc />
		public Task<bool> ExistsAsync(string databaseKey, string jobId)
		{
			return _redis.HashExistsAsync(databaseKey, jobId);
		}

		/// <inheritdoc />
		public async Task<IReadOnlyDictionary<string, JobModel>> GetAllAsync(string databaseKey)
		{
			HashEntry[] allKeys = await _redis.HashGetAllAsync(databaseKey).ConfigureAwait(false);
			return (await Task.WhenAll(
				allKeys.Select(x =>
					Task.Run(() =>
						JsonConvert.DeserializeObject<JobModel>(x.Value.ToString())))).
							ConfigureAwait(false)).ToImmutableDictionary(y => y.JobId, y => y);
		}

		// TODO: I'm pretty sure that these are implemented above? If it doesn't cause errors after a while then just remove.
        // Task<JobModel> IJobStorageService.ReadAsync(string databaseKey, string jobId)
        // {
        //     throw new NotImplementedException();
        // }

        // Task<IReadOnlyDictionary<string, JobModel>> IJobStorageService.GetAllAsync(string databaseKey)
        // {
        //     throw new NotImplementedException();
        // }
    }
}
