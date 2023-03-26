using System;
using System.Collections.Generic;
using System.Linq;
using IguideME.Web.Models;
using IguideME.Web.Models.Impl;
using Microsoft.Extensions.Logging;

namespace IguideME.Web.Services.Workers
{
    /// <summary>
    /// Class <a>PeerGroupWorker</a> models a worker that handles the creation of peer groups and their stats.
    /// </summary>
    ///
    public class PeerGroupWorker
    {
        readonly private ILogger<SyncManager> _logger;
        readonly private int _courseID;
        readonly private string _hashCode;

        /// <summary>
        /// This constructor initializes the new PeerGroupWorker to
        /// (<paramref name="courseID"/>, <paramref name="hashCode"/>, <paramref name="logger"/>).
        /// </summary>
        /// <param name="courseID">the id of the course.</param>
        /// <param name="hashCode">the hash code associated to the current sync.</param>
        /// <param name="logger">a reference to the logger used for the sync.</param>
        public PeerGroupWorker(
            int courseID,
            string hash,
            ILogger<SyncManager> logger)
        {
            _logger = logger;
            this._courseID = courseID;
            this._hashCode = hash;
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
            CreateNotifications();
        }


        // List<String> RetrievePeerGroupOfUser (int courseID, string loginID)
        // {
        //     // First we retrieve the user's goal grade
        //     int goalGrade = DatabaseManager.Instance.GetUserGoalGrade(courseID, loginID);

        //     // And then we query all the users that belong in this peer group
        //     List<String> peerGroup = DatabaseManager.Instance.GetPeersFromGroup(courseID, goalGrade, Hash);

        //     // Optionally, we remove themselves
        //     if (peerGroup.Any()) peerGroup.Remove(loginID);

        //     return peerGroup;
        // }

        /// <summary>
        /// Creates an array of lists of users, where the array is indexed by the goal grade of the users.
        /// </summary>
        /// <returns></returns>
        List<string>[] GetUsersSortedByGoalGrade() {
            List<string>[] usersWithSameGoalGrade = new List<string>[11];

            for (int goalGradeClass = 1; goalGradeClass <= 10; goalGradeClass++)
            {
                usersWithSameGoalGrade[goalGradeClass] = new List<string>();
                //TODO: get only those with consent!!!
                List<User> sameGraders = DatabaseManager.Instance.GetUsersWithGoalGrade(this._courseID,goalGradeClass, this._hashCode);
                sameGraders.ForEach(x => usersWithSameGoalGrade[goalGradeClass].Add(x.UserID));
            }

            return usersWithSameGoalGrade;
        }

        /// <summary>
        /// Create the peer groups for a given goal grade.
        /// </summary>
        /// <param name="sortedUsers">An array of lists of users indexed by their goal grades.</param>
        /// <param name="goalGrade">The goal grade to create a peer group for.</param>
        /// <param name="minPeerGroupSize">The minimum group size a peer group needs to have.</param>
        /// <returns></returns>
        static List<string> CreatePeerGroup(List<string>[] sortedUsers, int goalGrade, int minPeerGroupSize) {
            List<string> peerGroup = new(sortedUsers[goalGrade]);

            for (int offset = 1; peerGroup.Count < minPeerGroupSize && offset < 10; offset++)
            {
                // Check if there are valid upward peers
                if (goalGrade + offset <= 10)
                {
                    // Fill with upward peers
                    peerGroup.AddRange(sortedUsers[goalGrade + offset]);
                }

                // Check if no more peers are required
                if (peerGroup.Count >= minPeerGroupSize) break;

                // Check if there are valid downward peers
                if (goalGrade - offset >= 1)
                {
                    // Fill with downward peers
                    peerGroup.AddRange(sortedUsers[goalGrade - offset]);
                }
            }
            return peerGroup;
        }

        /// <summary>
        ///
        /// </summary>
        /// <param name="peerGroup"></param>
        /// <returns></returns>
        Dictionary<int,List<float>> CalculateGrades(List<string> peerGroup){
            Dictionary<int,List<float>> grades = new();

            // We run the following process for each individual peer in the group
            foreach(string peerID in peerGroup)
            {
                // We query all the grades of each peer
                Dictionary<int,List<float>> temp = DatabaseManager.Instance.GetUserGrades(this._courseID, peerID, this._hashCode);

                temp.ToList().ForEach(x =>
                {
                    // And we merge the temporary dictionary with the grades dictionary
                    if (!grades.TryGetValue(x.Key, out List<float> value))
                        grades[x.Key] = new List<float>(x.Value);
                    else
                        x.Value.ForEach(y => grades[x.Key].Add(y));
                });
            }

            return grades;
        }

