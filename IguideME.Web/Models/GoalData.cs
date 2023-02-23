namespace IguideME.Web.Models
{
    public class GoalData
    {
        public int CourseID { get; set; }
        public string UserID { get; set; }
        public string UserName { get; set; }

        public int Grade { get; set; }

        public GoalData(int courseID, int grade, string userID)
        {
            this.CourseID = courseID;
            this.UserID = userID;
            this.Grade = grade;
        }
    }
}
