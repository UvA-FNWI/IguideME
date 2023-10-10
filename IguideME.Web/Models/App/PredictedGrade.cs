using Newtonsoft.Json;

namespace IguideME.Web.Models.App
{
    public class PredictedGrade
    {
        [JsonIgnore]
        public string UserID { get; set; }

        [JsonProperty("date")]
        public float Date { get; set; }

        [JsonProperty("grade")]
        public float Grade { get; set; }

        public PredictedGrade(
            string userID,
            float date,
            float grade)
        {
            this.UserID = userID;
            this.Date = date;
            this.Grade = grade;
        }
    }
}
