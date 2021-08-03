using Newtonsoft.Json;

namespace IguideME.Web.Models
{
    public class PracticeSessionData
    {
        [JsonProperty(PropertyName = "course_id")]
        public int CourseID { get; set; }

        [JsonProperty(PropertyName = "user_login_id")]
        public string UserLoginID { get; set; }

        [JsonProperty(PropertyName = "grade")]
        public float Grade { get; set; }

        public string GroupID { get; set; }

        public PracticeSessionData(int CourseID, string UserLoginID, float Grade, string GroupID)
        {
            this.CourseID = CourseID;
            this.UserLoginID = UserLoginID;
            this.Grade = Grade;
            this.GroupID = GroupID;
        }
    }
}
