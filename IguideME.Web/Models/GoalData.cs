namespace IguideME.Web.Models
{
    public class GoalData
    {
        public int CourseID { get; set; }
        public string UserLoginID { get; set; }
        public int UserID { get; set; }
        public string UserName { get; set; }

        public int Grade { get; set; }

        public GoalData(int courseID, int grade, string userLoginID)
        {
            this.CourseID = courseID;
            this.UserLoginID = userLoginID;
            this.Grade = grade;
        }
    }
}
