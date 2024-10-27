using System.Collections.Generic;
using System.Linq;
using IguideME.Web.Models;
using IguideME.Web.Models.App;
using Microsoft.Extensions.Logging;

namespace IguideME.Web.Services.Workers
{
    public enum Comparison_Component_Types
    {
        total,
        tile,
        assignment,
        discussion,
        learning_goal
    }

    /// <summary>
    /// Class <a>PeerGroupWorker</a> models a worker that handles the creation of peer groups and their stats.
    /// </summary>
    ///
    public class PeerGroupWorker : IWorker
    {
        private readonly ILogger<SyncManager> _logger;
        private readonly DatabaseManager _databaseManager;
        private readonly int _courseID;
        private readonly long _syncID;
        private Dictionary<int, List<double>> peerEntryGradesMap;
        private Dictionary<int, List<double>> peerTileGradesMap;
        private List<double> peerTotalGrades;

        /// <summary>
        /// This constructor initializes the new PeerGroupWorker to
        /// (<paramref name="courseID"/>, <paramref name="hashCode"/>, <paramref name="logger"/>).
        /// </summary>
        /// <param name="courseID">the id of the course.</param>
        /// <param name="syncID">the hash code associated to the current sync.</param>
        /// <param name="logger">a reference to the logger used for the sync.</param>
        public PeerGroupWorker(
            int courseID,
            long syncID,
            DatabaseManager databaseManager,
            ILogger<SyncManager> logger
        )
        {
            _logger = logger;
            _courseID = courseID;
            _syncID = syncID;
            _databaseManager = databaseManager;
        }

        /// <summary>
        /// Starts the peer group worker.
        /// </summary>
        public void Start()
        {
            this._logger.LogInformation("Creating peer groups");
            CreatePeerGroups();
        }

        /// <summary>
        /// Groups users into an array indexed by their goal Grade.
        /// </summary>
        /// <returns>An array of lists of userIDs.</returns>
        List<string>[] groupUsers()
        {
            List<string>[] groupedUsers = new List<string>[11];

            for (int goalGrade = 1; goalGrade <= 10; goalGrade++)
            {
                groupedUsers[goalGrade] = _databaseManager.GetUserIDsWithGoalGrade(
                    this._courseID,
                    goalGrade,
                    this._syncID
                );
            }

            return groupedUsers;
        }

        /// <summary>
        /// Create the peer groups for a given goal Grade.
        /// </summary>
        /// <param name="groupedUsers">An array of lists of users indexed by their goal grades.</param>
        /// <param name="goalGrade">The goal Grade to create a peer group for.</param>
        /// <param name="minPeerGroupSize">The minimum group size a peer group needs to have.</param>
        /// <returns>A list of userIDs in the group</returns>
        static List<string> CreatePeerGroup(
            List<string>[] groupedUsers,
            int goalGrade,
            int minPeerGroupSize
        )
        {
            List<string> peerGroup = new(groupedUsers[goalGrade]);

            // Skip if Grade hasn't been selected at all.
            if (peerGroup.Count() == 0)
                return new List<string>();

            // Look for peers until minimum size is reached or untill the offset exceeds the range of valid grades.
            for (int offset = 1; peerGroup.Count < minPeerGroupSize && offset < 10; offset++)
            {
                // Check upwards.
                if (goalGrade + offset <= 10)
                {
                    peerGroup.AddRange(groupedUsers[goalGrade + offset]);
                }

                // Exit if already satisfied.
                if (peerGroup.Count >= minPeerGroupSize)
                    break;

                // Check downwards.
                if (goalGrade - offset >= 1)
                {
                    peerGroup.AddRange(groupedUsers[goalGrade - offset]);
                }
            }
            return peerGroup;
        }

