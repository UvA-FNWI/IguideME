using System;
using System.Linq;
using IguideME.Web.Models;
using IguideME.Web.Models.Impl;
using System.Collections.Generic;
using Microsoft.Extensions.Logging;
using Canvas = UvA.DataNose.Connectors.Canvas;

namespace IguideME.Web.Services.Workers
{
	/// <summary>
    /// Class <a>DiscussionWorker</a> models a worker that handles registering discussions during a sync.
    /// </summary>
	public class DiscussionWorker
	{
        readonly private ILogger<SyncManager> _logger;
		readonly private CanvasHandler _canvasHandler;
		readonly private int _courseID;
		readonly private long _syncID;

		/// <summary>
        /// This constructor initializes the new DiscussionWorker to
        /// (<paramref name="courseID"/>, <paramref name="syncID"/>, <paramref name="canvasHandler"/>, <paramref name="logger"/>).
        /// </summary>
        /// <param name="courseID">the id of the course.</param>
        /// <param name="syncID">the hash code associated to the current sync.</param>
        /// <param name="canvasHandler">a reference to the class managing the connection with canvas.</param>
        /// <param name="logger">a reference to the logger used for the sync.</param>
		public DiscussionWorker(int courseID, long syncID, CanvasHandler canvasHandler, ILogger<SyncManager> logger)
		{
            _logger = logger;
			this._courseID = courseID;
			this._syncID = syncID;
			this._canvasHandler = canvasHandler;
		}

		/// <summary>
        /// Register the discussions in the database as discussions aren't necessarily linked to tiles.
        /// There are three types of discussiosn:
        /// <list type="bullet">
		///     <item>
		///     	Topics: the main discussion on canvas.
		///     </item>
        ///     <item>
		/// 		Entries: replies to a topic.
		/// 	</item>
        /// 	<item>
		/// 		Replies: replies to entries or replies.
		/// 	</item>
		/// </list>
        /// </summary>
        /// <param name="discussions">the discussions to register.</param>
        /// <param name="students">the students in the course, needed to convert user id's.</param>
		private void RegisterDiscusions(List<Canvas.Discussion> discussions, List<User> students) {

			foreach (Canvas.Discussion discussion in discussions)
            {
				DatabaseManager.getInstance().RegisterDiscussion(discussion, this._syncID);

				// Register the entries corresponding to the topic as well.
				foreach (Canvas.DiscussionEntry entry in discussion.Entries) {
                    int entry_id = DatabaseManager.getInstance().RegisterDiscussionEntry(
						entry,
						students?.Find(s => s.StudentNumber == entry.UserID)?.UserID);

					// Register the replies corresponding to the entry as well.
					foreach (Canvas.DiscussionReply reply in entry.Replies) {
                        DatabaseManager.getInstance().RegisterDiscussionReply(
							reply,
							entry_id,
							students?.Find(s => s.StudentNumber == reply.UserID)?.UserID);
					}
				}
			}
		}

		/// <summary>
        /// Link discussions to wild card tiles which are tiles that link to all the discussions instead
        /// of specifying specific discussions.
        /// </summary>
        /// <param name="discussions">a list of all the discussions.</param>
        /// <param name="students">a list of all the students.</param>
        /// <param name="tile">the tile that's a wild card.</param>
		private void HandleWildcardTile(List<Canvas.Discussion> discussions, List<User> students, Tile tile) {
			_logger.LogInformation("wildcard");

			// Filter out the discussions from students who did not give consent. TODO: is this how we want to handle this?
			IEnumerable<Canvas.Discussion> postedDiscussions = discussions
				.Where(d => {
					User student = students.Find(s => s.Name == d.UserName);
					return student != null && DatabaseManager.getInstance().GetConsent(this._courseID, student.UserID, GetHashCode()) > 0;
				});

			foreach (Canvas.Discussion discussion in postedDiscussions)
			{
				DatabaseManager.getInstance().UpdateDiscussion(discussion, tile.ID, this._syncID);

			}
		}

		/// <summary>
        /// Link discussions that are assigned to a tile to that tile.
        /// </summary>
        /// <param name="discussions">a list of all the discussions.</param>
        /// <param name="tile">the tile the discussions should link to.</param>
		private void HandleTile(List<Canvas.Discussion> discussions, Tile tile) {

			tile.GetEntries();

			foreach (Canvas.Discussion discussion in discussions) {
				foreach (TileEntry entry in tile.Entries) {
					if (discussion.ID == entry.ContentID) {
						DatabaseManager.getInstance().UpdateDiscussion(discussion, tile.ID, this._syncID);
					}
				}
			}
		}

		/// <summary>
        /// Link the discussions to the tiles they are assigned to by the instructor(s).
        /// </summary>
        /// <param name="discussions">a list of all the discussions.</param>
        /// <param name="students">a list of all the students.</param>
		private void LinkToTiles(List<Canvas.Discussion> discussions, List<User> students) {

			// Get all the discussion tiles.
			IEnumerable<Tile> tiles = DatabaseManager.getInstance().GetTiles(this._courseID)
				.Where(tile => tile.Type == Tile.Tile_type.discussions);

            foreach (Tile tile in tiles)
			{
				// if (tile.Wildcard)
				// {
                //     this.HandleWildcardTile(discussions, students, tile);
                // }
				// else
				// {
                    this.HandleTile(discussions, tile);
                // }
			}
		}

		/// <summary>
        /// Starts the disussion worker.
        /// </summary>
		public void Start()
		{

			_logger.LogInformation("Starting discussion registry...");

			List<User> students = DatabaseManager.getInstance().GetUsers(this._courseID, (int) UserRoles.student, this._syncID);
			List<Canvas.Discussion> discussions = this._canvasHandler.GetDiscussions(this._courseID);

            this.RegisterDiscusions(discussions, students);

            this.LinkToTiles(discussions, students);
        }
	}
}
