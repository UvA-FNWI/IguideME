using Newtonsoft.Json;

public class PredictedGrade
{
    [JsonIgnore]
    public string UserLoginID { get; set; }

    [JsonProperty("date")]
    public string Date { get; set; }

    [JsonProperty("grade")]
    public float Grade { get; set; }

    public PredictedGrade(
        string userLoginID,
        string date,
        float grade)
    {
        this.UserLoginID = userLoginID;
        this.Date = date;
        this.Grade = grade;
    }
}
