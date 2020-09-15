using Newtonsoft.Json;

namespace IguideME.Web.Models
{
    public class PracticeSessionData
    {
        [JsonProperty(PropertyName = "course_id")]
        public int CourseID { get; set; }

        [JsonProperty(PropertyName = "studentnaam")]
        public string UserName { get; set; }

        [JsonProperty(PropertyName = "grade")]
        public float Grade { get; set; }

        public string GroupID { get; set; }

        public PracticeSessionData(int CourseID, string UserName, float Grade, string GroupID)
        {
            this.CourseID = CourseID;
            this.UserName = UserName;
            this.Grade = Grade;
            this.GroupID = GroupID;
        }
    }
}
