using Newtonsoft.Json;

namespace IguideME.Web.Models
{
    // public class Course
    // {
    //     public int ID { get; set; }
    //     public string Name { get; set; }
    //     public float StartDate { get; set; }
    //     public float EndDate { get; set; }

    //     public Course(int courseID, string courseName, float start_date = -1f, float end_date = -1f)
    //     {
    //         this.ID = courseID;
    //         this.Name = courseName;
    //         this.StartDate = start_date;
    //         this.EndDate = end_date;

    //     }
    // }
    public enum WorkflowStates
    {
        UNPUBLISHED,
        AVAILABLE,
        COMPLETED,
    }

    public class Course
    {
        [JsonProperty(PropertyName = "id")]
        public int ID { get; set; }
        [JsonProperty(PropertyName = "name")]
        public string Name { get; set; }
        [JsonProperty(PropertyName = "courseCode")]
        public string Code { get; set; }
        [JsonProperty(PropertyName = "workflowState")]
        public WorkflowStates WorkflowState { get; set; }
        [JsonProperty(PropertyName = "isPublic")]
        public bool IsPublic { get; set; }
        [JsonProperty(PropertyName = "courseImage")]
        public string Image { get; set; }

        public Course(int courseID, string name, string code, WorkflowStates state, bool isPublic, string image)
        {
            this.ID = courseID;
            this.Name = name;
            this.Code = code;
            this.WorkflowState = state;
            this.IsPublic = isPublic;
            this.Image = image;

        }
    }

}
