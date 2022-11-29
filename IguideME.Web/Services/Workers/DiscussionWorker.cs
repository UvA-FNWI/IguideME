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
			var tiles = DatabaseManager.Instance.GetTiles(this.CourseID);
			var students = DatabaseManager.Instance.GetUsers(this.CourseID, "student", this.Hash);

			List<Discussion> discussions = this.CanvasTest
				.GetDiscussions(this.CourseID);

			foreach (Tile tile in tiles)
			{
				if (tile.TileType != "DISCUSSIONS") {
					continue;
				}

				if (tile.Wildcard)
				{
					// TODO: how does a wildcard get created?
					_logger.LogInformation("wildcard");
					var postedDiscussions = discussions
					.Where(d =>
					{
						var student = students.Find(s => s.Name == d.UserName);
                        return student != null && DatabaseManager.Instance.GetConsent(this.CourseID, student.LoginID) == 1;
                    });

					foreach (Discussion d in postedDiscussions)
					{
						DatabaseManager.Instance.RegisterDiscussion(
								d.ID,
								this.CourseID,
								tile.ID,
								d.Title,
								d.UserName,
								d.PostedAt.ToString(),
								d.Message.Replace("'", "''"),
								this.Hash);

					}
				}
				else
				{
					tile.GetEntries();
					foreach (TileEntry entry in tile.Entries) {
						foreach (Discussion discussion in discussions) {
							if (discussion.Title.Equals(entry.Title, StringComparison.OrdinalIgnoreCase)) {
								DatabaseManager.Instance.RegisterDiscussion(
									discussion.ID,
									discussion.CourseID,
									tile.ID,
									discussion.Title,
									discussion.UserName,
									discussion.PostedAt.ToString(),
									discussion.Message.Replace("'", "''"),
									this.Hash
								);
							}
						}
					}
				}
			}
		}
	}
}
