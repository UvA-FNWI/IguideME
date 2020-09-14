namespace IguideME.Web.Models
{
    public class ConsentData
    {
        public int CourseID { get; set; }
        public int UserID { get; set; }
        public string UserName { get; set; }

        // 1 = accepted, 0 = declined, -1 = unspecified
        public int Granted { get; set; }

        public ConsentData(int CourseID, int UserID, string UserName, int Granted)
        {
            this.CourseID = CourseID;
            this.UserID = UserID;
            this.UserName = UserName;
            this.Granted = Granted;
        }
    }
}
