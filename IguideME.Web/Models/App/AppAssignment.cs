using Newtonsoft.Json;

namespace IguideME.Web.Models.App
{
    public enum AppGradingType
    {
        PassFail,
        Percentage,
        Letters,
        Points,
        NotGraded
    }
    public class AppAssignment
    {
        [JsonProperty("id")]
        public int ID { get; set; }

        [JsonProperty("assignment_id")]
        public int AssignmentID { get; set; }

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
        public double PointsPossible { get; set; }

        [JsonProperty("position")]
        public int Position { get; set; }

        [JsonProperty("submission_type")]
        public string SubmissionType { get; set; }

        [JsonProperty("grading_type")]
        public AppGradingType GradingType { get; set; }

        public AppAssignment(
            int id,
            int assignmentID,
            int courseID,
            string name,
            bool published,
            bool muted,
            string dueDate,
            double pointsPossible,
            int position,
            AppGradingType gradingType,
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
