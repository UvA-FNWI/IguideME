using Newtonsoft.Json;

namespace IguideME.Web.Models
{
    public class LayoutColumn
    {

        public enum ColumnSize {
            small,
            medium,
            large,
            full
        }
        [JsonProperty(PropertyName = "id")]
        public int ID { get; set; }

        [JsonProperty(PropertyName = "course_id")]
        public int CourseID { get; set; }

        [JsonProperty(PropertyName = "container_width")]
        public ColumnSize ContainerSize { get; set; }

        [JsonProperty(PropertyName = "position")]
        public int Position { get; set; }

        public LayoutColumn(int id, int courseID, int containerSize, int position)
        {
            this.ID = id;
            this.CourseID = courseID;
            this.ContainerSize = (ColumnSize) containerSize;
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
