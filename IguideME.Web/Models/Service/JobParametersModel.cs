﻿using Newtonsoft.Json;

namespace IguideME.Web.Models.Service
{
	public sealed class JobParametersModel
	{
		[JsonProperty("seedData")]
		public uint SeedData { get; set; }

		[JsonProperty("courseID")]
		public int CourseID { get; set; }

		[JsonProperty("Notifications_bool")]
		public bool Notifications_bool { get; set; }

		// TODO: are we missing any parameters?

	}
}
