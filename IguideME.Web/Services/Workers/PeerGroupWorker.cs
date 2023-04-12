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
            List<Tile> tiles = DatabaseManager.Instance.GetTiles(this.CourseID);
            List<User> students = DatabaseManager.Instance
                .GetUsers(this.CourseID, "student", this.Hash);

            _logger.LogInformation($"About to process {students.Count} students...");

            // iterate over all students in the course
            foreach (var student in students)
            {
                // don't register data from students that did not give consent
                if (DatabaseManager.Instance.GetConsent(this.CourseID, student.UserID) != 1)
                {
                    // _logger.LogInformation($"Skipping user with userID {student.UserID} as they did not give consent.");
                    continue;
                }

                // _logger.LogInformation("Processing student with userID " + student.UserID);

                var user = new UserWithPeerGroup(
                                    0,
                                    this.CourseID,
                                    student.StudentNumber,
                                    student.UserID,
                                    student.Name,
                                    student.SortableName,
                                    student.Role,
                                    this.Hash,
                                    true);

                // Fetch peer students
                var peers = user.GetPeers();

                // Peers may be null, if null no peer comparison will be given
                if (peers == null)
                {
                    // _logger.LogInformation($"Student {student.ID} has no peers, so no peer comparison will be made.");
                    continue;
                }

                // _logger.LogInformation($"Student {student.ID} with userID {user.UserID} has {peers.Count} peers.");

                foreach (var peer in peers)
                {
                    // Register student as a peer to the current user
                    DatabaseManager.Instance.CreateUserPeer(
                        this.CourseID,
                        student.UserID,
                        peer.UserID,
                        this.Hash);
                }

                var peerIDs = peers.Select(p => p.UserID);

                var peerGrades1 = DatabaseManager.Instance.GetUserPeerComparison(
                            this.CourseID, user.UserID, hash: this.Hash);
                var userGrades1 = DatabaseManager.Instance.GetUserResults(
                    this.CourseID, user.UserID, hash: this.Hash);

                var tilesWithNotifications = tiles.Where(t => t.Notifications);

                _logger.LogInformation($"About to process {tilesWithNotifications.Count()} tiles...");

                foreach (var tile in tilesWithNotifications)
                {
                    var peerGrade = peerGrades1.FirstOrDefault(
                        x => x.TileID == tile.ID);
                    var userGrade = userGrades1.FirstOrDefault(
                        x => x.TileID == tile.ID);
                    if (peerGrade != null && userGrade != null)
                    {
                        if (userGrade.Average - peerGrade.Average > 0.8)
                        {
                            DatabaseManager.Instance.RegisterNotification(
                                CourseID,
                                student.UserID,
                                tile.ID,
                                "outperforming peers",
                                this.Hash
                            );
                        }
                    }

                    _logger.LogInformation($"About to process {tile.GetEntries().Count} tile entries...");

                    List<float> userGradeList = new List<float>();
                    List<float> peerGradeList = new List<float>();
                    foreach (var entry in tile.GetEntries())
                    {
                        /**
                         * Fetch all grades given to the current user and
                         * its peers that belong to the current tile entry.
                         */

                        var userGrades = DatabaseManager.Instance
                            .GetTileEntrySubmissionsForUser(
                                this.CourseID,
                                entry.ID,
                                student.UserID,
                                this.Hash);

                        var peerGrades =
                            DatabaseManager.Instance.GetTileEntrySubmissions(
                                 this.CourseID, entry.ID, this.Hash).FindAll(
                                    s => peerIDs.Contains(s.UserID));

                        // Add grades to registry
                        userGrades.ForEach(g =>
                            userGradeList.Add(float.Parse(g.Grade)));
                        peerGrades.ForEach(g =>
                            peerGradeList.Add(float.Parse(g.Grade)));

                    }

                    // If no grades are available default the average to -1
                    float userGradesAverage = userGradeList.Count > 0 ?
                        userGradeList.Average() : -1;
                    float peerGradesAverage = peerGradeList.Count > 0 ?
                        peerGradeList.Average() : -1;

                    // Validate the presence of grades, otherwise skip tile
                    if (userGradesAverage == -1 || peerGradesAverage == -1)
                    {
                        _logger.LogInformation("Student has invalid grade average, or peer grade average, skipping student.");
                        continue;
                    }

                    // Collect the grades excluding the last grade
                    var historicUserGrades = userGradeList.Count > 1 ?
                        userGradeList
                            .GetRange(0, userGradeList.Count - 2) :
                        null;

                    var historicPeerGrades = peerGradeList.Count > 1 ?
                        peerGradeList
                            .GetRange(0, peerGradeList.Count - 2) :
                        null;

                    // If no historic scenario is possible do not
                    // send any notifications
                    if (historicUserGrades == null ||
                        historicPeerGrades == null)
                    {
                        _logger.LogInformation("Student has no historic grades, or no historic peer grades, skipping.");
                        continue;
                    }

                    // Compute historic average
                    float historicUserGradesAverage =
                        historicUserGrades.Count > 0 ?
                            historicUserGrades.Average() : -1;

                    float historicPeerGradesAverage =
                        historicPeerGrades.Count > 0 ?
                            historicPeerGrades.Average() : -1;

                    // Compute point change
                    var historicDiff = historicUserGradesAverage -
                        historicPeerGradesAverage;
                    var currentDiff = userGradesAverage -
                        peerGradesAverage;

                    // Check if student is closing the gap to its peers
                    if ((historicDiff < currentDiff) &&
                        (historicDiff < 0) && (currentDiff < 0))
                    {
                        DatabaseManager.Instance.RegisterNotification(
                            CourseID,
                            student.UserID,
                            tile.ID,
                            "closing the gap",
                            this.Hash);
                    }

                    // Check if the gap between the student and peers
                    // is growing.
                    if ((historicDiff > currentDiff) &&
                        (historicDiff < 0) && (currentDiff < 0))
                    {
                        DatabaseManager.Instance.RegisterNotification(
                            CourseID,
                            student.UserID,
                            tile.ID,
                            "more effort required",
                            this.Hash);
                    }
                }
            }
        }
    }
}
