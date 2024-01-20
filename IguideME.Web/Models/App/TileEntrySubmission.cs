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

        public int AssignmentID { get; set; }
        public string rawGrade { get; set; }

        [JsonProperty(PropertyName = "entry_id")]
        public int EntryID { get; set; }

        [JsonProperty(PropertyName = "grade")]
        public double Grade { get; set; }

        [JsonProperty(PropertyName = "submitted")]
        public long Submitted { get; set; }

        [JsonProperty(PropertyName = "meta")]
        public string Meta { get; set; }

        public AssignmentSubmission(
            int id,
            int entryID,
            int AssignmentID,
            string userID,
            double grade,
            long submitted,
            string meta = null,
            bool autoLoadMeta = true,
            string hash = null)
        {
            this.ID = id;
            this.UserID = userID;
            this.EntryID = entryID;
            this.Grade = grade;
            this.Submitted = submitted;
            this.Meta = meta;
            this.AssignmentID = AssignmentID;

            if (autoLoadMeta && meta == null)
            {
                this.Meta = JsonConvert.SerializeObject(
                    DatabaseManager.Instance.GetEntryMeta(this.ID, hash));
            }
        }

        public AssignmentSubmission(
            int id,
            int entryID,
            int AssignmentID,
            string userID,
            string grade,
            long submitted,
            string meta = null,
            bool autoLoadMeta = true,
            string hash = null)
        {
            this.ID = id;
            this.UserID = userID;
            this.EntryID = entryID;
            this.rawGrade = grade;
            this.Submitted = submitted;
            this.Meta = meta;
            this.AssignmentID = AssignmentID;

            if (autoLoadMeta && meta == null)
            {
                this.Meta = JsonConvert.SerializeObject(
                    DatabaseManager.Instance.GetEntryMeta(this.ID, hash));
            }
        }
    }
}
