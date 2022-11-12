using Newtonsoft.Json;

namespace IguideME.Web.Models.App
{
    public class Notification
    {
        [JsonProperty("user_login_id")]
        public string UserLoginID { get; set; }

        [JsonProperty("tile_id")]
        public int TileID { get; set; }

        [JsonProperty("status")]
        public string Status { get; set; }

        [JsonProperty("sent")]
        public bool Sent { get; set; }

        public Notification(string userloginID, int tileID, string status, bool sent)
        {
            this.UserLoginID = userloginID;
            this.TileID = tileID;
            this.Status = status;
            this.Sent = sent;
        }
    }
}
