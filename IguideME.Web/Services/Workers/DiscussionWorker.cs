using System;
using System.Linq;
using IguideME.Web.Models;
using IguideME.Web.Models.Impl;
using System.Collections.Generic;
using Microsoft.Extensions.Logging;
using IguideME.Web.Services.LMSHandlers;
using IguideME.Web.Models.App;

namespace IguideME.Web.Services.Workers
{
    /// <summary>
    /// Class <a>DiscussionWorker</a> models a worker that handles registering discussions during a sync.
    /// </summary>
    public class DiscussionWorker
    {
        readonly private ILogger<SyncManager> _logger;
        readonly private ILMSHandler _lmsHandler;
        readonly private int _courseID;
        readonly private string _hashCode;

        /// <summary>
        /// This constructor initializes the new DiscussionWorker to
        /// (<paramref name="courseID"/>, <paramref name="hashCode"/>, <paramref name="lmsHandler"/>, <paramref name="logger"/>).
        /// </summary>
        /// <param name="courseID">the id of the course.</param>
        /// <param name="hashCode">the hash code associated to the current sync.</param>
        /// <param name="lmsHandler">a reference to the class managing the connection with canvas.</param>
        /// <param name="logger">a reference to the logger used for the sync.</param>
        public DiscussionWorker(int courseID, string hashCode, ILMSHandler lmsHandler, ILogger<SyncManager> logger)
        {
            _logger = logger;
            this._courseID = courseID;
            this._hashCode = hashCode;
            this._lmsHandler = lmsHandler;
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
                switch (discussion.Type)
                {
                    case Discussion_type.topic:
                        DatabaseManager.Instance.RegisterDiscussion(discussion, this._hashCode);
                        break;
                    case Discussion_type.entry:
                    case Discussion_type.reply:
                        discussion.PostedBy = students?.Find(s => s.StudentNumber.ToString() == discussion.PostedBy)?.UserID;
                        DatabaseManager.Instance.RegisterDiscussionReply(discussion);
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
            _logger.LogInformation("wildcard");

            // Filter out the discussions from students who did not give consent. TODO: is this how we want to handle this?
            IEnumerable<AppDiscussion> postedDiscussions = discussions
                .Where(d =>
                {
                    User student = students.Find(s => s.UserID == d.PostedBy);
                    return student != null && DatabaseManager.Instance.GetConsent(this._courseID, student.UserID) == 1;
                });

            foreach (AppDiscussion discussion in postedDiscussions)
            {
                DatabaseManager.Instance.UpdateDiscussion(discussion, tile.ID, this._hashCode);

            }
        }

        /// <summary>
        /// Link discussions that are assigned to a tile to that tile.
        /// </summary>
        /// <param name="discussions">a list of all the discussions.</param>
        /// <param name="tile">the tile the discussions should link to.</param>
        private void HandleTile(IEnumerable<AppDiscussion> discussions, Tile tile)
        {
            tile.GetEntries();

            foreach (AppDiscussion discussion in discussions)
            {
                foreach (TileEntry entry in tile.Entries)
                {
                    if (discussion.Title.Equals(entry.Title, StringComparison.OrdinalIgnoreCase))
                    {
                        DatabaseManager.Instance.UpdateDiscussion(discussion, tile.ID, this._hashCode);
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
            IEnumerable<Tile> tiles = DatabaseManager.Instance.GetTiles(this._courseID)
                .Where(tile => tile.TileType == "DISCUSSIONS");

            foreach (Tile tile in tiles)
            {
                if (tile.Wildcard)
                {
                    this.HandleWildcardTile(discussions, students, tile);
                }
                else
                {
                    this.HandleTile(discussions, tile);
                }
            }
        }

        /// <summary>
        /// Starts the disussion worker.
        /// </summary>
        public void Start()
        {

            _logger.LogInformation("Starting discussion registry...");

            List<User> students = DatabaseManager.Instance.GetUsers(this._courseID, hash: this._hashCode);
            IEnumerable<AppDiscussion> discussions = this._lmsHandler.GetDiscussions(this._courseID);

            this.RegisterDiscusions(discussions, students);

            this.LinkToTiles(discussions, students);
        }
    }
}
