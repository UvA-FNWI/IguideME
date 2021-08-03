using System;
using IguideME.Web.Services;
using Newtonsoft.Json;

namespace IguideME.Web.Models.App
{
    public class PredictiveModel
    {
        [JsonProperty("id")]
        public int ID { get; set; }

        [JsonProperty("course_id")]
        public int CourseID { get; set; }

        [JsonProperty("entry_collection")]
        public string EntryCollection { get; set; }

        [JsonProperty("mse")]
        public float MSE { get; set; }

        [JsonProperty("theta")]
        public ModelTheta[] Theta { get; set; }

        public PredictiveModel(
            int id,
            int courseID,
            string entryCollection,
            float mse,
            ModelTheta[] theta,
            bool autoLoadThetas = false)
        {
            this.ID = id;
            this.CourseID = courseID;
            this.EntryCollection = entryCollection;
            this.MSE = mse;

            if (autoLoadThetas)
            {
                this.Theta = DatabaseManager.Instance
                    .GetModelThetas(id).ToArray();
            } else
            {
                this.Theta = theta;
            }
        }

        public void LoadThetas()
        {
            this.Theta = DatabaseManager.Instance
                    .GetModelThetas(this.ID).ToArray();
        }

        public PredictiveModelOverview ToOverview()
        {
            return new PredictiveModelOverview(
                this.ID, this.CourseID, this.EntryCollection, this.MSE);
        }
    }

    public class PredictiveModelOverview
    {
        [JsonProperty("id")]
        public int ID { get; set; }

        [JsonProperty("course_id")]
        public int CourseID { get; set; }

        [JsonProperty("entry_collection")]
        public string EntryCollection { get; set; }

        [JsonProperty("mse")]
        public float MSE { get; set; }

        public PredictiveModelOverview(
            int id,
            int courseID,
            string entryCollection,
            float mse)
        {
            this.ID = id;
            this.CourseID = courseID;
            this.EntryCollection = entryCollection;
            this.MSE = mse;
        }
    }

    public class ModelTheta
    {
        [JsonProperty("model_id")]
        public int ModelID { get; set; }

        [JsonProperty("tile_id")]
        public Nullable<int> TileID { get; set; }

        [JsonProperty("entry_id")]
        public Nullable<int> EntryID { get; set; }

        [JsonProperty("intercept")]
        public bool Intercept { get; set; }


        [JsonProperty("meta_key")]
        public string MetaKey { get; set; }

        [JsonProperty("value")]
        public float Value { get; set; }

        public ModelTheta(
            int modelID,
            Nullable<int> tileID,
            Nullable<int> entryID,
            bool intercept,
            string metaKey,
            float value)
        {
            this.ModelID = modelID;
            this.TileID = tileID;
            this.EntryID = entryID;
            this.Intercept = intercept;
            this.MetaKey = metaKey;
            this.Value = value;
        }
    }

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
}
