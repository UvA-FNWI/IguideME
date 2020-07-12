using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using UvA.DataNose.Connectors.Canvas;

namespace IguideME.Web.Services
{
    public class CanvasTest
    {
        CanvasApiConnector connector;

        public CanvasTest(IConfiguration config)
        {
            connector = new CanvasApiConnector(config["Canvas:Url"], config["Canvas:AccessToken"]);
        }

        public string[] GetStudents(int courseId)
            => connector.FindCourseById(courseId).GetUsersByType(EnrollmentType.Student).Select(s => s.Name).ToArray();
    }
}
