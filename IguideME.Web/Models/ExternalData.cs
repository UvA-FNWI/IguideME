using IguideME.Web.Models.App;
using Newtonsoft.Json;

namespace IguideME.Web.Models
{
    public class ExternalData
    {
        [JsonProperty(PropertyName = "course_id")]
        public int CourseID { get; set; }

        [JsonProperty(PropertyName = "title")]
        public string Title { get; set; }

        [JsonProperty("max_grade")]
        public double MaxGrade { get; set; }

        [JsonProperty("grading_type")]
        public AppGradingType GradingType { get; set; }

        [JsonProperty(PropertyName = "grade")]
        public string Grade { get; set; }


        public ExternalData(int courseID, string title, double max, AppGradingType type, string grade)
        {
            this.CourseID = courseID;
            this.Title = title;
            this.MaxGrade = max;
            this.GradingType = type;
            this.Grade = grade;
        }
    }

    public class ExternalGrades {

    }
}
