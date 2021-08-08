﻿
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

        [JsonIgnore]
        public int UserID { get; set; }

        [JsonProperty("login_id")]
        public string LoginID { get; set; }

        [JsonProperty("sis_user_id")]
        public string SisID { get; set; }

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
            int userID,
            string loginID,
            string sisID,
            string name,
            string sortableName,
            string role,
            string hash = null)
        {
            this.ID = id;
            this.CourseID = courseID;
            this.UserID = userID;
            this.LoginID = loginID;
            this.SisID = sisID;
            this.Name = name;
            this.SortableName = sortableName;
            this.Role = role;
            this.Hash = hash;
        }


    }
}
