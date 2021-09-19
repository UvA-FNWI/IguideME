using System;
using System.Collections.Generic;
using System.Linq;
using IguideME.Web.Models;
using IguideME.Web.Models.App;
using IguideME.Web.Models.Impl;

namespace IguideME.Web.Services.Workers
{
	public class GradePredictorWorker
	{

		private int CourseID { get; set; }

        private string SyncHash { get; set; }

        private List<PredictiveModel> Models { get; set; }

		public GradePredictorWorker(int courseID, string syncHash)
        { 
            List<PredictiveModel> models = DatabaseManager.Instance.
                GetPredictiveModels(courseID);

            this.CourseID = courseID;
            this.SyncHash = syncHash;
            this.Models = models;
        }

        private PredictiveModel FindBestModel(HashSet<string> registry)
        {
            int maxMatches = 0;
            PredictiveModel suitableModel = null;

            foreach (PredictiveModel model in this.Models)
            {
                int matches = 0;
                model.EntryCollection.Split("#").ToList().ForEach(k =>
                {
                    if (registry.Contains(k)) matches++;
                });

                if (matches > maxMatches)
                {
                    suitableModel = model;
                    maxMatches = matches;
                }

            }

            return suitableModel;
        }

        public void MakePredictions()
        {
            List<User> students = DatabaseManager.Instance
                .GetUsers(this.CourseID, "student", this.SyncHash);

            List<TileEntrySubmission> submissions = DatabaseManager.Instance
                .GetCourseSubmissions(this.CourseID, this.SyncHash);

            List<Tile> tiles = DatabaseManager.Instance.GetTiles(this.CourseID);
            List<TileEntry> tileEntries = DatabaseManager.Instance
                .GetEntries(this.CourseID);

            foreach (User student in students)
            {    
                List<TileEntrySubmission> userSubmissions =
                    submissions.Where(s => s.UserLoginID == student.LoginID)
                    .ToList();

                HashSet<string> registry = new HashSet<string>();

                /*
                if (userSubmissions.All(s => s.Submitted != null))
                {
                    userSubmissions = userSubmissions
                        .OrderBy(s => s.Submitted)
                        .ToList();
                }
                */

                userSubmissions.ForEach(s =>
                {
                    TileEntry entry = tileEntries.Find(e => e.ID == s.EntryID);
                    if (entry != null)
                    {
                        Tile tile = tiles.Find(t => t.ID == entry.TileID);

                        if (tile != null)
                        {
                            if (tile.ContentType == "BINARY")
                                registry.Add(tile.ID.ToString());
                            else
                                registry.Add(tile.ID.ToString(tile.ID.ToString() + "-" + entry.ID.ToString()));
                        }
                    }
                });

                // todo: add discussions

                string modelKey = String.Join('#', registry.OrderBy(r => r));

                for (int i = registry.Count; i > 2; i--)
                {
                    PredictiveModel bestModel =
                        this.FindBestModel(registry.Take(i).ToHashSet());

                    if (bestModel == null) continue;

                    bool okModel = true;

                    // If no model was found the instructor is probably at fault
                    if (bestModel != null)
                    {
                        bestModel.LoadThetas();

                        if (bestModel.Theta.Count() != i + 1) continue;

                        float intercept = bestModel.Theta
                            .ToList().Find(t => t.Intercept).Value;

                        List<float> factors = new List<float>();

                        foreach (ModelTheta theta in bestModel.Theta)
                        {
                            Tile tile = tiles.Find(t => t.ID == theta.TileID);
                            if (tile == null) continue;

                            switch (tile.ContentType)
                            {
                                case Tile.CONTENT_TYPE_BINARY:
                                    /**
                                        * Binary tiles
                                        * 
                                        * Binary prediction components require the
                                        * sum of the successes for all entries in 
                                        * the tile
                                        **/
                                    List<TileEntrySubmission> binarySubmissions =
                                        userSubmissions.Where(s =>
                                        {
                                            List<TileEntry> entries = tileEntries.Where(
                                                e => e.TileID == tile.ID).ToList();

                                            return entries.Any(e => s.EntryID == e.ID);
                                        }).ToList();

                                    int success = (binarySubmissions.Where(
                                        s =>
                                        {
                                            float parsedGrade;
                                            if (float.TryParse(s.Grade, out parsedGrade))
                                            {
                                                return parsedGrade > .8;

                                            }

                                            return false;
                                        }).Count() / binarySubmissions.Count()) * 100;

                                    float binaryResult = success * theta.Value;
                                    factors.Add(binaryResult);
                                    break;
                                case Tile.CONTENT_TYPE_ENTRIES:
                                    /**
                                        * Entry tiles
                                        * 
                                        * Tiles with the entries content type simply
                                        * use the grade of the submission
                                        **/

                                    if (tile.TileType == Tile.TYPE_DISCUSSIONS)
                                    {
                                        continue;
                                    }
                                    else
                                    {
                                        TileEntrySubmission submission =
                                            userSubmissions.Find(
                                                s => s.EntryID == theta.EntryID);

                                        if (submission == null) continue;

                                        float parsedGrade;
                                        if (float.TryParse(submission.Grade, out parsedGrade))
                                        {
                                            float assignmentEntryResult = parsedGrade * theta.Value;
                                            factors.Add(assignmentEntryResult);
                                        }
                                        else { okModel = false; }
                                    }
                                    break;
                                default:
                                    break;
                            }
                        }

                        if (okModel)
                        {
                            // todo: register predicted grade
                            float predictedGrade = intercept + factors.Sum();
                            Console.WriteLine(i.ToString() + ": " + predictedGrade.ToString() + " -> " + factors.Count().ToString());
                            DatabaseManager.Instance.CreatePredictedGrade(
                                this.CourseID,
                                student.LoginID,
                                predictedGrade,
                                factors.Count(),
                                this.SyncHash);
                        }
                    }
                }
                
                
            }
        }
    }
}
