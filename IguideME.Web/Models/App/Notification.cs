using Newtonsoft.Json;

namespace IguideME.Web.Models.App
{
    public class Notification
    {
        [JsonProperty("userID")]
        public string UserID { get; set; }

        [JsonProperty("tile_id")]
        public int TileID { get; set; }

        [JsonProperty("status")]
        public string Status { get; set; }

        [JsonProperty("sent")]
        public bool Sent { get; set; }

        public Notification(string userID, int tileID, string status, bool sent)
        {
            this.UserID = userID;
            this.TileID = tileID;
            this.Status = status;
            this.Sent = sent;
        }
    }
}
