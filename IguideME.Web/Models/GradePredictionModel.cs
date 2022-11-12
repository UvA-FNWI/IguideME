using Newtonsoft.Json;
using IguideME.Web.Services;
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

        [JsonProperty("intercept")]
        public float Intercept {get; set;}

        [JsonConstructor]
        public GradePredictionModel(
            List<GradePredictionModelParameter> parameters,
            float intercept)
        {
            this.Parameters = parameters;
            this.Intercept = intercept;
        }

        public GradePredictionModel(
            int id,
            int courseID,
            bool enabled,
            float intercept)
        {
            this.ID = id;
            this.CourseID = courseID;
            this.Enabled = enabled;
            this.Intercept = intercept;
        }

        public GradePredictionModel(
            int id,
            int courseID,
            bool enabled,
            List<GradePredictionModelParameter> parameters,
            float intercept)
        {
            this.ID = id;
            this.CourseID = courseID;
            this.Enabled = enabled;
            this.Parameters = parameters;
            this.Intercept = intercept;
        }

        public void getParameters() {
            this.Parameters = DatabaseManager.Instance.GetGradePredictionModelParameters(this.ID);
        }
    }
}
