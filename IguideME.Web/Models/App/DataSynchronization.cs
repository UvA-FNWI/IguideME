﻿using System;
using Newtonsoft.Json;

namespace IguideME.Web.Models.App
{
    public class DataSynchronization
    {
        // [JsonProperty("id")]
        // public int Id { get; set; }

        [JsonProperty("course_id")]
        public int CourseID { get; set; }

        [JsonProperty("start_timestamp")]
        public long StartTimestamp { get; set; }

        [JsonProperty("end_timestamp")]
        public long? EndTimestamp { get; set; }

        [JsonProperty("status")]
        public string Status { get; set; }

        public DataSynchronization(
            // int id,
            int courseID,
            long startTimestamp,
            long? endTimestamp,
            string status)
        {
            // this.Id = id;
            this.CourseID = courseID;
            this.StartTimestamp = startTimestamp;
            this.EndTimestamp = endTimestamp;
            this.Status = status;
        }


    }
}

