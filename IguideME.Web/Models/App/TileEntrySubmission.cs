using System.Collections.Generic;
using Newtonsoft.Json;
using Microsoft.Extensions.Logging;

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

        public void RawToGrade(AppGradingType type, double max)
        {
            ILoggerFactory factory = LoggerFactory.Create(builder => builder.AddConsole());
            ILogger _logger = factory.CreateLogger("TileEntrySubmission");
            switch (type)
            {
                case AppGradingType.Points:
                    this.Grade =
                        (
                            this.RawGrade != null
                                ? double.Parse(this.RawGrade)
                                : this.Grade
                        )
                        * 100
                        / max;
                    break;
                case AppGradingType.Percentage:
                    this.Grade =
                        this.RawGrade != null
                            ? double.Parse(this.RawGrade)
                            : this.Grade;
                    break;
                case AppGradingType.Letters:
                    this.Grade = LetterToGrade(this.RawGrade ?? "0");
                    break;
                case AppGradingType.PassFail:
                    _logger.LogInformation("passfail text: {Grade}", this.RawGrade);
                    this.Grade = this.RawGrade == "PASS" ? 100 : 0;
                    break;
                case AppGradingType.NotGraded:
                    this.Grade = -1;
                    break;
                default:
                    this.Grade = -1;
                    _logger.LogWarning(
                        "Grade format {Type} is not supported, thiss.Grade = {Grade}, treating as not graded...",
                        type,
                        this.RawGrade
                    );
                    break;
            }

        }

        /// <summary>
        /// Convert letter grading systems to our internal system of grades between 0 and 100.
        /// </summary>
        /// <param name="grade">the Grade as a letter that should be converted.</param>
        /// <returns>The Grade as a percentage.</returns>
        static private double LetterToGrade(string grade)
        {
            return grade switch
            {
                "A" => 100,
                "A-" => 93,
                "B+" => 89,
                "B" => 86,
                "B-" => 83,
                "C+" => 79,
                "C" => 76,
                "C-" => 73,
                "D+" => 69,
                "D" => 66,
                "D-" => 63,
                "F" => 60,
                _ => 0.00,
            };
        }
    }

    public class AssignmentGrades
    {
        [JsonProperty(PropertyName = "grade")]
        public double Grade { get; set; }

        [JsonProperty(PropertyName = "peerAvg")]
        public double PeerAvg { get; set; }

        [JsonProperty(PropertyName = "peerMin")]
        public double PeerMin { get; set; }

        [JsonProperty(PropertyName = "peerMax")]
        public double PeerMax { get; set; }

        [JsonProperty(PropertyName = "max")]
        public double Max { get; set; }

        [JsonProperty(PropertyName = "type")]
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
