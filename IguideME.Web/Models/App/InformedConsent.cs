using Newtonsoft.Json;

namespace IguideME.Web.Models.App
{
    public class PublicInformedConsent
    {
        [JsonProperty("course_name")]
        public string CourseName { get; set; }

        [JsonProperty("require_consent")]
        public bool RequireConsent { get; set; }

        [JsonProperty("text")]
        public string Text { get; set; }

        [JsonProperty("accept_list")]
        public bool AcceptList { get; set; }

        public PublicInformedConsent(
            string courseName,
            bool requireConsent,
            string text = null,
            bool acceptList = false)
        {
            this.CourseName = courseName;
            this.RequireConsent = requireConsent;
            this.Text = text;
            this.AcceptList = acceptList;
        }
    }
}

