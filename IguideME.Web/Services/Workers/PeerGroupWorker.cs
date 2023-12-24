using System.Collections.Generic;
using System.Linq;

using IguideME.Web.Models;
using IguideME.Web.Models.App;
using IguideME.Web.Models.Impl;

using Microsoft.Extensions.Logging;

namespace IguideME.Web.Services.Workers
{

    public enum Comparison_Entity_Types
    {
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

        // /// <summary>
        // /// Calculate the minimum, average, and maximum for a peergroup for each entry (= assigment / discussion).
        // /// </summary>
        // /// <param name="peerGroup"></param>
        // /// <returns>A dictionary with the assignmentID/discussionID as key and the collecton of all students' grades as a list.</returns>
        // Dictionary<int, List<float>> CalculateGrades(List<string> peerGroup)
        // {
        //     Dictionary<int, List<float>> grades = new();

        //     // We run the following process for each individual peer in the group
        //     foreach (string peerID in peerGroup)
        //     {
        //         // We query all the grades of each peer
        //         Dictionary<int, List<float>> temp = _databaseManager.GetUserGrades(this._courseID, peerID);

        //         temp.ToList().ForEach(x =>
        //         {
        //             // And we merge the temporary dictionary with the grades dictionary
        //             if (!grades.TryGetValue(x.Key, out List<float> value))
        //                 grades[x.Key] = new List<float>(x.Value);
        //             else
        //                 x.Value.ForEach(y => grades[x.Key].Add(y));
        //         });
        //     }

        //     return grades;
        // }

