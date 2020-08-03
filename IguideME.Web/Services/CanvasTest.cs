using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using GraphQL;
using GraphQL.Client.Http;
using GraphQL.Client.Serializer.Newtonsoft;
using Newtonsoft.Json.Linq;
using System.IO;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using System.Web;
using UvA.Connectors.Canvas.Helpers;
using UvA.DataNose.Connectors.Canvas;

namespace IguideME.Web.Services
{
    public class CanvasTest
    {
        CanvasApiConnector connector;
        public string baseUrl;
        public string accessToken;
        public string apiVersioning = "api/v1/";

        public CanvasTest(IConfiguration config)
        {
            this.accessToken = config["Canvas:AccessToken"];
            this.baseUrl = config["Canvas:Url"];
            connector = new CanvasApiConnector(config["Canvas:Url"], config["Canvas:AccessToken"]);
        }

        public string[] GetStudents(int courseId)
            => connector.FindCourseById(courseId).GetUsersByType(EnrollmentType.Student).Select(s => s.Name).ToArray();

        public List<Quiz> GetQuizzes(int courseId) {
            return connector.FindCourseById(courseId).Quizzes;
        }
    }
}
