using Newtonsoft.Json;

namespace IguideME.Web.Models.App
{
    public class GradePredictionModel
    {
        [JsonProperty("id")]
        public int ID { get; set; }

        [JsonProperty("course_id")]
        public int CourseID { get; set; }

        public GradePredictionModel(
            int id,
            int courseID)
        {
            this.ID = id;
            this.CourseID = courseID;
        }
    }
}
