namespace IguideME.Web.Models
{
    public class GoalData
    {
        public int CourseID { get; set; }
        public string UserLoginID { get; set; }
        public int UserID { get; set; }
        public string UserName { get; set; }

        public int Grade { get; set; }

        public GoalData(int CourseID, int Grade, string UserLoginID)
        {
            this.CourseID = CourseID;
            this.UserLoginID = UserLoginID;
            this.Grade = Grade;
        }
    }
}
