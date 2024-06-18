using System.Collections.Generic;
using Newtonsoft.Json;

namespace IguideME.Web.Models.App
{
    public enum Discussion_type
    {
        Topic,
        Entry,
        Reply
    }
    public class AppDiscussionTopic
    {
        [JsonProperty("id")]
        public int ID { get; set; }

        [JsonProperty("course_id")]
        public int CourseID { get; set; }

        [JsonProperty("title")]
        public string Title { get; set; }

        [JsonProperty("author")]
        public string Author { get; set; }

        [JsonProperty("date")]
        public long Date { get; set; }

        [JsonProperty("message")]
        public string Message { get; set; }

        public IEnumerable<AppDiscussionEntry> Entries { get; set; }

        // Only populated when send to frontend
        [JsonProperty(PropertyName = "grades")]
        public AssignmentGrades Grades { get; set; }

        public AppDiscussionTopic(
            int id,
            int courseID,
            string title,
            string author,
            long date,
            string message,
            IEnumerable<AppDiscussionEntry> entries)
        {
            this.ID = id;
            this.CourseID = courseID;
            this.Title = title;
            this.Author = author;
            this.Date = date;
            this.Message = message;
            this.Entries = entries;
        }

        public AppDiscussionTopic(
            int id,
            int courseID,
            string title,
            string author,
            long date,
            string message,
            AssignmentGrades grades)
        {
            this.ID = id;
            this.CourseID = courseID;
            this.Title = title;
            this.Author = author;
            this.Date = date;
            this.Message = message;
            this.Grades = grades;
        }

    }

    public class AppDiscussionEntry
    {
        [JsonProperty("id")]
        public int ID { get; set; }

        [JsonProperty("discussion_id")]
        public int DiscussionID { get; set; }

        [JsonProperty("parent_id")]
        public int ParentID { get; set; }

        [JsonProperty("course_id")]
        public int CourseID { get; set; }

        [JsonProperty("author")]
        public string Author { get; set; }

        [JsonProperty("date")]
        public long Date { get; set; }

        [JsonProperty("message")]
        public string Message { get; set; }

        // Only populated when send to frontend
        [JsonProperty(PropertyName = "grades")]
        public AssignmentGrades Grades { get; set; }

        public AppDiscussionEntry(
            int id,
            int discussionID,
            int parentID,
            int courseID,
            string author,
            long date,
            string message)
        {
            this.ID = id;
            this.DiscussionID = discussionID;
            this.ParentID = parentID;
            this.CourseID = courseID;
            this.Author = author;
            this.Date = date;
            this.Message = message;
        }

        public AppDiscussionEntry(
            int id,
            int discussionID,
            int parentID,
            int courseID,
            string author,
            long date,
            string message,
            AssignmentGrades grades)
        {
            this.ID = id;
            this.DiscussionID = discussionID;
            this.ParentID = parentID;
            this.CourseID = courseID;
            this.Author = author;
            this.Date = date;
            this.Message = message;
            this.Grades = grades;
        }

    }
}
