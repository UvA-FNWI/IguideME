using Newtonsoft.Json;

namespace IguideME.Web.Models.App
{
    public class PeerGroup
    {
        [JsonProperty("min_size")]
        public int MinSize { get; set; }

        public PeerGroup(
            int minSize
            )
        {
            this.MinSize = minSize;
        }
    }
}
