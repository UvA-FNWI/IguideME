﻿using System.Collections.Generic;
using System.Linq;

using IguideME.Web.Models;
using IguideME.Web.Models.App;
using IguideME.Web.Models.Impl;

using Microsoft.Extensions.Logging;

namespace IguideME.Web.Services.Workers
{

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
            // CreateNotifications();
        }

        /// <summary>
        /// Creates an array of lists of users, where the array is indexed by the goal grade of the users.
        /// </summary>
        /// <returns>A list of users per goal grade.</returns>
        List<string>[] GetUsersSortedByGoalGrade()
        {
            List<string>[] usersWithSameGoalGrade = new List<string>[11];

            for (int goalGradeClass = 1; goalGradeClass <= 10; goalGradeClass++)
            {
                usersWithSameGoalGrade[goalGradeClass] = new List<string>();
                //TODO: get only those with consent!!!
                List<User> sameGraders = DatabaseManager.Instance.GetUsersWithGoalGrade(this._courseID, goalGradeClass, this._hashCode);
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
        static List<string> CreatePeerGroup(List<string>[] sortedUsers, int goalGrade, int minPeerGroupSize)
        {
            List<string> peerGroup = new(sortedUsers[goalGrade]);

            // Look for peers until minimum size is reached or untill the offset exceeds the range of valid grades.
            for (int offset = 1; peerGroup.Count < minPeerGroupSize && offset < 10; offset++)
            {
                // Check if there are peers with higher grades.
                if (goalGrade + offset <= 10)
                {
                    // Fill with found peers
                    peerGroup.AddRange(sortedUsers[goalGrade + offset]);
                }

                // Check if no more peers are required
                if (peerGroup.Count >= minPeerGroupSize) break;

                // Check if there are peers with lower grades.
                if (goalGrade - offset >= 1)
                {
                    // Fill with found peers
                    peerGroup.AddRange(sortedUsers[goalGrade - offset]);
                }
            }
            return peerGroup;
        }

        /// <summary>
        /// Calculate the minimum, average, and maximum for a peergroup for each tile.
        /// </summary>
        /// <param name="peerGroup"></param>
        /// <returns>A dictionary with the tileID as key and the statistics as a list.</returns>
        Dictionary<int, List<double>> CalculateGrades(List<string> peerGroup)
        {
            Dictionary<int, List<double>> grades = new();

            // We run the following process for each individual peer in the group
            foreach (string peerID in peerGroup)
            {
                // We query all the grades of each peer
                Dictionary<int, List<double>> temp = DatabaseManager.Instance.GetUserGrades(this._courseID, peerID, this._hashCode);

                temp.ToList().ForEach(x =>
                {
                    // And we merge the temporary dictionary with the grades dictionary
                    if (!grades.TryGetValue(x.Key, out List<double> value))
                        grades[x.Key] = new List<double>(x.Value);
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

                Dictionary<int, List<double>> grades = CalculateGrades(peerGroup);

                // Finally, we go through all dictionary (= all tiles)
                // and we store the title, min, max and average of each list in the database.
                // also, we save the user_ids of the peers in said group
                foreach (KeyValuePair<int, List<double>> entry in grades)
                {
                    if ((entry.Value != null) && entry.Value.Any())
                    {
                        DatabaseManager.Instance.CreateUserPeer(
                        this._courseID,
                        goalGradeClass,
                        peerGroup,
                        entry.Key,
                        entry.Value.Average(),
                        entry.Value.Min(),
                        entry.Value.Max(),
                        this._hashCode);
                    }
                }

                CreateNotifications(sortedUsers[goalGradeClass], grades);
            }
        }

        void CreateNotifications(List<string> users, Dictionary<int, List<double>> grades)
        {

            foreach (string user in users)
            {
                foreach (KeyValuePair<int, List<double>> entry in grades)
                {
                    // Get only tiles with notifications
                    if (DatabaseManager.Instance.GetTileNotificationState(entry.Key))
                    {
                        List<AssignmentSubmission> userTileSubmissions = DatabaseManager.Instance.GetTileSubmissionsForUser(entry.Key, user, this._hashCode);

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
                            currentSubmissionGrades.Add(submission.Grade);
                            if (submission.ID != lastSubmissionID)
                                lastSubmissionGrades.Add(submission.Grade);
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
                                DatabaseManager.Instance.RegisterNotification(
                                    this._courseID,
                                    user,
                                    entry.Key,
                                    (int)Notification_Types.outperforming,
                                    this._hashCode
                                );
                            }
                            // else if (currentAverage >= peerAverage)
                            // {
                            //     // do nothing
                            // }
                            else if (currentAverage - lastAverage > 0)
                            {
                                // closing the gap
                                DatabaseManager.Instance.RegisterNotification(
                                    this._courseID,
                                    user,
                                    entry.Key,
                                    (int)Notification_Types.closing_gap,
                                    this._hashCode
                                );
                            }
                            else if ((currentAverage - lastAverage <= 0) && (peerAverage - currentAverage <= 1))
                            {
                                // falling behind
                                DatabaseManager.Instance.RegisterNotification(
                                    this._courseID,
                                    user,
                                    entry.Key,
                                    (int)Notification_Types.falling_behind,
                                    this._hashCode
                                );
                            }
                            else if ((currentAverage - lastAverage <= 0) && (peerAverage - currentAverage > 1))
                            {
                                // put more effort
                                DatabaseManager.Instance.RegisterNotification(
                                    this._courseID,
                                    user,
                                    entry.Key,
                                    (int)Notification_Types.more_effort,
                                    this._hashCode
                                );
                            }
                        }
                    }
                }
            }

        }

    }
}
