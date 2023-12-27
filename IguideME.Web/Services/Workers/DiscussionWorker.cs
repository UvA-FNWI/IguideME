using System.Linq;
using IguideME.Web.Models;
using IguideME.Web.Models.Impl;
using System.Collections.Generic;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using IguideME.Web.Models.App;
using IguideME.Web.Services.LMSHandlers;

namespace IguideME.Web.Services.Workers
{
	/// <summary>
	/// Class <a>DiscussionWorker</a> models a worker that handles registering discussions during a sync.
	/// </summary>
	public class DiscussionWorker : IWorker
	{
		readonly private ILogger<SyncManager> _logger;
		readonly private ILMSHandler _canvasHandler;
		private readonly DatabaseManager _databaseManager;

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
		public DiscussionWorker (
			int courseID,
			long syncID,
			ILMSHandler canvasHandler,
			DatabaseManager databaseManager,
			ILogger<SyncManager> logger
		)
		{
			_logger = logger;
			_courseID = courseID;
			_syncID = syncID;
			_canvasHandler = canvasHandler;
			_databaseManager = databaseManager;
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
		private void RegisterDiscusions(IEnumerable<AppDiscussion> discussions, List<User> students)
		{

			foreach (AppDiscussion discussion in discussions)
			{
				switch (discussion.Type) {
					case Discussion_type.Topic:
						_databaseManager.RegisterDiscussion(discussion, this._syncID);
						break;
					case Discussion_type.Entry:
					case Discussion_type.Reply:
						discussion.Author = students?.Find(s => s.StudentNumber.ToString() == discussion.Author)?.UserID;
						_databaseManager.RegisterDiscussionReply(discussion);
						break;
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
		private void HandleWildcardTile(IEnumerable<AppDiscussion> discussions, List<User> students, Tile tile)
		{
			_logger.LogDebug("wildcard");

			// Filter out the discussions from students who did not give consent. TODO: is this how we want to handle this?
			IEnumerable<AppDiscussion> postedDiscussions = discussions
				.Where(d =>
				{
					User student = students.Find(s => s.Name == d.Author);
					return student != null && _databaseManager.GetUserConsent(this._courseID, student.UserID);
				});

			foreach (AppDiscussion discussion in postedDiscussions)
			{
				_databaseManager.UpdateDiscussion(discussion, tile.ID, this._syncID);

			}
		}

		/// <summary>
		/// Link discussions that are assigned to a tile to that tile.
		/// </summary>
		/// <param name="discussions">a list of all the discussions.</param>
		/// <param name="tile">the tile the discussions should link to.</param>
		private void HandleTile(IEnumerable<AppDiscussion> discussions, Tile tile)
		{

			if (tile.Entries.IsNullOrEmpty())
				tile.Entries = _databaseManager.GetTileEntries(tile.ID);

			foreach (AppDiscussion discussion in discussions)
			{
				foreach (TileEntry entry in tile.Entries)
				{
					if (discussion.ID == entry.ContentID)
					{
						_databaseManager.UpdateDiscussion(discussion, tile.ID, this._syncID);
					}
				}
			}
		}

		/// <summary>
		/// Link the discussions to the tiles they are assigned to by the instructor(s).
		/// </summary>
		/// <param name="discussions">a list of all the discussions.</param>
		/// <param name="students">a list of all the students.</param>
		private void LinkToTiles(IEnumerable<AppDiscussion> discussions, List<User> students)
		{

			// Get all the discussion tiles.
			IEnumerable<Tile> tiles = _databaseManager.GetTiles(this._courseID)
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

			List<User> students = _databaseManager.GetUsers(this._courseID, (int)UserRoles.student, this._syncID);
			IEnumerable<AppDiscussion> discussions = this._canvasHandler.GetDiscussions(this._courseID);

			this.RegisterDiscusions(discussions, students);

			this.LinkToTiles(discussions, students);
		}
	}
}
