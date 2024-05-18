using Newtonsoft.Json;

namespace IguideME.Web.Models.App
{
    public enum ActionTypes
    {
        page,
        tile,
        tileView,
        theme,
        notifications,
        settingChange,
    }

    public class UserTracker
    {
        [JsonProperty("timestamp")]
        public long Timestamp { get; set; }

        [JsonProperty("user_id")]
        public string UserID { get; set; }

        [JsonProperty("action")]
        public ActionTypes Action { get; set; }

        [JsonProperty("action_detail")]
        public string ActionDetail { get; set; }

        [JsonProperty("session_id")]
        public int SessionID { get; set; }

        [JsonProperty("course_id")]
        public int CourseID { get; set; }

        public UserTracker(long timestamp, string userID, ActionTypes action, string actionDetail, int sessionID, int courseID)
        {
            Timestamp = timestamp;
            UserID = userID;
            Action = action;
            ActionDetail = actionDetail;
            SessionID = sessionID;
            CourseID = courseID;
        }
    }

    public class NewUserTrackerEntry
    {
        public string UserID { get; set; }
        public ActionTypes Action { get; set; }
        public string ActionDetail { get; set; }
        public int CourseID { get; set; }
    }
}