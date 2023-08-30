﻿using System.Collections.Generic;

using Newtonsoft.Json;

namespace IguideME.Web.Models
{
    public class LayoutColumn
    {

        // public enum ColumnSize {
        //     small,
        //     medium,
        //     large,
        //     full
        // }
        [JsonProperty(PropertyName = "id")]
        public int ID { get; set; }

        [JsonProperty(PropertyName = "course_id")]
        public int CourseID { get; set; }

        [JsonProperty(PropertyName = "width")]
        public int ContainerSize { get; set; }

        [JsonProperty(PropertyName = "position")]
        public int Position { get; set; }

        [JsonProperty(PropertyName = "tile_groups")]
        public List<int> TileGroups { get; set; }

        public LayoutColumn(int id, int courseID, int containerSize, int position)
        {
            this.ID = id;
            this.CourseID = courseID;
            this.ContainerSize = containerSize;
            this.Position = position;

            // ask db to fill with this.TileGroups;
        }
    }

    public class LayoutTileGroup
    {
        [JsonProperty(PropertyName = "id")]
        public int ID { get; set; }

        [JsonProperty(PropertyName = "course_id")]
        public int CourseID { get; set; }

        [JsonProperty(PropertyName = "title")]
        public string Title { get; set; }

        [JsonProperty(PropertyName = "column_id")]
        public int ColumnID { get; set; }

        [JsonProperty(PropertyName = "position")]
        public int Position { get; set; }

        public LayoutTileGroup(
            int id,
            int courseID,
            string title,
            int columnID,
            int position)
        {
            this.ID = id;
            this.CourseID = courseID;
            this.Title = title;
            this.ColumnID = columnID;
            this.Position = position;
        }
    }
}
