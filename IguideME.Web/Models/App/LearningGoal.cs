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
            this.Requirements = DatabaseManager.Instance
                        .GetGoalRequirements(this.ID);
        }

        public void DeleteGoalRequirements()
        {
            DatabaseManager.Instance.DeleteGoalRequirements(this.ID);
            this.Requirements.Clear();
        }

        // public void DeleteGoalRequirement(int tileID)
        // {
        //     DatabaseManager.Instance.DeleteGoalRequirement(this.ID, tileID);
        // }
    }

    public class GoalRequirement
    {
        [JsonProperty("id")]
        public int ID { get; set; }

        [JsonProperty("state")]
        public editState State { get; set; }

        [JsonProperty("goal_id")]
        public int GoalID { get; set; }

        [JsonProperty("tile_id")]
        public int TileID { get; set; }

        [JsonProperty("entry_id")]
        public int EntryID { get; set; }

        [JsonProperty("meta_key")]
        public string MetaKey { get; set; }

        [JsonProperty("value")]
        public float Value { get; set; }

        [JsonProperty("expression")]
        public string Expression { get; set; }

        public GoalRequirement(
            int ID,
            editState state,
            int goalID,
            int tileID,
            int entryID,
            string metaKey,
            float value,
            string expression)
        {
            this.ID = ID;
            this.State = state;
            this.GoalID = goalID;
            this.TileID = tileID;
            this.EntryID = entryID;
            this.MetaKey = metaKey;
            this.Value = value;
            this.Expression = expression;
        }
    }
}