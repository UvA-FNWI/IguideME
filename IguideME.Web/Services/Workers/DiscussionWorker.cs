using System.Collections.Generic;
using UvA.DataNose.Connectors.Canvas;

namespace IguideME.Web.Services.Workers
{
	public class DiscussionWorker
	{

		private int CourseID { get; set; }
		private string Hash { get; set; }
		private CanvasTest CanvasTest { get; set; }

		public DiscussionWorker(int courseID, string hash, CanvasTest canvasTest)
		{
			this.CourseID = courseID;
			this.Hash = hash;
			this.CanvasTest = canvasTest;
		}

		public void Load()
		{
			List<Discussion> discussions = this.CanvasTest
				.GetDiscussions(this.CourseID);

			discussions.ForEach(d =>
					DatabaseManager.Instance.RegisterDiscussion(
						d.ID,
						this.CourseID,
						d.Title,
						d.UserName,
						d.PostedAt.ToString(),
						this.Hash)
				);
		}
	}
}
