using System.Collections.Generic;

using Newtonsoft.Json;


namespace IguideME.Web.Models.App
{
    public class LearningGoal
    {
        [JsonProperty("id")]
        public int ID { get; set; }

        // [JsonProperty("tile_id")]
        // public int TileID { get; set; }

        [JsonProperty("title")]
        public string Title { get; set; }

        [JsonProperty("requirements")]
        public List<GoalRequirement> Requirements { get; set; }

        public LearningGoal(
            int id,
            // int tileID,
            string title)
        {
            this.ID = id;
            // this.TileID = tileID;
            this.Title = title;
            this.Requirements = new();
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

        // [JsonProperty("meta_key")]
        // public string MetaKey { get; set; }

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

        // public GoalRequirement(
        //     int id,
        //     int goalID,
        //     int assignmentID,
        //     LogicalExpressions expression,
        //     float value)
        // {
        //     this.ID = id;
        //     this.GoalID = goalID;
        //     this.AssignmentID = assignmentID;
        //     this.Value = value;
        //     this.Expression = expression;
        // }
    }
}
