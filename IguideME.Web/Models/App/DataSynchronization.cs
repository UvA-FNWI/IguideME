using System;
using Newtonsoft.Json;

namespace IguideME.Web.Models.App
{
    public class DataSynchronization
    {
        [JsonProperty("id")]
        public int Id { get; set; }

        [JsonProperty("course_id")]
        public int CourseID { get; set; }

        [JsonProperty("start_timestamp")]
        public string StartTimestamp { get; set; }

        [JsonProperty("end_timestamp")]
        public string EndTimestamp { get; set; }

        [JsonProperty("status")]
        public string Status { get; set; }

        [JsonProperty("hash")]
        public string Hash { get; set; }

        // duration of synchronization in seconds
        [JsonProperty("duration")]
        public int Duration { get; set; }

        public DataSynchronization(
            int id,
            int courseID,
            DateTime startTimestamp,
            DateTime endTimestamp,
            string status,
            string hash)
        {
            this.Id = id;
            this.CourseID = courseID;
            this.StartTimestamp = startTimestamp.ToString();
            this.EndTimestamp = endTimestamp.ToString();
            this.Status = status;
            this.Hash = hash;

            this.Duration = endTimestamp != null && startTimestamp != null ? (int) Math.Floor((endTimestamp - startTimestamp).TotalSeconds) : -1;
        }


    }
}

