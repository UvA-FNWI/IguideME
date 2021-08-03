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

        public AttendanceData(int CourseID, string UserLoginID, string Present, string GroupID)
        {
            this.CourseID = CourseID;
            this.UserLoginID = UserLoginID;
            this.Present = Present;
            this.GroupID = GroupID;
        }
    }
}
