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
        public double MaxGrade { get; set; }

        [JsonProperty("grading_type")]
        public AppGradingType GradingType { get; set; }

        public AppAssignment(
            int id,
            int courseID,
            string title,
            bool published,
            bool muted,
            int dueDate,
            double maxGrade,
            AppGradingType gradingType)
        {
            this.ID = id;
            this.CourseID = courseID;
            this.Title = title;
            this.Published = published;
            this.Muted = muted;
            this.DueDate = dueDate;
            this.MaxGrade = maxGrade;
            this.GradingType = gradingType;
        }

    }
}
