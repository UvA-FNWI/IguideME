using System;
using System.Collections.Generic;
using IguideME.Web.Services;
using Newtonsoft.Json;

namespace IguideME.Web.Models
{
    public enum EditState {
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

        [JsonProperty(PropertyName = "order")]
        public int Order { get; set; }

        [JsonProperty(PropertyName = "type")]
        public Tile_type Type { get; set; }

        [JsonProperty(PropertyName = "visible")]
        public bool Visible { get; set; }

        [JsonProperty(PropertyName = "notifications")]
        public bool Notifications { get; set; }

        // [JsonProperty(PropertyName = "graph_view")]
        // public bool GraphView { get; set; }

        // [JsonProperty(PropertyName = "wildcard")]
        // public bool Wildcard { get; set; }

        [JsonIgnore]
        public List<TileEntry> Entries { get; set; }

        public Tile(
            int id,
            int groupID,
            string title,
            int order,
            Tile_type type,
            bool visible,
            bool notifications,
            // bool graphView,
            // bool wildcard,
            bool loadEntries = false)
        {
            this.ID = id;
            this.GroupID = groupID;
            this.Title = title;
            this.Order = order;
            this.Type = type;
            this.Visible = visible;
            this.Notifications = notifications;
            // this.GraphView = graphView;
            // this.Wildcard = wildcard;

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
        // [JsonProperty(PropertyName = "id")]
        // public int ID { get; set; }

        [JsonProperty(PropertyName = "state")]
        public EditState State { get; set; }

        [JsonProperty(PropertyName = "tile_id")]
        public int TileID { get; set; }

        // [JsonProperty(PropertyName = "title")]
        // public string Title { get; set; }

        [JsonProperty(PropertyName = "content_id")]
        public int ContentID { get; set; }

        // [JsonProperty(PropertyName = "type")]
        // public string Type { get; set; }

        // [JsonProperty(PropertyName = "wildcard")]
        // public bool Wildcard { get; set; }

        public TileEntry(
            // int id,
            EditState state,
            int tileID,
            int ContentID)
            // string title,
            // string type,
            // bool wildcard = false)
        {
            // this.ID = id;
            this.State = state;
            this.TileID = tileID;
            this.ContentID = ContentID;
            // this.Title = title;
            // this.Type = type;
            // this.Wildcard = wildcard;
        }
    }
}