        /// <summary>
        /// Calculate the total Grade of a tile for a user.
        /// </summary>
        /// <param name="tile"> The tile to calculate the average for.</param>
        /// <param name="userID">The id of the user.</param>
        /// <param name="userEntryGradesMap">A dictionary mapping assignments to lists of grades for the total course Grade.</param>
        /// <returns>The Grade of the tile.</returns>
        double CalculateTileGrade(Tile tile, string userID, Dictionary<int, double> userEntryGradesMap)
        {
            double grade = tile.Type switch
            {
                TileType.assignments => CalculateAssignmentTileGrade(tile, userID, userEntryGradesMap),
                TileType.discussions => CalculateDiscussionTileGrade(tile, userID),
                TileType.learning_outcomes => CalculateLearningGoalTileGrade(tile, userID),
                _ => 0
            };

            _databaseManager.CreateTileGradeForUser(
                userID,
                tile.ID,
                grade,
                _syncID
            );

            return grade;

        }

        /// <summary>
        /// Calculate the total Grade of an assignment tile for a user.
        /// </summary>
        /// <param name="tile"> The tile to calculate the average for.</param>
        /// <param name="userID">The id of the user.</param>
        /// <param name="userEntryGradesMap">A dictionary mapping assignments to lists of grades for the total course Grade.</param>
        /// <returns>The Grade of the tile.</returns>
        double CalculateAssignmentTileGrade(Tile tile, string userID, Dictionary<int, double> userEntryGradesMap)
        {
            double tileGrade = 0;


            foreach (TileEntry entry in tile.Entries)
            {
                double entryGrade;
                if (userEntryGradesMap.TryGetValue(entry.ContentID, out entryGrade))
                {
                    tileGrade += entryGrade * entry.Weight;

                    // Store the entry Grade for the peer statistics.
                    if (peerEntryGradesMap.ContainsKey(entry.ContentID))
                        peerEntryGradesMap[entry.ContentID].Add(entryGrade);
                    else
                        peerEntryGradesMap[entry.ContentID] = new();
                }
            }

            return tileGrade;
        }

        /// <summary>
        /// Calculate the total Grade of a discussion tile for a user.
        /// </summary>
        /// <param name="tile"> The tile to calculate the average for.</param>
        /// <param name="userID">The id of the user.</param>
        /// <param name="userEntryGradesMap">A dictionary mapping assignments to lists of grades for the total course Grade.</param>
        /// <returns>The Grade of the tile.</returns>
        double CalculateDiscussionTileGrade(Tile tile, string userID)
        {
            double tileGrade = 0;

            // Alt for a discussion tile means to count all posts by the user instead of only specified.
            if (tile.Alt)
            {
                tileGrade = _databaseManager.GetDiscussionCountForUser(_courseID, userID);
            }
            else
            {
                foreach (TileEntry entry in tile.Entries)
                {
                    double entryGrade = _databaseManager.GetDiscussionCountForUserForEntry(entry.ContentID, userID);

                    tileGrade += entryGrade;

                    // Store the entry Grade for the peer statistics.
                    if (peerEntryGradesMap.ContainsKey(entry.ContentID))
                        peerEntryGradesMap[entry.ContentID].Add(entryGrade);
                    else
                        peerEntryGradesMap[entry.ContentID] = new();
                }
            }

            double max = _databaseManager.GetTileMax(tile.ID, _courseID).max;
            // _logger.LogWarning("tileGrade {tileGrade} max {max} tile {tile}", tileGrade, max, )

            return 100 * tileGrade / max;
        }

        /// <summary>
        /// Calculate the total Grade of a learning goal tile for a user.
        /// </summary>
        /// <param name="tile"> The tile to calculate the average for.</param>
        /// <param name="userID">The id of the user.</param>
        /// <param name="userEntryGradesMap">A dictionary mapping assignments to lists of grades for the total course Grade.</param>
        /// <returns>The Grade of the tile.</returns>
        double CalculateLearningGoalTileGrade(Tile tile, string userID)
        {
            double tileGrade = 0;
            List<LearningGoal> goals = _databaseManager.GetLearningGoalsForTile(tile.ID);
            foreach (LearningGoal goal in goals)
            {
                goal.Requirements = _databaseManager.GetGoalRequirements(goal.ID);
                foreach (GoalRequirement requirement in goal.Requirements)
                {
                    // goal.Results.Add(_databaseManager.GetGoalRequirementResult(requirement, userID));
                    if (_databaseManager.GetGoalRequirementResult(requirement, userID))
                    {
                        tileGrade++;
                    }
                }
            }
            double max = _databaseManager.GetTileMax(tile.ID, _courseID).max;
            return 100 * tileGrade / max;
        }

