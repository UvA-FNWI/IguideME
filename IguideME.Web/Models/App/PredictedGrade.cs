using Newtonsoft.Json;

public class PredictedGrade
{
    [JsonIgnore]
    public string UserLoginID { get; set; }

    [JsonProperty("graded_components")]
    public int GradedComponents { get; set; }

    [JsonProperty("grade")]
    public float Grade { get; set; }

    public PredictedGrade(
        string userLoginID,
        int gradedComponents,
        float grade)
    {
        this.UserLoginID = userLoginID;
        this.GradedComponents = gradedComponents;
        this.Grade = grade;
    }
}
