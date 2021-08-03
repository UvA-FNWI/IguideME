using System.Linq;
using System;
using Newtonsoft.Json;

namespace IguideME.Web.Models
{
    public class PeerComparisonData
    {
        [JsonProperty("tileID")]
        public int TileID { get; set; }

        [JsonProperty("min")]
        public Nullable<double> Minimum { get; set; }

        [JsonProperty("max")]
        public Nullable<double> Maximum { get; set; }

        [JsonProperty("avg")]
        public double Average { get; set; }

        public PeerComparisonData(
            int tileID,
            float avg,
            Nullable<float> min,
            Nullable<float> max)
        {
            this.TileID = tileID;
            this.Average = avg;
            this.Minimum = min;
            this.Maximum = max;
        }

        public static PeerComparisonData FromGrades(int tileID, float[] grades)
        {
            if (grades.Length == 0)
            {
                return new PeerComparisonData(
                    tileID, 0F, 0F, 0F);
            }
            else
            {
                return new PeerComparisonData(
                    tileID,
                    (float)Math.Round(grades.Min(), 1),
                    (float)Math.Round(grades.Max(), 1),
                    (float)Math.Round(grades.Average(), 1));
            }
        }
    }
}
