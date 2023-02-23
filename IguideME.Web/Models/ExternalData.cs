using Newtonsoft.Json;

namespace IguideME.Web.Models
{
    public class ExternalData
    {
        [JsonProperty(PropertyName = "course_id")]
        public int CourseID { get; set; }

        [JsonProperty(PropertyName = "tile_id")]
        public int TileID { get; set; }

        [JsonProperty(PropertyName = "userID")]
        public string UserID { get; set; }

        [JsonProperty(PropertyName = "grade")]
        public string Grade { get; set; }

        [JsonProperty(PropertyName = "title")]
        public string Title { get; set; }

        public ExternalData(int courseID, string userID, int tileID, string title, string grade)
        {
            this.CourseID = courseID;
            this.UserID = userID;
            this.Grade = grade;
            this.Title = title;
            this.TileID = tileID;
        }
    }
}
