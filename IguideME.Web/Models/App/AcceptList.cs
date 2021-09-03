using Newtonsoft.Json;

namespace IguideME.Web.Models.App
{
    public class AcceptList
    {
        [JsonProperty("student_login_id")]
        public string StudentLoginID { get; set; }

        [JsonProperty("accepted")]
        public bool Accepted { get; set; }

        public AcceptList(
            string studentLoginID,
            bool accepted)
        {
            this.StudentLoginID = studentLoginID;
            this.Accepted = accepted;
        }
    }
}
