using System.Collections.Generic;

using IguideME.Web.Services;

using Newtonsoft.Json;

namespace IguideME.Web.Models.App
{
    public enum Discussion_type
    {
        Topic,
        Entry,
        Reply
    }
    public class AppDiscussion
    {
        [JsonProperty("id")]
        public int ID { get; set; }

        [JsonProperty("type")]
        public Discussion_type Type { get; set; }

        [JsonProperty("parent_id")]
        public int ParentID { get; set; }

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

        // Only populated when send to frontend
        [JsonProperty(PropertyName = "grades")]
        public AssignmentGrades Grades { get; set; }

        public AppDiscussion(
            Discussion_type type,
            int id,
            int parentID,
            int courseID,
            string title,
            string author,
            long date,
            string message)
        {
            this.ID = id;
            this.Type = type;
            this.ParentID = parentID;
            this.CourseID = courseID;
            this.Title = title;
            this.Author = author;
            this.Date = date;
            this.Message = message;
        }

        public AppDiscussion(
            Discussion_type type,
            int id,
            int parentID,
            int courseID,
            string title,
            string author,
            long date,
            string message,
            AssignmentGrades grades)
        {
            this.ID = id;
            this.Type = type;
            this.ParentID = parentID;
            this.CourseID = courseID;
            this.Title = title;
            this.Author = author;
            this.Date = date;
            this.Message = message;
            this.Grades = grades;
        }

    }
}
