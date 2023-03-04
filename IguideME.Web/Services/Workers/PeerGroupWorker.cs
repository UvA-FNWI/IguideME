using System;
using System.Collections.Generic;
using System.Linq;
using IguideME.Web.Models;
using IguideME.Web.Models.Impl;
using Microsoft.Extensions.Logging;

namespace IguideME.Web.Services.Workers
{
    public class PeerGroupWorker
    {
        private readonly ILogger<SyncManager> _logger;
        private int CourseID { get; set; }
        private string Hash { get; set; }

        public PeerGroupWorker(int courseID, string hash,
        ILogger<SyncManager> logger)
        {
            _logger = logger;
            this.CourseID = courseID;
            this.Hash = hash;
        }

        public void Create()
        {

            CreatePeerGroupsOfCourse();

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

        List<String>[] sortUsersByGoalGrade() {
            List<String>[] usersWithSameGoalGrade = new List<String>[11];

            for (int goalGradeClass = 1; goalGradeClass <= 10; goalGradeClass++)
            {
                usersWithSameGoalGrade[goalGradeClass] = new List<string>();
                //TODO: get only those with consent!!!
                List<User> sameGraders = DatabaseManager.Instance.GetUsersWithGoalGrade(this.CourseID,goalGradeClass, this.Hash);
                sameGraders.ForEach(x => usersWithSameGoalGrade[goalGradeClass].Add(x.LoginID));
            }

            return usersWithSameGoalGrade;
        }

        List<String> createPeerGroup(List<String>[] usersWithSameGoalGrade, int goalGradeClass, int minPeerGroupSize) {
            List<String> peerGroup = new List<string>(usersWithSameGoalGrade[goalGradeClass]);

            for (int offset = 1; peerGroup.Count < minPeerGroupSize && offset < 10; offset++)
            {
                // Check if there are valid upward peers
                if (goalGradeClass + offset <= 10)
                {
                    // Fill with upward peers
                    peerGroup.AddRange(usersWithSameGoalGrade[goalGradeClass + offset]);
                }

                // Check if no more peers are required
                if (peerGroup.Count >= minPeerGroupSize) break;

                // Check if there are valid downward peers
                if (goalGradeClass - offset >= 1)
                {
                    // Fill with downward peers
                    peerGroup.AddRange(usersWithSameGoalGrade[goalGradeClass - offset]);
                }
            }
            return peerGroup;
        }

        Dictionary<int,List<float>> calculateGrades(List<String> peerGroup){
            Dictionary<int,List<float>> grades = new Dictionary<int,List<float>>();

            // We run the following process for each individual peer in the group
            foreach(string peerID in peerGroup)
            {
                // We query all the grades of each peer
                Dictionary<int,List<float>> temp = DatabaseManager.Instance.GetUserGrades(this.CourseID,peerID,this.Hash);

                // And we merge the temporary dictionary with the grades dictionary
                List<float> value;
                temp.ToList().ForEach(x =>{
                    if (!grades.TryGetValue(x.Key, out value))
                        grades[x.Key] = new List<float>(x.Value);
                    else
                        x.Value.ForEach(y => grades[x.Key].Add(y));
                    });
            }

            return grades;
        }

        void CreatePeerGroupsOfCourse()
        {
            // We find all students of the course and classify them according to their goal grade
            List<String>[] usersWithSameGoalGrade = this.sortUsersByGoalGrade();

            int minPeerGroupSize = DatabaseManager.Instance.GetMinimumPeerGroupSize(this.CourseID);

            // We create the peer groups for each goal grade classification
            for (int goalGradeClass = 1; goalGradeClass <= 10; goalGradeClass++)
            {

                // We initiallize the peer group by filling it with the users of the same goal grade
                List<String> peerGroup = createPeerGroup(usersWithSameGoalGrade, goalGradeClass, minPeerGroupSize);

                // Since we have the loginIds of all members in the peer-group, 
                // we will calculate their minimum, maximum and average grade.

                Dictionary<int, List<float>> grades = calculateGrades(peerGroup);

                // Finally, we go through all dictionary (= all tiles)
                // and we store the title, min, max and average of each list in the database.
                // also, we save the user_ids of the peers in said group
                foreach (KeyValuePair<int, List<float>> entry in grades)
                {
                    if ((entry.Value != null) && (entry.Value.Any()))
                    {
                        DatabaseManager.Instance.CreateUserPeer(
                        this.CourseID,
                        goalGradeClass, 
                        peerGroup,
                        entry.Key,
                        entry.Value.Average(),
                        entry.Value.Min(),
                        entry.Value.Max(),
                        this.Hash);
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
