using Newtonsoft.Json;

namespace IguideME.Web.Models.Service
{
	public sealed class JobParametersModel
	{
		[JsonProperty("seedData")]
		public uint SeedData { get; set; }

		[JsonProperty("courseID")]
		public uint CourseID { get; set; }

		// TODO: are we missing any parameters?
	}
}