using System;
using Newtonsoft.Json;

namespace IguideME.Web.Models.App
{
    public class DataSynchronization
    {
        [JsonProperty("id")]
        public int id { get; set; }

        [JsonProperty("course_id")]
        public int courseID { get; set; }

        [JsonProperty("start_timestamp")]
        public string startTimestamp { get; set; }

        [JsonProperty("end_timestamp")]
        public string endTimestamp { get; set; }

        [JsonProperty("status")]
        public string status { get; set; }

        [JsonProperty("hash")]
        public string hash { get; set; }

        // duration of synchronization in seconds
        [JsonProperty("duration")]
        public int duration { get; set; }

        public DataSynchronization(
            int id,
            int courseID,
            string startTimestamp,
            string endTimestamp,
            string status,
            string hash)
        {
            this.id = id;
            this.courseID = courseID;
            this.startTimestamp = startTimestamp;
            this.endTimestamp = endTimestamp;
            this.status = status;
            this.hash = hash;

            // TODO
            this.duration = 100;
        }


    }
}

