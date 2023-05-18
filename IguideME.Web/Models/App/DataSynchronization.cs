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

        // duration of synchronization in seconds
        [JsonProperty("duration")]
        public int Duration { get; set; }

        public DataSynchronization(
            int id,
            int courseID,
            DateTime startTimestamp,
            DateTime endTimestamp,
            string status)
        {
            this.Id = id;
            this.CourseID = courseID;
            this.StartTimestamp = String.Format("{0:M/d/yyyy HH:mm:ss}",startTimestamp);
            this.EndTimestamp = String.Format("{0:M/d/yyyy HH:mm:ss}",endTimestamp);
            this.Status = status;

            this.Duration = (int) Math.Floor((endTimestamp - startTimestamp).TotalSeconds);
        }


    }
}

