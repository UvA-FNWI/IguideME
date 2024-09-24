using System.Collections.Generic;
using Newtonsoft.Json;

namespace IguideME.Web.Models.App
{
    public enum Notification_Types
    {
        outperforming,
        closing_gap,
        falling_behind,
        more_effort
    }

    public class Notification
    {
        [JsonProperty("userID")]
        public string UserID { get; set; }

        [JsonProperty("tile_id")]
        public int TileID { get; set; }

        [JsonProperty("status")]
        public Notification_Types Status { get; set; }

        [JsonProperty("sent")]
        public bool Sent { get; set; }

        public Notification(string userID, int tileID, int status, bool sent)
        {
            this.UserID = userID;
            this.TileID = tileID;
            this.Status = (Notification_Types) status;
            this.Sent = sent;
        }
         public Notification(string userID, int tileID, Notification_Types status, bool sent)
        {
            this.UserID = userID;
            this.TileID = tileID;
            this.Status = status;
            this.Sent = sent;
        }
   }

    public class Notifications
    {
        [JsonProperty("outperforming")]
        public List<Notification> Outperforming { get; set; }

        [JsonProperty("closing")]
        public List<Notification> Closing { get; set; }

        [JsonProperty("falling")]
        public List<Notification> Falling { get; set; }

        [JsonProperty("effort")]
        public List<Notification> Effort { get; set; }

        public Notifications()
        {
            this.Outperforming = new();
            this.Closing = new();
            this.Falling = new();
            this.Effort = new();
        }
    }

    public class NotificationDetail
    {
        [JsonProperty("tile_title")]
        public string TileTitle { get; set; }

        [JsonProperty("status")]
        public int Status { get; set; }

        [JsonProperty("sent")]
        public bool Sent { get; set; }
    }

    public class CourseNotification
    {
        [JsonProperty("tile_title")]
        public string TileTitle { get; set; }

        [JsonProperty("status")]
        public int Status { get; set; }

        [JsonProperty("sent")]
        public long? Sent { get; set; }
    }
}
