namespace IguideME.Web.Models
{
    public class ConsentData
    {
        public int CourseID { get; set; }
        public string UserLoginID { get; set; }
        public int UserID { get; set; }
        public string UserName { get; set; }

        // 1 = accepted, 0 = declined, -1 = unspecified
        public int Granted { get; set; }

        public ConsentData(int courseID, int userID, string userLoginID, string userName, int granted)
        {
            this.CourseID = courseID;
            this.UserID = userID;
            this.UserLoginID = userLoginID;
            this.UserName = userName;
            this.Granted = granted;
        }
    }
}