        /// <summary>
        /// Create all the peer groups for the course.
        /// </summary>
        void CreatePeerGroupsForCourse()
        {
            // We find all students of the course and classify them according to their goal grade
            List<string>[] groupedUsers = this.GetUsersGroupedByGoalGrade();

            // // Then we create a dictionary with them and their list of Tile averages
            // Dictionary<string,List<float>> user_totals = new Dictionary<string, List<float>>();

            int minPeerGroupSize = _databaseManager.GetMinimumPeerGroupSize(this._courseID);

            // We create the peer groups for each goal grade classification
            for (int goalGradeClass = 1; goalGradeClass <= 10; goalGradeClass++)
            {

                // We initiallize the peer group by filling it with the users of the same goal grade
                List<string> peerGroup = CreatePeerGroup(groupedUsers, goalGradeClass, minPeerGroupSize);

                // Since we have the userIDs of all members in the peer-group,
                // we will find their grade in each assignment and make a list out of it
                // since we do not care about the ID of any specific student beyond this point
                List<Dictionary<int, float>> userGrades = new();
                List<Dictionary<int, float>> userDiscussions = new();
                // We run the following process for each individual peer in the group
                foreach (string peerID in peerGroup)
                {
                    // We query all the grades of each peer
                    userGrades.Add(_databaseManager.GetUserAssignmentGrades(this._courseID, peerID));

                    //and all Discussion counters
                    userDiscussions.Add(_databaseManager.GetUserDiscussionCounters(this._courseID, peerID));

                    // // and initialize their avg list
                    // user_totals[peerID] = new List<float>();
                }

                //Afterwards we get all Tiles of the course and with its corresponding entries
                List<Tile> tiles = _databaseManager.GetTiles(_courseID);
                foreach (Tile tile in tiles)
                {

                    // Retrieve the assignment IDs tied to the tile
                    List<int> tileContentIDs = new List<int>();

                    foreach (TileEntry tileEntry in tile.Entries)
                        tileContentIDs.Add(tileEntry.ContentID);

                    // Finally, we go through the list of all users and 
                    // from each dictionary (= all assignment submissions of the user) 
                    // we keep the ones belonging to the tile.
                    // So, we calculate and store the average of each user in a list.
                    List<float> averages = new List<float>();

                    if (tile.Type == Tile.Tile_type.assignments)
                    {
                        foreach (Dictionary<int, float> gradelist in userGrades)
                        {
                            float user_avg = 0f;
                            if ((gradelist != null) && gradelist.Any())
                                foreach (int assigmentId in tileContentIDs)
                                    // We multiply by the weight of the assignment
                                    user_avg += gradelist[assigmentId] * tile.Entries[assigmentId].Weight / 100 ;
                            if (tileContentIDs.Count != 0) {
                                averages.Add(user_avg / tileContentIDs.Count);
                                // user_totals[peerID].Add(user_avg / tileContentIDs.Count); 
                            }
                        }          
                    }
                    else if (tile.Type == Tile.Tile_type.discussions)
                    {
                        foreach (Dictionary<int, float> discussionCounter in userDiscussions)
                        {
                            float user_avg = 0f;
                            if ((discussionCounter != null) && discussionCounter.Any())
                                foreach (int discussionId in tileContentIDs)
                                    // We multiply by the weight of the assignment
                                    user_avg += discussionCounter[discussionId];
                            averages.Add(user_avg / tileContentIDs.Count);
                        }
                    }
                    else // if (tile.Type == Tile.Tile_type.learning_outcomes)
                    {
                        //TODO: to be implemented
                    }

                    // Afterwards, we save the min, max and avg in the DB table.
                    // also, we save the user_ids of the peers in said group
                    _databaseManager.CreateUserPeer(
                        goalGradeClass,
                        peerGroup,
                        tile.ID,
                        averages.Count > 0 ? averages.Average() : 0,
                        averages.Count > 0 ? averages.Min() : 0,
                        averages.Count > 0 ? averages.Max() : 0,
                        (int)Comparison_Entity_Types.tile,
                        _syncID
                    );


                }

                //////////////////////////////////////////////////////////////////////////////////////////////////////
                // After we are done with the tiles, we can calculate the averages of each individual assignment    //
                // since we do not care about grouping together the grades of each student anymore.                 //
                // So we can "disect" the Dictionaries and create a new one                                         //
                //////////////////////////////////////////////////////////////////////////////////////////////////////

                // This gives us a new dictionary, where the key is the assignment ID
                // and the value is a list of all grades received
                Dictionary<int, List<float>> assignmentGrades = new Dictionary<int, List<float>>();
                // We create it from the old dictionary
                foreach (Dictionary<int, float> gradelist in userGrades)
                {
                    foreach (KeyValuePair<int, float> entry in gradelist)
                    {

                        // If the assignment is not already in our dictionary, 
                        // we have to create an empty list in that key
                        if (assignmentGrades[entry.Key] == null)
                            assignmentGrades[entry.Key] = new List<float>();

                        // And then we add the current user's grade in the list
                        assignmentGrades[entry.Key].Add(entry.Value);
                    }
                }

                // After we created the new dictionary, we can store the results in the DB
                foreach (KeyValuePair<int, List<float>> entry in assignmentGrades)
                    _databaseManager.CreateUserPeer(
                        goalGradeClass,
                        peerGroup,
                        entry.Key,
                        entry.Value.Average(),
                        entry.Value.Min(),
                        entry.Value.Max(),
                        (int)Comparison_Entity_Types.assignment,
                        _syncID
                    );


                // Finally, we can create the notifications in the DB for that peer group
                CreateNotifications(groupedUsers[goalGradeClass], assignmentGrades);
            }
        }


        void CreateNotifications(List<string> users, Dictionary<int, List<float>> grades)
        {

            foreach (string user in users)
            {
                foreach (KeyValuePair<int, List<float>> entry in grades)
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
                        List<float> currentSubmissionGrades = new();
                        List<float> lastSubmissionGrades = new();
                        foreach (AssignmentSubmission submission in userTileSubmissions)
                        {
                            currentSubmissionGrades.Add(submission.Grade);
                            if (submission.ID != lastSubmissionID)
                                lastSubmissionGrades.Add(submission.Grade);
                        }

                        float currentAverage = -1;
                        float lastAverage = -1;
                        float peerAverage = -1;
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
