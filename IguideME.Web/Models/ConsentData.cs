namespace IguideME.Web.Models
{
    public class ConsentData
    {
        public int CourseID { get; set; }
        public string UserID { get; set; }

        // 1 = accepted, 0 = declined, -1 = unspecified
        public int Granted { get; set; }

        public ConsentData(int courseID, string userID, int granted)
        {
            this.CourseID = courseID;
            this.UserID = userID;
            this.Granted = granted;
        }
    }
}
