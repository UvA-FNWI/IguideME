using Newtonsoft.Json;

namespace IguideME.Web.Models
{
    public class PracticeSessionData
    {
        [JsonProperty(PropertyName = "course_id")]
        public int CourseID { get; set; }

        [JsonProperty(PropertyName = "userID")]
        public string UserID { get; set; }

        [JsonProperty(PropertyName = "grade")]
        public float Grade { get; set; }

        public string GroupID { get; set; }

        public PracticeSessionData(int courseID, string userID, float grade, string groupID)
        {
            this.CourseID = courseID;
            this.UserID = userID;
            this.Grade = grade;
            this.GroupID = groupID;
        }
    }
}
