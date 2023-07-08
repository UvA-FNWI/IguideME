using IguideME.Web.Services;
using Newtonsoft.Json;
using System.Collections.Generic;

namespace IguideME.Web.Models.App
{
    public class AssignmentSubmission
    {
        [JsonProperty(PropertyName = "id")]
        public int ID { get; set; }

        [JsonProperty(PropertyName = "userID")]
        public string UserID { get; set; }

        [JsonProperty(PropertyName = "assignment_id")]
        public int AssignmentID { get; set; }

        [JsonProperty(PropertyName = "grade")]
        public float Grade { get; set; }

        [JsonProperty(PropertyName = "date")]
        public long Date { get; set; }

        [JsonProperty(PropertyName = "meta")]
        public Dictionary<string, string> Meta { get; set; }

        public AssignmentSubmission(
            int id,
            int assignmentID,
            string userID,
            float grade,
            long date)
        {
            ID = id;
            UserID = userID;
            AssignmentID = assignmentID;
            Grade = grade;
            Date = date;
        }
    }
}
