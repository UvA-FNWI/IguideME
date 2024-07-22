using Newtonsoft.Json;

namespace IguideME.Web.Models.App
{

	public enum AppGradingType
	{
		PassFail,
		Percentage,
		Letters,
		Points,
		NotGraded
	}

	public class AppGrades
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

		public AppGrades(
			double grade,
			double peerMin,
			double peerAvg,
			double peerMax,
			double max,
			AppGradingType type
		)
		{
			Grade = grade;
			PeerMin = peerMin;
			PeerAvg = peerAvg;
			PeerMax = peerMax;
			Max = max;
			Type = type;
		}

	}
}
