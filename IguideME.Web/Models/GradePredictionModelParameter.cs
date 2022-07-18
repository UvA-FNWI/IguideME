using Newtonsoft.Json;

namespace IguideME.Web.Models.App
{
    public class GradePredictionModelParameter
    {
        [JsonProperty("id")]
        public int ID { get; set; }

        [JsonProperty("model_id")]
        public int ModelID { get; set; }

        [JsonProperty("parameter_id")]
        public int ParameterID { get; set; }

        [JsonProperty("weight")]
        public float Weight { get; set; }

        public GradePredictionModelParameter(
            int id,
            int modelID,
            int parameterID,
            float weight)
        {
            this.ID = id;
            this.ModelID = modelID;
            this.ParameterID = parameterID;
            this.Weight = weight;
        }
    }
}
