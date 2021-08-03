using Newtonsoft.Json;

namespace IguideME.Web.Models.App
{
    public class AppAssignment
    {
        [JsonProperty("id")]
        public int ID { get; set; }

        [JsonProperty("assignment_id")]
        public string AssignmentID { get; set; }

        [JsonProperty("course_id")]
        public int CourseID { get; set; }

        [JsonProperty("name")]
        public string Name { get; set; }

        [JsonProperty("published")]
        public bool Published { get; set; }

        [JsonProperty("muted")]
        public bool Muted { get; set; }

        [JsonProperty("due_date")]
        public string DueDate { get; set; }

        [JsonProperty("points_possible")]
        public float PointsPossible { get; set; }

        [JsonProperty("position")]
        public int Position { get; set; }

        [JsonProperty("submission_type")]
        public string SubmissionType { get; set; }

        public AppAssignment(
            int id,
            string assignmentID,
            int courseID,
            string name,
            bool published,
            bool muted,
            string dueDate,
            float pointsPossible,
            int position,
            string submissionType)
        {
            this.ID = id;
            this.AssignmentID = assignmentID;
            this.CourseID = courseID;
            this.Name = name;
            this.Published = published;
            this.Muted = muted;
            this.DueDate = dueDate;
            this.PointsPossible = pointsPossible;
            this.Position = position;
            this.SubmissionType = submissionType;
        }

    }
}
