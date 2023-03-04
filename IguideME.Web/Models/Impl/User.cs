
using IguideME.Web.Services;
using Newtonsoft.Json;

namespace IguideME.Web.Models.Impl
{
    public class User
    {
        [JsonProperty("id")]
        public int ID { get; set; }

        [JsonProperty("course_id")]
        public int CourseID { get; set; }

        [JsonProperty("studentnumber")]
        public int StudentNumber { get; set; }

        [JsonProperty("userID")]
        public string UserID { get; set; }

        [JsonProperty("name")]
        public string Name { get; set; }

        [JsonProperty("sortable_name")]
        public string SortableName { get; set; }

        [JsonProperty("role")]
        public string Role { get; set; }

        [JsonIgnore]
        public string Hash { get; set; }

        public User(
            int id,
            int courseID,
            int studentnumber,
            string userID,
            string name,
            string sortableName,
            string role,
            string hash = null)
        {
            this.ID = id;
            this.CourseID = courseID;
            this.StudentNumber = studentnumber;
            this.UserID = userID;
            this.Name = name;
            this.SortableName = sortableName;
            this.Role = role;
            this.Hash = hash;
        }


    }
}

