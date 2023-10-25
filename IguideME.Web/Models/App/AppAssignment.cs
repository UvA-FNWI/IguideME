using Newtonsoft.Json;

using UvA.DataNose.Connectors.Canvas;

namespace IguideME.Web.Models.App
{
    public class AppAssignment
    {
        [JsonProperty("id")]
        public int ID { get; set; }

        // [JsonProperty("assignment_id")]
        // public string AssignmentID { get; set; }

        [JsonProperty("course_id")]
        public int CourseID { get; set; }

        [JsonProperty("title")]
        public string Title { get; set; }

        [JsonProperty("published")]
        public bool Published { get; set; }

        [JsonProperty("muted")]
        public bool Muted { get; set; }

        [JsonProperty("due_date")]
        public int DueDate { get; set; }

        [JsonProperty("max_grade")]
        public float MaxGrade { get; set; }

        // [JsonProperty("position")]
        // public int Position { get; set; }

        [JsonProperty("grading_type")]
        public GradingType GradingType { get; set; }

        public AppAssignment(
            int id,
            // string assignmentID,
            int courseID,
            string title,
            bool published,
            bool muted,
            int dueDate,
            float maxGrade,
            // int position,
            int gradingType)
        {
            this.ID = id;
            // this.AssignmentID = assignmentID;
            this.CourseID = courseID;
            this.Title = title;
            this.Published = published;
            this.Muted = muted;
            this.DueDate = dueDate;
            this.MaxGrade = maxGrade;
            // this.Position = position;
            this.GradingType = (GradingType)gradingType;
        }

    }
}
