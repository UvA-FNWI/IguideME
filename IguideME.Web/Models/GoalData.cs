namespace IguideME.Web.Models
{
    public class GoalData
    {
        public int CourseID { get; set; }
        public string UserLoginID { get; set; }
        public int UserID { get; set; }
        public string UserName { get; set; }

        public int Grade { get; set; }

        public GoalData(int CourseID, int Grade, int UserID, string UserLoginID, string UserName)
        {
            this.CourseID = CourseID;
            this.UserID = UserID;
            this.UserLoginID = UserLoginID;
            this.UserName = UserName;
            this.Grade = Grade;
        }
    }
}
