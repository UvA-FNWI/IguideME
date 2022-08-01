using Newtonsoft.Json;
using System.Collections.Generic;

namespace IguideME.Web.Models.App
{
    public class GradePredictionModel
    {
        public int ID { get; set; }
        public int CourseID { get; set; }
        public bool Enabled { get; set; }

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
            int courseID,
            bool enabled)
        {
            this.ID = id;
            this.CourseID = courseID;
            this.Enabled = enabled;
        }

        public GradePredictionModel(
            int id,
            int courseID,
            bool enabled,
            List<GradePredictionModelParameter> parameters)
        {
            this.ID = id;
            this.CourseID = courseID;
            this.Enabled = enabled;
            this.Parameters = parameters;
        }

    }
}
