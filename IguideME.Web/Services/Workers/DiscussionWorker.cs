using System;
using System.Collections.Generic;
using System.Linq;
using IguideME.Web.Models;
using Microsoft.Extensions.Logging;
using UvA.DataNose.Connectors.Canvas;

namespace IguideME.Web.Services.Workers
{
	public class DiscussionWorker
	{
        private readonly ILogger<SyncManager> _logger;
		private int CourseID { get; set; }
		private string Hash { get; set; }
		private CanvasTest CanvasTest { get; set; }

		public DiscussionWorker(int courseID, string hash, CanvasTest canvasTest, ILogger<SyncManager> logger)
		{
            _logger = logger;
			this.CourseID = courseID;
			this.Hash = hash;
			this.CanvasTest = canvasTest;
		}

		public void Load()
		{

			_logger.LogInformation("Starting discussion registry...");

			var tiles = DatabaseManager.Instance.GetTiles(this.CourseID);
			var students = DatabaseManager.Instance.GetUsers(this.CourseID, "student", this.Hash);

			List<Discussion> discussions = this.CanvasTest
				.GetDiscussions(this.CourseID);

			// Register the discussions first as not all discussions are linked to tiles.
			foreach (Discussion discussion in discussions)
            {
				DatabaseManager.Instance.RegisterDiscussion(discussion, this.Hash);

				foreach (DiscussionEntry entry in discussion.Entries) {
					int entry_id = DatabaseManager.Instance.RegisterDiscussionEntry(entry);

					foreach (DiscussionReply reply in entry.Replies) {
						DatabaseManager.Instance.RegisterDiscussionReply(reply, entry_id);
					}
				}
			}

			foreach (Tile tile in tiles)
			{

				if (tile.TileType != "DISCUSSIONS") {
					continue;
				}

				if (tile.Wildcard)
				{
					_logger.LogInformation("wildcard");
					var postedDiscussions = discussions
					.Where(d =>
					{
						var student = students.Find(s => s.Name == d.UserName);
                        return student != null && DatabaseManager.Instance.GetConsent(this.CourseID, student.UserID) == 1;
                    });

					foreach (Discussion discussion in postedDiscussions)
					{
						DatabaseManager.Instance.UpdateDiscussion(discussion, tile.ID, this.Hash);

					}
				}
				else
				{
					tile.GetEntries();
					foreach (Discussion discussion in discussions) {
						foreach (TileEntry entry in tile.Entries) {
							if (discussion.Title.Equals(entry.Title, StringComparison.OrdinalIgnoreCase)) {
								DatabaseManager.Instance.UpdateDiscussion(discussion, tile.ID, this.Hash);
							}
						}
					}
				}
			}
		}
	}
}
