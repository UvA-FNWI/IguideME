
using IguideME.Web.Services;
using Newtonsoft.Json;

namespace IguideME.Web.Models.Impl
{
    public enum UserRoles {
        student,
        instructor
    }

    public class User
    {
        // [JsonProperty("id")]
        // public int ID { get; set; }

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
        public UserRoles Role { get; set; }

        public User(
            // int id,
            string userID,
            int courseID,
            int studentnumber,
            string name,
            string sortableName,
            int role)
        {
            // this.ID = id;
            this.CourseID = courseID;
            this.StudentNumber = studentnumber;
            this.UserID = userID;
            this.Name = name;
            this.SortableName = sortableName;
            this.Role = (UserRoles) role;
        }


    }
}

