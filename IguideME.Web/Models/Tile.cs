using System;
using System.Collections.Generic;

using IguideME.Web.Models.App;
using IguideME.Web.Services;

using Newtonsoft.Json;

using UvA.DataNose.Connectors.Canvas;

namespace IguideME.Web.Models
{
    public enum EditState
    {
        Unchanged,
        New,
        Updated,
        Removed
    }
    public class Tile
    {

        public enum Tile_type
        {
            assignments,
            discussions,
            learning_outcomes
        }

        [JsonProperty(PropertyName = "id")]
        public int ID { get; private set; }

        [JsonProperty(PropertyName = "group_id")]
        public int GroupID { get; set; }

        [JsonProperty(PropertyName = "title")]
        public string Title { get; set; }

        [JsonProperty(PropertyName = "position")]
        public int Order { get; set; }

        [JsonProperty(PropertyName = "type")]
        public Tile_type Type { get; set; }

        [JsonProperty(PropertyName = "weight")]
        public float Weight { get; set; }

        [JsonProperty(PropertyName = "gradingType")]
        public GradingType GradingType { get; set; }

        [JsonProperty(PropertyName = "visible")]
        public bool Visible { get; set; }

        [JsonProperty(PropertyName = "notifications")]
        public bool Notifications { get; set; }

        [JsonProperty(PropertyName = "entries")]
        public List<TileEntry> Entries { get; set; }

        public Tile(
            int id,
            int groupID,
            string title,
            int order,
            Tile_type type,
            float weight,
            GradingType gradingType,
            bool visible,
            bool notifications)
        {
            this.ID = id;
            this.GroupID = groupID;
            this.Title = title;
            this.Order = order;
            this.Type = type;
            this.Weight = weight;
            this.GradingType = gradingType;
            this.Visible = visible;
            this.Notifications = notifications;
        }
    }

    public class TileEntry
    {
        // TODO: remove I think
        [JsonProperty(PropertyName = "state")]
        public EditState State { get; set; }

        [JsonProperty(PropertyName = "tile_id")]
        public int TileID { get; set; }

        [JsonProperty(PropertyName = "title")]
        public string Title { get; set; }

        [JsonProperty(PropertyName = "content_id")]
        public int ContentID { get; set; }

        [JsonProperty(PropertyName = "weight")]
        public float Weight { get; set; }

        public TileEntry(
            EditState state,
            int tileID,
            int ContentID,
            string title,
            float weight)
        {
            this.State = state;
            this.TileID = tileID;
            this.ContentID = ContentID;
            this.Title = title;
            this.Weight = weight;
        }
    }
}
