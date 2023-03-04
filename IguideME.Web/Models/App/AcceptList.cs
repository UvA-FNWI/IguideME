using Newtonsoft.Json;

namespace IguideME.Web.Models.App
{
    public class AcceptList
    {
        [JsonProperty("userID")]
        public string UserID { get; set; }

        [JsonProperty("accepted")]
        public bool Accepted { get; set; }

        public AcceptList(
            string userID,
            bool accepted)
        {
            this.UserID = userID;
            this.Accepted = accepted;
        }
    }
}
