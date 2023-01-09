using System.Collections.Generic;

using IguideME.Web.Services;

using Newtonsoft.Json;

namespace IguideME.Web.Models.App
{
    public class AppDiscussionEntry
    {
        [JsonProperty("id")]
        public int ID { get; set; }

        [JsonProperty("discussion_id")]
        public int DiscussionID { get; set; }

        [JsonProperty("course_id")]
        public int CourseID { get; set; }

        [JsonProperty("posted_by")]
        public string PostedBy { get; set; }

        [JsonProperty("posted_at")]
        public string PostedAt { get; set; }

        [JsonProperty("message")]
        public string Message { get; set; }


        public AppDiscussionEntry(
            int id,
            int courseID,
            int discussionID,
            string postedBy,
            string postedAt,
            string message)
        {
            this.ID = id;
            this.CourseID = courseID;
            this.DiscussionID = discussionID;
            this.PostedBy = postedBy;
            this.PostedAt = postedAt;
            this.Message = message;
        }
    }
}
