using IguideME.Web.Services;
using Newtonsoft.Json;

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
        public string Meta { get; set; }

        public AssignmentSubmission(
            int id,
            int assignmentID,
            string userID,
            float grade,
            long date,
            string meta = null)
            // bool autoLoadMeta = true,
            // int syncID = 0)
        {
            this.ID = id;
            this.UserID = userID;
            this.AssignmentID = assignmentID;
            this.Grade = grade;
            this.Date = date;
            this.Meta = meta;

            if (meta == null)
            {
                this.Meta = JsonConvert.SerializeObject(
                    DatabaseManager.Instance.GetEntryMeta(this.ID));
            }
        }
    }
}
