using Newtonsoft.Json;

namespace IguideME.Web.Models
{
    public class AttendanceData
    {
        [JsonProperty(PropertyName = "course_id")]
        public int CourseID { get; set; }

        [JsonProperty(PropertyName = "user_login_id")]
        public string UserLoginID { get; set; }

        [JsonProperty(PropertyName = "aanwezig")]
        public string Present { get; set; }

        public string GroupID { get; set; }

        public AttendanceData(int courseID, string userLoginID, string present, string groupID)
        {
            this.CourseID = courseID;
            this.UserLoginID = userLoginID;
            this.Present = present;
            this.GroupID = groupID;
        }
    }
}