        /// <summary>
        /// Calculate the current overal Grade for the course for a user.
        /// </summary>
        /// <param name="tiles">A list of the tiles in the course.</param>
        /// <param name="userID">The id of the user.</param>
        /// <returns>The total Grade of the user.</returns>
        double CalculateUserTotalGrade(List<Tile> tiles, string userID)
        {
            List<(double grade, double weight)> validSubmissions = [];
            double unusedWeight = 0;

            Dictionary<int, double> userEntryGradesMap = _databaseManager.GetUserAssignmentGrades(_courseID, userID);

            foreach (Tile tile in tiles)
            {
                double userTileGrade = CalculateTileGrade(tile, userID, userEntryGradesMap);
                if (userTileGrade == 0 || double.IsNaN(userTileGrade))
                {
                    unusedWeight += tile.Weight;
                    continue;
                }

                validSubmissions.Add((userTileGrade, tile.Weight));

                // Store the tile Grade for the peer statistics.
                if (peerTileGradesMap.TryGetValue(tile.ID, out List<double> value))
                {
                    value.Add(userTileGrade);
                }
                else
                {
                    peerTileGradesMap[tile.ID] = [];
                }
            }

            // Spread the unused weight over the valid tiles.
            double userTotal = validSubmissions.Sum(tile => tile.grade * tile.weight);
            if (unusedWeight > 0)
            {
                double weight = unusedWeight / validSubmissions.Count;
                userTotal += validSubmissions.Sum(tile => tile.grade * weight);
            }

            // Make the grade a value between 0 and 10.
            if (double.IsNaN(userTotal))
            {
                userTotal = 0;
            }
            else if (userTotal > 0)
            {
                userTotal /= 10;
            }

            _databaseManager.UpdateUserSettings(
                _courseID,
                userID,
                null,
                null,
                userTotal,
                null,
                null,
                _syncID
            );

            return userTotal;

        }

        /// <summary>
        /// Stores the calculated peer statistics in the database
        /// </summary>
        /// <param name="goalGrade">the goal Grade of the current peergroup.</param>
        /// <param name="peerGroup">the users in the current peergroup.</param>
        void StorePeerStatistics(int goalGrade, List<string> peerGroup)
        {
            foreach ((int key, List<double> value) in peerEntryGradesMap)
                if (value.Count > 0)
                    _databaseManager.CreateUserPeer(
                        goalGrade,
                        peerGroup,
                        key,
                        value.Average(),
                        value.Min(),
                        value.Max(),
                        (int)Comparison_Component_Types.assignment,
                        _syncID
                    );

            foreach ((int key, List<double> value) in peerTileGradesMap)
                if (value.Count > 0)
                    _databaseManager.CreateUserPeer(
                        goalGrade,
                        peerGroup,
                        key,
                        value.Average(),
                        value.Min(),
                        value.Max(),
                        (int)Comparison_Component_Types.tile,
                        _syncID
                    );

            if (peerTotalGrades.Count > 0)
            {
                _databaseManager.CreateUserPeer(
                            goalGrade,
                            peerGroup,
                            0,
                            peerTotalGrades.Average(),
                            peerTotalGrades.Min(),
                            peerTotalGrades.Max(),
                            (int)Comparison_Component_Types.total,
                            _syncID
                        );
            }
        }

        /// <summary>
        /// Calculates the peer statiscs and average grades for the students in a peergroup.
        /// Both tile and total averages are calculated.
        /// </summary>
        /// <param name="peerGroup">the users in the current peergroup.</param>
        /// <param name="tiles">A list of the tiles in the course</param>
        void CalculateGrades(List<string> peerGroup, List<Tile> tiles)
        {
            this.peerEntryGradesMap = new();
            this.peerTileGradesMap = new();
            this.peerTotalGrades = new();

            foreach (string peerID in peerGroup)
            {
                double userTotal = CalculateUserTotalGrade(tiles, peerID);
                peerTotalGrades.Add(userTotal);
            }

        }

