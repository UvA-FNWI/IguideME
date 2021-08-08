using Newtonsoft.Json;

namespace IguideME.Web.Models.App
{
    public class Notification
    {
        [JsonProperty("tile_id")]
        public int TileID { get; set; }

        [JsonProperty("status")]
        public string Status { get; set; }

        public Notification(int tileID, string status)
        {
            this.TileID = tileID;
            this.Status = status;
        }
    }
}
