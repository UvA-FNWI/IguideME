using Newtonsoft.Json;

namespace IguideME.Web.Models
{
    public class PerusallData
    {
        [JsonProperty(PropertyName = "course_id")]
        public int CourseID { get; set; }

        [JsonProperty(PropertyName = "studentnaam")]
        public string UserName { get; set; }

        [JsonProperty(PropertyName = "grade")]
        public float Grade { get; set; }

        [JsonProperty(PropertyName = "entry")]
        public string Entry { get; set; }

        public string GroupID { get; set; }

        public PerusallData(int CourseID, string UserName, float Grade, string Entry, string GroupID)
        {
            this.CourseID = CourseID;
            this.UserName = UserName;
            this.Grade = Grade;
            this.Entry = Entry;
            this.GroupID = GroupID;
        }
    }
}
