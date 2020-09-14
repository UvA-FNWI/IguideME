using System.Linq;
using System;

namespace IguideME.Web.Models
{
    public class PeerComparisonData
    {
        public double Minimum { get; set; }
        public double Maximum { get; set; }

        public double Average { get; set; }

        public PeerComparisonData(float[] grades)
        {
            this.Minimum = Math.Round(grades.Min(), 1);
            this.Maximum = Math.Round(grades.Max(), 1);
            this.Average = Math.Round(grades.Average(), 1);
        }
    }
}
