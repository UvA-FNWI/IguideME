using Newtonsoft.Json;

namespace IguideME.Web.Models.App
{
    public class AppAssignment
    {
        [JsonProperty("id")]
        public int ID { get; set; }

        [JsonProperty("course_id")]
        public int CourseID { get; set; }

        [JsonProperty("title")]
        public string Title { get; set; }

        [JsonProperty("external_id")]
        public int? ExternalID { get; set; }

        [JsonProperty("published")]
        public bool Published { get; set; }

        [JsonProperty("muted")]
        public bool Muted { get; set; }

        [JsonProperty("due_date")]
        public long DueDate { get; set; }

        [JsonProperty("max_grade")]
        public double MaxGrade { get; set; }

        [JsonProperty("grading_type")]
        public AppGradingType GradingType { get; set; }

        public AppAssignment(
            int id,
            int courseID,
            string title,
            int? externalID,
            bool published,
            bool muted,
            long dueDate,
            double maxGrade,
            AppGradingType gradingType)
        {
            this.ID = id;
            this.CourseID = courseID;
            this.Title = title;
            this.ExternalID = externalID;
            this.Published = published;
            this.Muted = muted;
            this.DueDate = dueDate;
            this.MaxGrade = maxGrade;
            this.GradingType = gradingType;
        }

    }
}
