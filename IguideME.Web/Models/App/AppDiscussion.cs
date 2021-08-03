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

        public AppDiscussion(
            int id,
            int discussionID,
            int courseID,
            string title,
            string postedBy,
            string postedAt)
        {
            this.ID = id;
            this.DiscussionID = discussionID;
            this.CourseID = courseID;
            this.Title = title;
            this.PostedBy = postedBy;
            this.PostedAt = postedAt;
        }

    }
}
