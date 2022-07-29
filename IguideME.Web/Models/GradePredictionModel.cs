using Newtonsoft.Json;
using System.Collections.Generic;

namespace IguideME.Web.Models.App
{
    public class GradePredictionModel
    {
        public int ID { get; set; }

        public int CourseID { get; set; }

        [JsonProperty("parameters")]
        public List<GradePredictionModelParameter> Parameters { get; set; }

        [JsonConstructor]
        public GradePredictionModel(
            List<GradePredictionModelParameter> parameters)
        {
            this.Parameters = parameters;
        }

        public GradePredictionModel(
            int id,
            int courseID)
        {
            this.ID = id;
            this.CourseID = courseID;
        }

        public GradePredictionModel(
            int id,
            int courseID,
            List<GradePredictionModelParameter> parameters)
        {
            this.ID = id;
            this.CourseID = courseID;
            this.Parameters = parameters;
        }

    }
}
