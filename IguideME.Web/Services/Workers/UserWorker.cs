﻿using System;
namespace IguideME.Web.Services.Workers
{
    public class UserWorker
    {
		private CanvasTest canvasTest;
		private int courseID;
		private string hashCode;

		public UserWorker(
			int courseID,
			string hashCode,
			CanvasTest canvasTest)
        {
			this.courseID = courseID;
			this.hashCode = hashCode;
			this.canvasTest = canvasTest;
        }

        public void Register()
        {
			var students = this.canvasTest.GetStudents(this.courseID);

			Console.WriteLine("Starting student registry...");
			foreach (var student in students)
			{
				Console.WriteLine("\t" + student.Name + ", " + student.ID);

				if (DatabaseManager.Instance.GetUserGoalGrade(courseID, student.LoginID) < 0)
				{
					DatabaseManager.Instance.CreateEmptyUserGoalGrade(courseID, student.LoginID);
					DatabaseManager.Instance.UpdateUserGoalGrade(courseID, student.LoginID, 7);
				}

				DatabaseManager.Instance.RegisterUser(
					courseID,
					student.ID,
					student.LoginID,
					student.SISUserID,
					student.Name,
					student.SortableName,
					"student",
					this.hashCode
				);
			}

			Console.WriteLine("Starting instructor registry...");
			var instructors = this.canvasTest.GetAdministrators(courseID);

			foreach (var instructor in instructors)
			{
				Console.WriteLine("\t" + instructor.Name + ", " + instructor.ID);

				DatabaseManager.Instance.RegisterUser(
					courseID,
					instructor.ID,
					instructor.LoginID,
					instructor.SISUserID,
					instructor.Name,
					instructor.SortableName,
					"instructor",
					this.hashCode
				);
			}
		}
    }
}