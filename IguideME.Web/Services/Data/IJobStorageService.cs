using System.Collections.Generic;
using System.Threading.Tasks;
using IguideME.Web.Models.Service;

namespace IguideME.Web.Services.Data
{
	public interface IJobStorageService
	{
		Task<JobModel> ReadAsync(string databaseKey, string jobId);
		Task WriteAsync(string databaseKey, JobModel job);
		Task ClearAllAsync(string databaseKey);
		Task<bool> ExistsAsync(string databaseKey, string jobId);
		Task<IReadOnlyDictionary<string, JobModel>> GetAllAsync(string databaseKey);
	}
}