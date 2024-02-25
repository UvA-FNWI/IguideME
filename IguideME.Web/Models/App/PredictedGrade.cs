using Newtonsoft.Json;

namespace IguideME.Web.Models.App
{
    public class PredictedGrade
    {
        [JsonIgnore]
        public string UserID { get; set; }

        [JsonProperty("date")]
        public long Date { get; set; }

        [JsonProperty("grade")]
        public double Grade { get; set; }

        public PredictedGrade(
            string userID,
            long date,
            double grade)
        {
            this.UserID = userID;
            this.Date = date;
            this.Grade = grade;
        }
    }
}
