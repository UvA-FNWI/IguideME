namespace IguideME.Web.Models
{
    public class Course
    {
        public int ID { get; set; }
        public string Name { get; set; }
        public float StartDate { get; set; }
        public float EndDate { get; set; }

        public Course(int courseID, string courseName, float start_date = -1f, float end_date = -1f)
        {
            this.ID = courseID;
            this.Name = courseName;
            this.StartDate = start_date;
            this.EndDate = end_date;

        }
    }
}