        /// <summary>
        /// Create all the peer groups for the course.
        /// </summary>
        void CreatePeerGroupsForCourse()
        {
            // We find all students of the course and classify them according to their goal grade
            List<string>[] sortedUsers = this.GetUsersSortedByGoalGrade();

            int minPeerGroupSize = DatabaseManager.Instance.GetMinimumPeerGroupSize(this._courseID);

            // We create the peer groups for each goal grade classification
            for (int goalGradeClass = 1; goalGradeClass <= 10; goalGradeClass++)
            {

                // We initiallize the peer group by filling it with the users of the same goal grade
                List<string> peerGroup = CreatePeerGroup(sortedUsers, goalGradeClass, minPeerGroupSize);

                // Since we have the loginIds of all members in the peer-group,
                // we will calculate their minimum, maximum and average grade.

                Dictionary<int, List<float>> grades = CalculateGrades(peerGroup);

                // Finally, we go through all dictionary (= all tiles)
                // and we store the title, min, max and average of each list in the database.
                // also, we save the user_ids of the peers in said group
                foreach (KeyValuePair<int, List<float>> entry in grades)
                {
                    if ((entry.Value != null) && entry.Value.Any())
                    {
                        DatabaseManager.Instance.CreateUserPeer(
                        this._courseID,
                        goalGradeClass,
                        peerGroup,
                        entry.Key,
                        entry.Value.Sum() / peerGroup.Count(),
                        entry.Value.Min(),
                        entry.Value.Max(),
                        this._hashCode);
                    }
                }
            }
        }

        void CreateNotifications() {

            // for each student, we do the following:

            // foreach (var tile in tilesWithNotifications)
            // {
            //     var peerGrade = peerGrades1.FirstOrDefault(
            //         x => x.TileID == tile.ID);
            //     var userGrade = userGrades1.FirstOrDefault(
            //         x => x.TileID == tile.ID);
            //     if (peerGrade != null && userGrade != null)
            //     {
            //         if (userGrade.Average - peerGrade.Average > 0.8)
            //         {
            //             DatabaseManager.Instance.RegisterNotification(
            //                 CourseID,
            //                 student.LoginID,
            //                 tile.ID,
            //                 // TODO: Change to enum
            //                 "outperforming peers",
            //                 this.Hash
            //             );
            //         }
            //     }

            //     _logger.LogInformation($"About to process {tile.GetEntries().Count} tile entries...");

            //     List<float> userGradeList = new List<float>();
            //     List<float> peerGradeList = new List<float>();
            //     foreach (var entry in tile.GetEntries())
            //     {
            //         /**
            //             * Fetch all grades given to the current user and
            //             * its peers that belong to the current tile entry.
            //             */

            //         var userGrades = DatabaseManager.Instance
            //             .GetTileEntrySubmissionsForUser(
            //                 this.CourseID,
            //                 entry.ID,
            //                 student.LoginID,
            //                 this.Hash);

            //         var peerGrades =
            //             DatabaseManager.Instance.GetTileEntrySubmissions(
            //                     this.CourseID, entry.ID, this.Hash).FindAll(
            //                     s => peerIDs.Contains(s.UserLoginID));

            //         // Add grades to registry
            //         userGrades.ForEach(g =>
            //             userGradeList.Add(float.Parse(g.Grade)));
            //         peerGrades.ForEach(g =>
            //             peerGradeList.Add(float.Parse(g.Grade)));

            //     }

            //     // If no grades are available default the average to -1
            //     float userGradesAverage = userGradeList.Count > 0 ?
            //         userGradeList.Average() : -1;
            //     float peerGradesAverage = peerGradeList.Count > 0 ?
            //         peerGradeList.Average() : -1;

            //     // Validate the presence of grades, otherwise skip tile
            //     if (userGradesAverage == -1 || peerGradesAverage == -1)
            //     {
            //         _logger.LogInformation("Student has invalid grade average, or peer grade average, skipping student.");
            //         continue;
            //     }

            //     // Collect the grades excluding the last grade
            //     var historicUserGrades = userGradeList.Count > 1 ?
            //         userGradeList
            //             .GetRange(0, userGradeList.Count - 2) :
            //         null;

            //     var historicPeerGrades = peerGradeList.Count > 1 ?
            //         peerGradeList
            //             .GetRange(0, peerGradeList.Count - 2) :
            //         null;

            //     // If no historic scenario is possible do not
            //     // send any notifications
            //     if (historicUserGrades == null ||
            //         historicPeerGrades == null)
            //     {
            //         _logger.LogInformation("Student has no historic grades, or no historic peer grades, skipping.");
            //         continue;
            //     }

            //     // Compute historic average
            //     float historicUserGradesAverage =
            //         historicUserGrades.Count > 0 ?
            //             historicUserGrades.Average() : -1;

            //     float historicPeerGradesAverage =
            //         historicPeerGrades.Count > 0 ?
            //             historicPeerGrades.Average() : -1;

            //     // Compute point change
            //     var historicDiff = historicUserGradesAverage -
            //         historicPeerGradesAverage;
            //     var currentDiff = userGradesAverage -
            //         peerGradesAverage;

            //     // Check if student is closing the gap to its peers
            //     if ((historicDiff < currentDiff) &&
            //         (historicDiff < 0) && (currentDiff < 0))
            //     {
            //         DatabaseManager.Instance.RegisterNotification(
            //             CourseID,
            //             student.LoginID,
            //             tile.ID,
            //             "closing the gap",
            //             this.Hash);
            //     }

            //     // Check if the gap between the student and peers
            //     // is growing.
            //     if ((historicDiff > currentDiff) &&
            //         (historicDiff < 0) && (currentDiff < 0))
            //     {
            //         DatabaseManager.Instance.RegisterNotification(
            //             CourseID,
            //             student.LoginID,
            //             tile.ID,
            //             "more effort required",
            //             this.Hash);
            //     }
            // }
        }

    }
}
