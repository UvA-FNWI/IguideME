using System.Collections.Generic;
using IguideME.Web.Services;
using Newtonsoft.Json;


namespace IguideME.Web.Models.App
{
    public class LearningGoal
    {
        [JsonProperty("id")]
        public int ID { get; set; }

        [JsonProperty("tile_id")]
        public int TileID { get; set; }

        [JsonProperty("title")]
        public string Title { get; set; }

        [JsonProperty("requirements")]
        public List<GoalRequirement> Requirements { get; set; }

        public LearningGoal(
            int id,
            int tileID,
            string title,
            bool loadRequirements = true)
        {
            this.ID = id;
            this.TileID = tileID;
            this.Title = title;

            if (loadRequirements)
                this.FetchRequirements();
        }

        public void FetchRequirements()
        {
            this.Requirements = DatabaseManager.getInstance()
                        .GetGoalRequirements(this.ID);
        }

        public void DeleteGoalRequirements()
        {
            DatabaseManager.getInstance().DeleteGoalRequirements(this.ID);
            this.Requirements.Clear();
        }

        // public void DeleteGoalRequirement(int tileID)
        // {
        //     DatabaseManager.getInstance().DeleteGoalRequirement(this.ID, tileID);
        // }
    }

    public class GoalRequirement
    {

        public enum LogicalExpressions {
        Less_than,
        Less_equal,
        Equal,
        Greater_equal,
        Greater_than,
        Different_than
    }

        [JsonProperty("id")]
        public int ID { get; set; }

        [JsonProperty("state")]
        public EditState State { get; set; }

        [JsonProperty("goal_id")]
        public int GoalID { get; set; }

        [JsonProperty("tile_id")]
        public int TileID { get; set; }

        [JsonProperty("assignment_id")]
        public int AssignmentID { get; set; }

        // [JsonProperty("meta_key")]
        // public string MetaKey { get; set; }

        [JsonProperty("value")]
        public float Value { get; set; }

        [JsonProperty("expression")]
        public LogicalExpressions Expression { get; set; }

        public GoalRequirement(
            int id,
            EditState state,
            int goalID,
            int assignmentID,
            int expression,
            float value)
        {
            this.ID = id;
            this.State = state;
            this.GoalID = goalID;
            this.AssignmentID = assignmentID;
            this.Value = value;
            this.Expression = (LogicalExpressions) expression;
        }

        public GoalRequirement(
            int id,
            EditState state,
            int goalID,
            int assignmentID,
            LogicalExpressions expression,
            float value)
        {
            this.ID = id;
            this.State = state;
            this.GoalID = goalID;
            this.AssignmentID = assignmentID;
            this.Value = value;
            this.Expression = expression;
        }
    }
}