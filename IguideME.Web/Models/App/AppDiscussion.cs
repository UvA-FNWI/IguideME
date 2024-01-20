using System.Collections.Generic;

using IguideME.Web.Services;

using Newtonsoft.Json;

namespace IguideME.Web.Models.App
{
    public enum Discussion_type
    {
        topic,
        entry,
        reply
    }
    public class AppDiscussion
    {
        [JsonProperty("id")]
        public int ID { get; set; }

        [JsonProperty("type")]
        public Discussion_type Type { get; set; }

        [JsonProperty("discussion_id")]
        public int DiscussionID { get; set; }

        [JsonProperty("parent_id")]
        public int ParentID { get; set; }

        [JsonProperty("course_id")]
        public int CourseID { get; set; }

        [JsonProperty("title")]
        public string Title { get; set; }

        [JsonProperty("posted_by")]
        public string PostedBy { get; set; }

        [JsonProperty("posted_at")]
        public long PostedAt { get; set; }

        [JsonProperty("message")]
        public string Message { get; set; }

        public AppDiscussion(
            int id,
            Discussion_type type,
            int discussionID,
            int parentID,
            int courseID,
            string title,
            string postedBy,
            long postedAt,
            string message)
        {
            this.ID = id;
            this.Type = type;
            this.DiscussionID = discussionID;
            this.ParentID = parentID;
            this.CourseID = courseID;
            this.Title = title;
            this.PostedBy = postedBy;
            this.PostedAt = postedAt;
            this.Message = message;
        }

    }
}
