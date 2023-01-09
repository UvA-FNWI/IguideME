﻿using System.Collections.Generic;

using IguideME.Web.Services;

using Newtonsoft.Json;

namespace IguideME.Web.Models.App
{
    public class AppDiscussion
    {
        [JsonProperty("id")]
        public int ID { get; set; }

        [JsonProperty("discussion_id")]
        public int DiscussionID { get; set; }

        [JsonProperty("course_id")]
        public int CourseID { get; set; }

        [JsonProperty("title")]
        public string Title { get; set; }

        [JsonProperty("posted_by")]
        public string PostedBy { get; set; }

        [JsonProperty("posted_at")]
        public string PostedAt { get; set; }

        [JsonProperty("message")]
        public string Message { get; set; }

        [JsonProperty("entries")]
        public List<AppDiscussionEntry> Entries { get; set;}

        public AppDiscussion(
            int id,
            int discussionID,
            int courseID,
            string title,
            string postedBy,
            string postedAt,
            string message)
        {
            this.ID = id;
            this.DiscussionID = discussionID;
            this.CourseID = courseID;
            this.Title = title;
            this.PostedBy = postedBy;
            this.PostedAt = postedAt;
            this.Message = message;
        }

        public void getEntries(string user_id = null) {
            this.Entries = DatabaseManager.Instance.GetDiscussionEntries(this.CourseID, this.DiscussionID, user_id);
        }

    }
}
