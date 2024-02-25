using System.Collections.Generic;
using System.Linq;

using IguideME.Web.Models;
using IguideME.Web.Models.App;
using IguideME.Web.Models.Impl;

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

    public enum Notification_Types
    {
        outperforming,
        closing_gap,
        falling_behind,
        more_effort
    }

    /// <summary>
    /// Class <a>PeerGroupWorker</a> models a worker that handles the creation of peer groups and their stats.
    /// </summary>
    ///
    public class PeerGroupWorker : IWorker
    {
        readonly private ILogger<SyncManager> _logger;
        private readonly DatabaseManager _databaseManager;
        readonly private int _courseID;
        readonly private long _syncID;

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
            ILogger<SyncManager> logger)
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
            CreatePeerGroupsForCourse();

            // TODO: Lets move this to the notification worker as it's not part of the same loop now anyway.
            this._logger.LogInformation("Creating performance notifications");
            // CreateNotifications();
        }

        /// <summary>
        /// Creates an array of lists of users, where the array is indexed by the goal grade of the users.
        /// </summary>
        /// <returns>A list of users per goal grade.</returns>
        List<string>[] GetUsersGroupedByGoalGrade()
        {
            List<string>[] usersWithSameGoalGrade = new List<string>[11];

            for (int goalGradeClass = 1; goalGradeClass <= 10; goalGradeClass++)
            {
                usersWithSameGoalGrade[goalGradeClass] = new List<string>();
                
                List<User> sameGraders = _databaseManager.GetUsersWithGoalGrade(this._courseID, goalGradeClass, this._syncID);
                sameGraders.ForEach(x => usersWithSameGoalGrade[goalGradeClass].Add(x.UserID));
            }

            return usersWithSameGoalGrade;
        }

        /// <summary>
        /// Create the peer groups for a given goal grade.
        /// </summary>
        /// <param name="groupedUsers">An array of lists of users indexed by their goal grades.</param>
        /// <param name="goalGrade">The goal grade to create a peer group for.</param>
        /// <param name="minPeerGroupSize">The minimum group size a peer group needs to have.</param>
        /// <returns></returns>
        static List<string> CreatePeerGroup(List<string>[] groupedUsers, int goalGrade, int minPeerGroupSize)
        {
            List<string> peerGroup = new(groupedUsers[goalGrade]);

            // if noone selected this goal grade, no point in creating the peer group
            if (peerGroup.Count() == 0)
                return new List<string>();

            // Look for peers until minimum size is reached or untill the offset exceeds the range of valid grades.
            for (int offset = 1; peerGroup.Count < minPeerGroupSize && offset < 10; offset++)
            {
                // Check if there are peers with higher grades.
                if (goalGrade + offset <= 10)
                {
                    // Fill with found peers
                    peerGroup.AddRange(groupedUsers[goalGrade + offset]);
                }

                // Check if no more peers are required
                if (peerGroup.Count >= minPeerGroupSize) break;

                // Check if there are peers with lower grades.
                if (goalGrade - offset >= 1)
                {
                    // Fill with found peers
                    peerGroup.AddRange(groupedUsers[goalGrade - offset]);
                }
            }
            return peerGroup;
        }

        /// <summary>
        /// Create  all the peer groups for the course.
        /// </summary>
        void CreatePeerGroupsForCourse()
        {
            // We find all students of the course and classify them according to their goal grade
            List<string>[] groupedUsers = this.GetUsersGroupedByGoalGrade();

            int minPeerGroupSize = _databaseManager.GetMinimumPeerGroupSize(this._courseID);
            List<Tile> tiles = _databaseManager.GetTiles(_courseID, true);

            // We create the peer groups for each goal grade classification
            for (int goalGradeClass = 1; goalGradeClass <= 10; goalGradeClass++)
            {

                // We initiallize the peer group by filling it with the users of the same goal grade
                List<string> peerGroup = CreatePeerGroup(groupedUsers, goalGradeClass, minPeerGroupSize);

                // If noone is this peerGroup, we skip the calculations
                if (peerGroup.Count() == 0) {
                    this._logger.LogInformation("No students in Peer Group: {goalgrade}. Skipping...", goalGradeClass);
                    continue;
                }
                this._logger.LogInformation("Creating Peer Group: {goalgrade}", goalGradeClass);

                Dictionary<int, List<double>> peerAssignmentDict = new();
                Dictionary<int, List<double>> peerTileDict = new();
                List<double> peerTotalAvg = new();

                foreach (string peerID in peerGroup) {
                    Dictionary<int, double> userAssignmentGrades = _databaseManager.GetUserAssignmentGrades(_courseID, peerID);
                    double userTotal = 0;
                    
                    foreach (Tile tile in tiles) {
                        double userTileGrade = 0;


                        // TODO: change the checks for weight = 0. Maybe we want an ungraded assignment. What happens then?
                        // We get the user's submissions one by one (if they exists in their gradelist)
                        foreach (TileEntry entry in tile.Entries) {
                            double singleEntryGrade = userAssignmentGrades.ContainsKey(entry.ContentID) 
                                                    ? userAssignmentGrades[entry.ContentID]
                                                    : 0d;
                            // and by summing them (multiplying by weight) we get the total of the user's Tile Grade
                            userTileGrade += singleEntryGrade * (entry.Weight==0.0f
                                                                ? (1.0 / (float) tile.Entries.Count)
                                                                : entry.Weight);

                            // Also, we store the grade of each submission to a List of the Assignment Dictionary, accross all users of the same peergroup
                            if (!peerAssignmentDict.ContainsKey(entry.ContentID))
                                peerAssignmentDict[entry.ContentID] = new ();
                            peerAssignmentDict[entry.ContentID].Add(singleEntryGrade);
                            // peerAssignmentDict[entry.ContentID] =  peerAssignmentDict[entry.ContentID] < grade ? grade : peerAssignmentDict[entry.ContentID];
                           
                        }
                        // After we're done with all entries of that tile, we register the Tile Grade for this peer
                        _databaseManager.CreateTileGradeForUser(peerID, tile.ID, userTileGrade, _syncID);
                        
                        // And then we add this to the Tile Dictionary (again accross peers)
                        if (!peerTileDict.ContainsKey(tile.ID))
                            peerTileDict[tile.ID] = new();
                        peerTileDict[tile.ID].Add(userTileGrade);

                        // FInaly we add to the user's total grade
                        userTotal += userTileGrade * (tile.Weight == 0.0f
                                                     ? (1.0 / tiles.Count)
                                                     : tile.Weight);
                    }

                    // Store the user's Total grade and add this to the list of all grades across the peergroup (peerTotalAvg)
                    _databaseManager.UpdateUserTotalGrade(_courseID, peerID, userTotal, _syncID);
                    peerTotalAvg.Add(userTotal);
                }

                // Finally, since we went through all peers of the current peer group, we store all the gathered values
                foreach (KeyValuePair<int, List<double>> assignment in peerAssignmentDict)
                    _databaseManager.CreateUserPeer(
                        goalGradeClass,
                        peerGroup,
                        assignment.Key,
                        assignment.Value.Average(),
                        assignment.Value.Min(),
                        assignment.Value.Max(),
                        (int)Comparison_Component_Types.assignment,
                        _syncID
                    );

                foreach (KeyValuePair<int, List<double>> tile in peerTileDict)
                    _databaseManager.CreateUserPeer(
                        goalGradeClass,
                        peerGroup,
                        tile.Key,
                        tile.Value.Average(),
                        tile.Value.Min(),
                        tile.Value.Max(),
                        (int)Comparison_Component_Types.tile,
                        _syncID
                    );

                _databaseManager.CreateUserPeer(
                    goalGradeClass,
                    peerGroup,
                    0, /// 0 means that we don't compare for assignment/tile/etc., but total average
                    peerTotalAvg.Average(),
                    peerTotalAvg.Min(),
                    peerTotalAvg.Max(),
                    (int)Comparison_Component_Types.total,
                    _syncID
                );
                
                // Finally, we can create the notifications in the DB for that peer group
                CreateNotifications(groupedUsers[goalGradeClass], peerAssignmentDict);
            }
        }


        void CreateNotifications(List<string> users, Dictionary<int, List<double>> grades)
        {
            this._logger.LogInformation("Creating Notifications for Peer Group");

            foreach (string user in users)
            {
                foreach (KeyValuePair<int, List<double>> entry in grades)
                {
                    // Get only tiles with notifications
                    if (_databaseManager.GetTileNotificationState(entry.Key))
                    {
                        List<AssignmentSubmission> userTileSubmissions = _databaseManager.GetTileSubmissionsForUser(entry.Key, user, this._syncID);

                        // Find the submission with the highest ID, as it is the most recent
                        int lastSubmissionID = -1;
                        foreach (AssignmentSubmission submission in userTileSubmissions)
                            if (submission.ID > lastSubmissionID)
                                lastSubmissionID = submission.ID;


                        // Create one list with all the submission grades and one more without the most recent submission
                        List<double> currentSubmissionGrades = new();
                        List<double> lastSubmissionGrades = new();
                        foreach (AssignmentSubmission submission in userTileSubmissions)
                        {
                            currentSubmissionGrades.Add(submission.Grade.Value);
                            if (submission.ID != lastSubmissionID)
                                lastSubmissionGrades.Add(submission.Grade.Value);
                        }

                        double currentAverage = -1;
                        double lastAverage = -1;
                        double peerAverage = -1;
                        // Store the three important Averages in variables
                        if (currentSubmissionGrades.Count != 0)
                            currentAverage = currentSubmissionGrades.Average();
                        if (lastSubmissionGrades.Count != 0)
                            lastAverage = lastSubmissionGrades.Average();
                        if (entry.Value != null)
                            peerAverage = entry.Value.Average();

                        if (currentAverage != -1 && peerAverage != 0)
                        {
                            if (currentAverage >= peerAverage) // +1)
                            {
                                // outperform
                                _databaseManager.RegisterNotification(
                                    this._courseID,
                                    user,
                                    entry.Key,
                                    (int)Notification_Types.outperforming,
                                    this._syncID
                                );
                            }
                            // else if (currentAverage >= peerAverage)
                            // {
                            //     // do nothing
                            // }
                            else if (currentAverage - lastAverage > 0)
                            {
                                // closing the gap
                                _databaseManager.RegisterNotification(
                                    this._courseID,
                                    user,
                                    entry.Key,
                                    (int)Notification_Types.closing_gap,
                                    this._syncID
                                );
                            }
                            else if ((currentAverage - lastAverage <= 0) && (peerAverage - currentAverage <= 1))
                            {
                                // falling behind
                                _databaseManager.RegisterNotification(
                                    this._courseID,
                                    user,
                                    entry.Key,
                                    (int)Notification_Types.falling_behind,
                                    this._syncID
                                );
                            }
                            else if ((currentAverage - lastAverage <= 0) && (peerAverage - currentAverage > 1))
                            {
                                // put more effort
                                _databaseManager.RegisterNotification(
                                    this._courseID,
                                    user,
                                    entry.Key,
                                    (int)Notification_Types.more_effort,
                                    this._syncID
                                );
                            }
                        }
                    }
                }
            }

        }

    }
}
