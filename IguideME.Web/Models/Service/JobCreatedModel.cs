using Newtonsoft.Json;

namespace IguideME.Web.Models.Service
{
	public sealed class JobCreatedModel
	{
		[JsonProperty("jobId")]
		public string JobId { get; set; }

		[JsonProperty("queuePosition")]
		public int QueuePosition { get; set; }
	}
}