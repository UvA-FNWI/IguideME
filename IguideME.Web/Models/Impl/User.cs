using IguideME.Web.Services;
using Newtonsoft.Json;

namespace IguideME.Web.Models.Impl
{
    public enum UserRoles
    {
        student,
        instructor
    }

    public class User
    {
        [JsonProperty("userID")]
        public string UserID { get; set; }

        [JsonProperty("course_id")]
        public int CourseID { get; set; }

        [JsonProperty("studentnumber")]
        public int StudentNumber { get; set; }

        [JsonProperty("name")]
        public string Name { get; set; }

        [JsonProperty("sortable_name")]
        public string SortableName { get; set; }

        [JsonProperty("role")]
        public UserRoles Role { get; set; }

        [JsonProperty("settings")]
        public UserSettings Settings { get; set; }

        public User(
            string userID,
            int courseID,
            int studentnumber,
            string name,
            string sortableName,
            int role
        )
        {
            this.CourseID = courseID;
            this.StudentNumber = studentnumber;
            this.UserID = userID;
            this.Name = name;
            this.SortableName = sortableName;
            this.Role = (UserRoles)role;
        }

        // public User(
        //     string userID,
        //     int courseID,
        //     int studentnumber,
        //     string name,
        //     string sortableName,
        //     int role,
        //     UserSettings settings
        // )
        // {
        //     this.CourseID = courseID;
        //     this.StudentNumber = studentnumber;
        //     this.UserID = userID;
        //     this.Name = name;
        //     this.SortableName = sortableName;
        //     this.Role = (UserRoles)role;
        //     this.Settings = settings;
        // }
    }

    public class UserSettings
    {
        [JsonProperty("goal_grade")]
        public int GoalGrade { get; set; }

        [JsonProperty("total_grade")]
        public double TotalGrade { get; set; }

        [JsonProperty("predicted_grade")]
        public double PredictedGrade { get; set; }

        [JsonProperty("consent")]
        public int Consent { get; set; }

        [JsonProperty("notifications")]
        public bool Notifications { get; set; }

        public UserSettings(
            int goalGrade,
            double totalGrade,
            double predictedGrade,
            int consent,
            bool notifications
        )
        {
            this.GoalGrade = goalGrade;
            this.TotalGrade = totalGrade;
            this.PredictedGrade = predictedGrade;
            this.Consent = consent;
            this.Notifications = notifications;
        }
    }
}
