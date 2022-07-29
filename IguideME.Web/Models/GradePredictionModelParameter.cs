using Newtonsoft.Json;

namespace IguideME.Web.Models.App
{
    public class GradePredictionModelParameter
    {
        public int ID { get; set; }

        public int ModelID { get; set; }

        [JsonProperty("parameterID")]
        public int ParameterID { get; set; }

        [JsonProperty("weight")]
        public float Weight { get; set; }

        [JsonConstructor]
        public GradePredictionModelParameter(
            int parameterID,
            float weight)
        {
            this.ParameterID = parameterID;
            this.Weight = weight;
        }

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
