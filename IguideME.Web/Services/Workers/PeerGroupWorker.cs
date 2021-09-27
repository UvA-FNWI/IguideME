using System;
using System.Collections.Generic;
using System.Linq;
using IguideME.Web.Models;
using IguideME.Web.Models.Impl;

namespace IguideME.Web.Services.Workers
{
    public class PeerGroupWorker
    {

		private int CourseID { get; set; }
		private string Hash { get; set; }

        public PeerGroupWorker(int courseID, string hash)
        {
			this.CourseID = courseID;
			this.Hash = hash;
        }

        public void Create()
        {
			List<Tile> tiles = DatabaseManager.Instance.GetTiles(this.CourseID);
			List<User> students = DatabaseManager.Instance
				.GetUsers(this.CourseID, "student", this.Hash);

			int i = 0;
			// iterate over all students in the course
			foreach (var student in students)
			{
				// don't register data from students that did not give consent
				if (DatabaseManager.Instance.GetConsent(this.CourseID, student.LoginID) != 1)
					continue;

				try
				{
					var user = new UserWithPeerGroup(
										0,
										this.CourseID,
										(int)student.ID,
										student.SisID,
										student.SisID,
										student.Name,
										student.SortableName,
										student.Role,
										this.Hash,
										true);

					// Fetch peer students
					var peers = user.GetPeers();

					Console.WriteLine(user.Name + " - Peer count: " + (peers == null ? -1 : peers.Count).ToString());
					Console.WriteLine(i);
					i++;

					// Peers may be null, if null no peer comparison will be given
					if (peers != null)
					{
						foreach (var peer in peers)
						{
							// Register student as a peer to the current user

							DatabaseManager.Instance.CreateUserPeer(
								this.CourseID,
								student.LoginID,
								peer.LoginID,
								this.Hash);
						}

						var peerIDs = peers.Select(p => p.LoginID);

						var peerGrades1 = DatabaseManager.Instance.GetUserPeerComparison(
									this.CourseID, user.LoginID);
						var userGrades1 = DatabaseManager.Instance.GetUserResults(
							this.CourseID, user.LoginID);

						foreach (var tile in tiles)
						{
							// only create notifications for appropiate tiles
							if (!tile.Notifications) continue;

							List<float> userGradeList = new List<float>();
							List<float> peerGradeList = new List<float>();
							var entries = tile.GetEntries();

							var peerGrade = peerGrades1.First(
								x => x.TileID == tile.ID);
							var userGrade = userGrades1.First(
								x => x.TileID == tile.ID);

							if (peerGrade != null && userGrade != null)
                            {
								if (userGrade.Average - peerGrade.Average > 0.8)
                                {
									DatabaseManager.Instance.RegisterNotification(
										CourseID,
										student.LoginID,
										tile.ID,
										"outperforming peers",
										this.Hash);
								}
                            }

							// Iterate over all entries within the tile
							foreach (var entry in entries)
							{
								/**
								 * Fetch all grades given to the current user and 
								 * its peers that belong to the current tile entry. 
								 */

								var userGrades = DatabaseManager.Instance
									.GetTileEntrySubmissionsForUser(
										this.CourseID,
										entry.ID,
										student.LoginID,
										this.Hash);

								var peerGrades =
									DatabaseManager.Instance.GetTileEntrySubmissions(
										 this.CourseID, entry.ID, this.Hash).FindAll(
											s => peerIDs.Contains(s.UserLoginID));

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
								continue;
						
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
								historicPeerGrades == null) continue;

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
								Console.WriteLine("\tClosing the gap: " + tile.Title + " (" + currentDiff.ToString() + " > " + historicDiff.ToString() + ")");

								DatabaseManager.Instance.RegisterNotification(
									CourseID,
									student.LoginID,
									tile.ID,
									"closing the gap",
									this.Hash);
							}

							// Check if the gap between the student and peers
							// is growing.
							if ((historicDiff > currentDiff) &&
								(historicDiff < 0) && (currentDiff < 0))
							{
								Console.WriteLine("\tYou have put more effort in: " + tile.Title + " (" + currentDiff.ToString() + " > " + historicDiff.ToString() + ")");

								DatabaseManager.Instance.RegisterNotification(
									CourseID,
									student.LoginID,
									tile.ID,
									"more effort required",
									this.Hash);
							}
						}
					}
				} catch { continue; }
			}
		}
    }
}
