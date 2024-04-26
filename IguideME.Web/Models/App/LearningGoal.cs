using System.Collections.Generic;

using Newtonsoft.Json;


namespace IguideME.Web.Models.App
{
    public class LearningGoal
    {
        [JsonProperty("id")]
        public int ID { get; set; }

        [JsonProperty("title")]
        public string Title { get; set; }

        [JsonProperty("requirements")]
        public List<GoalRequirement> Requirements { get; set; }

        [JsonProperty("results")]
        public List<bool> Results { get; set; }

        public LearningGoal(
            int id,
            string title)
        {
            this.ID = id;
            this.Title = title;
            this.Requirements = new();
            this.Results = new();
        }
    }

    public enum LogicalExpressions
    {
        Less,
        LessEqual,
        Equal,
        GreaterEqual,
        Greater,
        NotEqual
    }

    public class GoalRequirement
    {

        [JsonProperty("id")]
        public int ID { get; set; }

        [JsonProperty("goal_id")]
        public int GoalID { get; set; }

        [JsonProperty("assignment_id")]
        public int AssignmentID { get; set; }

        [JsonProperty("value")]
        public double Value { get; set; }

        [JsonProperty("expression")]
        public LogicalExpressions Expression { get; set; }

        public GoalRequirement(
            int id,
            int goalID,
            int assignmentID,
            int expression,
            double value)
        {
            this.ID = id;
            this.GoalID = goalID;
            this.AssignmentID = assignmentID;
            this.Value = value;
            this.Expression = (LogicalExpressions)expression;
        }
    }
}
