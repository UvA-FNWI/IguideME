using Newtonsoft.Json;

namespace IguideME.Web.Models.App
{
    public class PeerGroup
    {
        [JsonProperty("min_size")]
        public int MinSize { get; set; }

        [JsonProperty("personalized_peers")]
        public bool PersonalizedPeers { get; set; }

        public PeerGroup(
            int minSize,
            bool personalizedPeers)
        {
            this.MinSize = minSize;
            this.PersonalizedPeers = personalizedPeers;
        }
    }
}
