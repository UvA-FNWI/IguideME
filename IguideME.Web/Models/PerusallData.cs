using Newtonsoft.Json;

namespace IguideME.Web.Models
{
    public class PerusallData
    {
        [JsonProperty(PropertyName = "course_id")]
        public int CourseID { get; set; }

        [JsonProperty(PropertyName = "user_login_id")]
        public string UserLoginID { get; set; }

        [JsonProperty(PropertyName = "grade")]
        public float Grade { get; set; }

        [JsonProperty(PropertyName = "entry")]
        public string Entry { get; set; }

        public string GroupID { get; set; }

        public PerusallData(int courseID, string userLoginID, float grade, string entry, string groupID)
        {
            this.CourseID = courseID;
            this.UserLoginID = userLoginID;
            this.Grade = grade;
            this.Entry = entry;
            this.GroupID = groupID;
        }
    }
}
