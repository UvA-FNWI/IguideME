using Newtonsoft.Json;

namespace IguideME.Web.Models
{
    public class AttendanceData
    {
        [JsonProperty(PropertyName = "course_id")]
        public int CourseID { get; set; }

        [JsonProperty(PropertyName = "studentnaam")]
        public string UserName { get; set; }

        [JsonProperty(PropertyName = "aanwezig")]
        public string Present { get; set; }

        public string GroupID { get; set; }

        public AttendanceData(int CourseID, string UserName, string Present, string GroupID)
        {
            this.CourseID = CourseID;
            this.UserName = UserName;
            this.Present = Present;
            this.GroupID = GroupID;
        }
    }
}
