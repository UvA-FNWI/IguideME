using System.Linq;
using System;
using Newtonsoft.Json;

namespace IguideME.Web.Models
{
    public class PeerComparisonData
    {
        [JsonProperty("entityID")]
        public int EntityID { get; set; }

        [JsonProperty("min")]
        public Nullable<double> Minimum { get; set; }

        [JsonProperty("max")]
        public Nullable<double> Maximum { get; set; }

        [JsonProperty("avg")]
        public double Average { get; set; }

        public PeerComparisonData(
            int entityID,
            double avg,
            Nullable<double> min,
            Nullable<double> max)
        {
            this.EntityID = entityID;
            this.Average = avg;
            this.Minimum = min;
            this.Maximum = max;
        }

        public static PeerComparisonData FromGrades(int tileID, double[] grades)
        {
            return grades.Length == 0
                ? new PeerComparisonData(
                    tileID, 0F, 0F, 0F)
                : new PeerComparisonData(
                    tileID,
                    (double)Math.Round(grades.Min(), 1),
                    (double)Math.Round(grades.Max(), 1),
                    (double)Math.Round(grades.Average(), 1));
        }
    }
}
