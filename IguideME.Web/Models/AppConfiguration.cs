using Newtonsoft.Json;

namespace IguideME.Web.Models
{
    public class LayoutColumn
    {
        [JsonProperty(PropertyName = "id")]
        public int ID { get; set; }

        [JsonProperty(PropertyName = "course_id")]
        public int CourseID { get; set; }

        [JsonProperty(PropertyName = "container_width")]
        public string ContainerSize { get; set; }

        [JsonProperty(PropertyName = "position")]
        public int Position { get; set; }

        public LayoutColumn(int id, int courseID, string containerSize, int position)
        {
            this.ID = id;
            this.CourseID = courseID;
            this.ContainerSize = containerSize;
            this.Position = position;
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
