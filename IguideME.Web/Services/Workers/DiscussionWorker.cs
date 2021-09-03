using System.Collections.Generic;
using System.Linq;
using IguideME.Web.Models;
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
			var tiles = DatabaseManager.Instance.GetTiles(this.CourseID);
			var students = DatabaseManager.Instance.GetUsers(this.CourseID, "student", this.Hash);

			List<Discussion> discussions = this.CanvasTest
				.GetDiscussions(this.CourseID);

			foreach (Tile tile in tiles.Where(t => t.TileType == "DISCUSSION"))
			{
				if (tile.Wildcard)
				{
					var postedDiscussions = discussions
					.Where(d =>
					{
						var student = students.Find(s => s.Name == d.UserName);
						if (student == null) return false;
						return DatabaseManager.Instance.GetConsent(this.CourseID, student.LoginID) != 1;

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
								d.Message,
								this.Hash);

					}
				}
				else
				{
					var entries = DatabaseManager.Instance.GetTileEntries(tile.ID);
					var targetDiscussions = discussions.Where(
						d => entries.Select(
							e => e.Title.ToLower()).Contains(d.Title.ToLower()));

					foreach (Discussion d in targetDiscussions)
					{
						foreach (var entry in d.Entries)
						{
							foreach (var reply in entry.Replies)
							{
								var student = students.Find(s => s.ID == reply.UserID);
								if (student == null) continue;

								DatabaseManager.Instance.RegisterDiscussion(
									d.ID,
									this.CourseID,
									tile.ID,
									d.Title,
									student.Name,
									reply.CreatedAt.ToString(),
									reply.Message,
									this.Hash);
							}
						}
					}
				}
			}
		}
	}
}
