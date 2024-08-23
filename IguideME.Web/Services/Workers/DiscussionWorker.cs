using System.Collections.Generic;
using System.Linq;
using IguideME.Web.Models;
using IguideME.Web.Models.App;
using IguideME.Web.Models.Impl;
using IguideME.Web.Services.LMSHandlers;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;

namespace IguideME.Web.Services.Workers
{
    /// <summary>
    /// Class <a>DiscussionWorker</a> models a worker that handles registering topics during a sync.
    /// </summary>
    public class DiscussionWorker : IWorker
    {
        private readonly ILogger<SyncManager> _logger;
        private readonly ILMSHandler _lmsHandler;
        private readonly DatabaseManager _databaseManager;

        private readonly int _courseID;
        private readonly long _syncID;

        /// <summary>
        /// This constructor initializes the new DiscussionWorker to
        /// (<paramref name="courseID"/>, <paramref name="syncID"/>, <paramref name="lmsHandler"/>, <paramref name="logger"/>).
        /// </summary>
        /// <param name="courseID">the id of the course.</param>
        /// <param name="syncID">the hash code associated to the current sync.</param>
        /// <param name="lmsHandler">a reference to the class managing the connection with the lms.</param>
        /// <param name="logger">a reference to the logger used for the sync.</param>
        public DiscussionWorker(
            int courseID,
            long syncID,
            ILMSHandler lmsHandler,
            DatabaseManager databaseManager,
            ILogger<SyncManager> logger
        )
        {
            _logger = logger;
            _courseID = courseID;
            _syncID = syncID;
            _lmsHandler = lmsHandler;
            _databaseManager = databaseManager;
        }

        /// <summary>
        /// Register the topics in the database as topics aren't necessarily linked to tiles.
        /// There are two types of discussiosn:
        /// <list type="bullet">
        ///     <item>
        ///     	Topics: the main discussion on the lms.
        ///     </item>
        ///     <item>
        /// 		Entries: replies to a topic or a reply.
        /// 	</item>
        /// </list>
        /// </summary>
        /// <param name="topics">the topics to register, they contain the entries.</param>
        /// <param name="students">the students in the course, needed to convert user id's.</param>
        private void RegisterDiscusions(IEnumerable<AppDiscussionTopic> topics, List<User> students)
        {
            foreach (AppDiscussionTopic discussion in topics)
            {
                foreach (AppDiscussionEntry entry in discussion.Entries)
                {
                    entry.Author = students
                        ?.Find(s => s.StudentNumber.ToString() == entry.Author)
                        ?.UserID;
                    _databaseManager.RegisterDiscussionEntry(entry);
                }
                _databaseManager.RegisterDiscussion(discussion, this._syncID);
            }
        }

        /// <summary>
        /// Starts the disussion worker.
        /// </summary>
        public void Start()
        {
            _logger.LogInformation("Starting discussion registry...");

            List<User> students = _databaseManager.GetUsers(
                this._courseID,
                (int)UserRoles.student,
                this._syncID
            );
            IEnumerable<AppDiscussionTopic> discussions = this._lmsHandler.GetDiscussions(
                this._courseID
            );

            this.RegisterDiscusions(discussions, students);
        }
    }
}