        /// <summary>
        /// Create  all the peer groups for the course.
        /// </summary>
        void CreatePeerGroups()
        {
            List<string>[] groupedUsers = this.groupUsers();
            int minGroupSize = _databaseManager.GetMinimumPeerGroupSize(this._courseID);
            List<Tile> tiles = _databaseManager.GetTiles(_courseID, true);

            for (int goalGrade = 1; goalGrade <= 10; goalGrade++)
            {
                this._logger.LogInformation("Creating Peer Group: {goalgrade}", goalGrade);
                List<string> peerGroup = CreatePeerGroup(
                    groupedUsers,
                    goalGrade,
                    minGroupSize
                );

                if (peerGroup.Count() == 0)
                {
                    this._logger.LogInformation("No students in Peer Group: {goalgrade}. Skipping...", goalGrade);
                    continue;
                }

                CalculateGrades(peerGroup, tiles);
                StorePeerStatistics(goalGrade, peerGroup);
                CreateNotifications(groupedUsers[goalGrade]);
            }
        }

        void CreateNotifications(List<string> users)
        {
            this._logger.LogInformation("Cleaning up old notifications");
            this._databaseManager.CleanupNotifications(this._courseID);
            this._logger.LogInformation("Creating Notifications for Peer Group");
            foreach (string user in users)
            {
                CreateNotificationsForUser(user);
            }
        }

        void CreateNotificationsForUser(string user)
        {
            _logger.LogInformation("Creating notification for user {}", user);
            foreach ((int tileID, List<double> peerGrades) in this.peerTileGradesMap)
            {
                // Get only tiles with notifications
                if (_databaseManager.GetTileNotificationState(tileID))
                {
                    CreateTileNotifications(user, tileID, peerGrades);
                }
            }
        }

        void CreateTileNotifications(string user, int tileID, List<double> peerGrades)
        {
            _logger.LogInformation("Handling tile {}", tileID);

            if (!peerGrades.Any())
            {
                _logger.LogInformation("No peer grades found");
                return;
            }

            List<AssignmentSubmission> submissions = _databaseManager.GetTileSubmissionsForUser(
                    tileID,
                    user,
                    this._syncID
            );

            if (!submissions.Any())
            {
                _logger.LogInformation("No submissions found.");
                return;
            }

            // Sort the submissions by their submission id. Since these are autoincrement this means that the most
            // recent addition will be last.
            submissions.Sort((A, B) => A.ID.CompareTo(B.ID));


            List<double> subGrades = submissions.Select(sub => sub.Grade).ToList();
            IEnumerable<double> oldSubmissions = subGrades.Take(submissions.Count - 1);

            // Average means tile grade.
            double currentAverage = subGrades.Average();
            double lastAverage = oldSubmissions.Any() ? oldSubmissions.Average() : -1;
            double peerAverage = peerGrades.Any() ? peerGrades.Average() : -1;

            // Outperforming
            if (currentAverage >= peerAverage)
            {
                _databaseManager.RegisterNotification(
                    this._courseID,
                    user,
                    tileID,
                    (int)Notification_Types.outperforming,
                    this._syncID
                );
            }
            // Closing the gap
            else if (currentAverage - lastAverage > 0)
            {
                _databaseManager.RegisterNotification(
                    this._courseID,
                    user,
                    tileID,
                    (int)Notification_Types.closing_gap,
                    this._syncID
                );
            }
            // Falling behind
            else if (
                (currentAverage - lastAverage <= 0)
                && (peerAverage - currentAverage <= 1)
            )
            {
                _databaseManager.RegisterNotification(
                    this._courseID,
                    user,
                    tileID,
                    (int)Notification_Types.falling_behind,
                    this._syncID
                );
            }
            // Have to put more effort
            else if (
                (currentAverage - lastAverage <= 0)
                && (peerAverage - currentAverage > 1)
            )
            {
                _databaseManager.RegisterNotification(
                    this._courseID,
                    user,
                    tileID,
                    (int)Notification_Types.more_effort,
                    this._syncID
                );
            }

        }
    }
}
