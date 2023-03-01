using Newtonsoft.Json;

namespace IguideME.Web.Models
{
    public class AttendanceData
    {
        [JsonProperty(PropertyName = "course_id")]
        public int CourseID { get; set; }

        [JsonProperty(PropertyName = "userID")]
        public string UserID { get; set; }

        [JsonProperty(PropertyName = "aanwezig")]
        public string Present { get; set; }

        public string GroupID { get; set; }

        public AttendanceData(int courseID, string userID, string present, string groupID)
        {
            this.CourseID = courseID;
            this.UserID = userID;
            this.Present = present;
            this.GroupID = groupID;
        }
    }
}
