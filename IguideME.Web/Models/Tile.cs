using System;
using System.Collections.Generic;
using IguideME.Web.Services;
using Newtonsoft.Json;

namespace IguideME.Web.Models
{
    public class Tile
    {
        public const string CONTENT_TYPE_BINARY = "BINARY";
        public const string CONTENT_TYPE_ENTRIES = "ENTRIES";
        public const string CONTENT_TYPE_PREDICTION = "PREDICTION";
        public const string CONTENT_TYPE_LEARNING_OUTCOMES = "LEARNING_OUTCOMES";

        public const string TYPE_ASSIGNMENTS = "ASSIGNMENTS";
        public const string TYPE_DISCUSSIONS = "DISCUSSIONS";
        public const string TYPE_EXTERNAL_DATA = "EXTERNAL_DATA";

        [JsonProperty(PropertyName = "id")]
        public int ID { get; private set; }

        [JsonProperty(PropertyName = "group_id")]
        public int GroupID { get; set; }

        [JsonProperty(PropertyName = "title")]
        public string Title { get; set; }

        [JsonProperty(PropertyName = "position")]
        public int Position { get; set; }

        [JsonProperty(PropertyName = "content")]
        public string ContentType { get; set; }

        [JsonProperty(PropertyName = "type")]
        public string TileType { get; set; }

        [JsonProperty(PropertyName = "visible")]
        public bool Visible { get; set; }

        [JsonProperty(PropertyName = "notifications")]
        public bool Notifications { get; set; }

        [JsonProperty(PropertyName = "graph_view")]
        public bool GraphView { get; set; }

        [JsonProperty(PropertyName = "wildcard")]
        public bool Wildcard { get; set; }

        [JsonIgnore]
        public List<TileEntry> Entries { get; set; }

        public Tile(
            int id,
            int groupID,
            string title,
            int position,
            string tileType,
            string contentType,
            bool visible,
            bool notifications,
            bool graphView,
            bool wildcard,
            bool loadEntries = false)
        {
            this.ID = id;
            this.GroupID = groupID;
            this.Title = title;
            this.Position = position;
            this.ContentType = contentType;
            this.TileType = tileType;
            this.Visible = visible;
            this.Notifications = notifications;
            this.GraphView = graphView;
            this.Wildcard = wildcard;

            if (loadEntries)
                this.Entries = DatabaseManager.Instance.GetTileEntries(this.ID);
        }

        public List<TileEntry> GetEntries()
        {
            if (this.Entries == null)
            {
                this.Entries = DatabaseManager.Instance.GetTileEntries(this.ID);
                return this.Entries;
            }

            return this.Entries;
        }
    }

    public class TileEntry
    {
        [JsonProperty(PropertyName = "id")]
        public int ID { get; set; }

        [JsonProperty(PropertyName = "tile_id")]
        public int TileID { get; set; }

        [JsonProperty(PropertyName = "title")]
        public string Title { get; set; }

        [JsonProperty(PropertyName = "type")]
        public string Type { get; set; }

        [JsonProperty(PropertyName = "wildcard")]
        public bool Wildcard { get; set; }

        public TileEntry(
            int id,
            int tileID,
            string title,
            string type,
            bool wildcard = false)
        {
            this.ID = id;
            this.TileID = tileID;
            this.Title = title;
            this.Type = type;
            this.Wildcard = wildcard;
        }
    }
}
