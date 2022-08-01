using System;
using IguideME.Web.Models.App;
using IguideME.Web.Models.Impl;

namespace IguideME.Web.Services.Workers
{
    public class GradePredictorWorker
    {
        private int CourseID { get; set; }

        private string SyncHash { get; set; }

        private GradePredictionModel Model { get; set; }

        public GradePredictorWorker(int courseID, string syncHash)
        {
            this.CourseID = courseID;
            this.SyncHash = syncHash;
            this.Model = DatabaseManager.Instance.GetGradePredictionModel(courseID);
        }

        public void MakePredictions()
        {
            if (this.Model == null)
            {
                Console.WriteLine($"No suitible grade prediction model found for courseID {this.CourseID}");
                return;
            }

            var students = DatabaseManager.Instance.GetUsers(this.CourseID, "student", this.SyncHash);
            var tiles = DatabaseManager.Instance.GetTiles(this.CourseID);
            var tileEntries = DatabaseManager.Instance.GetEntries(this.CourseID);

            foreach (var student in students)
            {
                this.ProcessStudent(student);
            }
        }

        private void ProcessStudent(User student)
        {
            var submissions = DatabaseManager.Instance.GetCourseSubmissionsForStudent(this.CourseID,
                                                                                      student.LoginID,
                                                                                      this.SyncHash);
            var tileEntries = DatabaseManager.Instance.GetEntries(this.CourseID);

            var wGrade = 0.0;

            foreach (var modelParameter in this.Model.Parameters)
            {
                var submission = submissions.Find(sub => sub.EntryID == modelParameter.ParameterID);
                if (submission == null)
                {
                    Console.WriteLine($"Student {student.UserID} has no submission for EntryID {modelParameter.ParameterID}");
                    continue;
                }

                var partialGrade = 0.0;
                if (!double.TryParse(submission.Grade, out partialGrade))
                {
                    Console.WriteLine($"Error parsing submission grade as double: {submission.Grade}");
                    Console.WriteLine("Aborting.");
                    return;
                }

                Console.WriteLine($"grade += {partialGrade} * {modelParameter.Weight}");

                wGrade += partialGrade * modelParameter.Weight;
            }

            Console.WriteLine(wGrade);

            DatabaseManager.Instance.CreatePredictedGrade(this.CourseID,
                                                          student.LoginID,
                                                          (float)wGrade,
                                                          0, // TODO why is this needed?
                                                          this.SyncHash);
        }
    }
}
