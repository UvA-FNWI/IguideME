using IguideME.Web.Services;
using Newtonsoft.Json;

namespace IguideME.Web.Models.App
{
    public class TileEntrySubmission
    {
        [JsonProperty(PropertyName = "id")]
        public int ID { get; set; }

        [JsonProperty(PropertyName = "userID")]
        public string UserID { get; set; }

        [JsonProperty(PropertyName = "entry_id")]
        public int EntryID { get; set; }

        [JsonProperty(PropertyName = "grade")]
        public string Grade { get; set; }

        [JsonProperty(PropertyName = "submitted")]
        public string Submitted { get; set; }

        [JsonProperty(PropertyName = "meta")]
        public string Meta { get; set; }

        public TileEntrySubmission(
            int id,
            int entryID,
            string userID,
            string grade,
            string submitted,
            string meta = null,
            bool autoLoadMeta = true,
            int syncID = 0)
        {
            this.ID = id;
            this.UserID = userID;
            this.EntryID = entryID;
            this.Grade = grade;
            this.Submitted = submitted;
            this.Meta = meta;

            if (autoLoadMeta && meta == null)
            {
                this.Meta = JsonConvert.SerializeObject(
                    DatabaseManager.Instance.GetEntryMeta(this.ID, syncID));
            }
        }
    }
}
