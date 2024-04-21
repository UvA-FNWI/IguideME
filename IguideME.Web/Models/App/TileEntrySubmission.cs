using System.Collections.Generic;
using Newtonsoft.Json;

namespace IguideME.Web.Models.App
{
    public class AssignmentSubmission
    {
        [JsonProperty(PropertyName = "id")]
        public int ID { get; set; }

        [JsonProperty(PropertyName = "userID")]
        public string UserID { get; set; }

        [JsonProperty(PropertyName = "assignment_id")]
        public int AssignmentID { get; set; }

        public double? Grade { get; set; }
        public string RawGrade { get; set; }

        [JsonProperty(PropertyName = "grades")]
        public AssignmentGrades Grades { get; set; }

        [JsonProperty(PropertyName = "date")]
        public long Date { get; set; }

        [JsonProperty(PropertyName = "meta")]
        public Dictionary<string, string> Meta { get; set; }

        public AssignmentSubmission(
            int id,
            int assignmentID,
            string userID,
            string rawGrade,
            long date
        )
        {
            ID = id;
            UserID = userID;
            AssignmentID = assignmentID;
            RawGrade = rawGrade;
            Date = date;
        }

        public AssignmentSubmission(
            int id,
            int assignmentID,
            string userID,
            double grade,
            long date
        )
        {
            ID = id;
            UserID = userID;
            AssignmentID = assignmentID;
            Grade = grade;
            Date = date;
        }

        public AssignmentSubmission(
            int id,
            int assignmentID,
            string userID,
            AssignmentGrades grades,
            long date
        )
        {
            ID = id;
            UserID = userID;
            AssignmentID = assignmentID;
            Grades = grades;
            Date = date;
        }
    }

    public class AssignmentGrades
    {
        [JsonProperty(PropertyName = "grade ")]
        public double Grade { get; set; }

        [JsonProperty(PropertyName = "peerAvg ")]
        public double PeerAvg { get; set; }

        [JsonProperty(PropertyName = "peerMin ")]
        public double PeerMin { get; set; }

        [JsonProperty(PropertyName = "peerMax ")]
        public double PeerMax { get; set; }

        [JsonProperty(PropertyName = "max ")]
        public double Max { get; set; }

        [JsonProperty(PropertyName = "type ")]
        public AppGradingType Type { get; set; }

        public AssignmentGrades(
            double grade,
            double peerAvg,
            double peerMin,
            double peerMax,
            double max,
            AppGradingType type
        )
        {
            Grade = grade;
            PeerAvg = peerAvg;
            PeerMin = peerMin;
            PeerMax = peerMax;
            Max = max;
            Type = type;
        }

    }
}
