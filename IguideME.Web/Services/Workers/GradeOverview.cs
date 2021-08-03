using System;
using System.Collections.Generic;
using System.Linq;
using IguideME.Web.Models;
using IguideME.Web.Models.App;
using IguideME.Web.Models.Impl;
using Newtonsoft.Json;

namespace IguideME.Web.Services.Workers
{
    public class GradeOverview
    {
        /**
         * - Assignments
         * - Discussion
         * - External data
         **/
        public GradeOverview(
            int courseID)
        {
            /**
             * Er is een model
             * Heeft theta's
             *  -> gelinkt aan tile en entry id
             **/

            List<User> students = DatabaseManager.Instance
                .GetUsers(courseID, "student");

            // dit zijn assignments, external data en discussions
            List<TileEntrySubmission> submissions = DatabaseManager.Instance
                .GetCourseSubmissions(courseID);

            List<Tile> tiles = DatabaseManager.Instance.GetTiles(courseID);
            List<TileEntry> tileEntries = DatabaseManager.Instance
                .GetEntries(courseID);

            List<PredictiveModel> models = DatabaseManager.Instance.
                GetPredictiveModels(courseID);

            foreach (User student in students)
            {
                // bijhouden: tile id, entry id?

                List<TileEntrySubmission> userSubmissions =
                    submissions.Where(s => s.UserLoginID == student.LoginID)
                    .ToList();

                // submission -> entry
                // entry -> tile

                string[] test = userSubmissions.Select(s => {
                    TileEntry entry = tileEntries.Find(e => e.ID == s.EntryID);
                    Tile tile = tiles.Find(t => t.ID == entry.TileID);

                    if (tile.ContentType == "BINARY")
                    {
                        return tile.ID.ToString();
                    }

                    return tile.ID.ToString() + "-" + entry.ID.ToString();
                }).ToArray();

                Console.WriteLine(student.Name);
                Console.WriteLine(JsonConvert.SerializeObject(test));
            }

        }
    }
}
