using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using IguideME.Web.Services;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using System.Net.Http;
using System;
using System.Security.Claims;
using System.IO;
using Newtonsoft.Json.Linq;
using System.Globalization;

namespace IguideME.Web.Controllers
{
    [Authorize]
    [ApiController]
    [Route("[controller]")]
    public class DataController : ControllerBase
    {
        private readonly ILogger<DataController> logger;
        private readonly CanvasTest canvasTest;
        private static readonly HttpClient client = new HttpClient();

        // TODO: add Erwin & Natasa's login code
        private readonly string[] administrators = new string[1] { "testscience158-tst" };

        public DataController(ILogger<DataController> logger, CanvasTest canvasTest)
        {
            this.logger = logger;
            this.canvasTest = canvasTest;
        }

        private string GetUser()
        {
            // returns the logged in user
            return ((ClaimsIdentity)User.Identity).FindFirst("user").Value;
        }

        private string GetUserName()
        {
            // returns the name of the logged in user
            return ((ClaimsIdentity)User.Identity).FindFirst("user_name").Value;
        }

        private Int32 GetUserID()
        {
            // returns the ID of the logged in user
            return Int32.Parse(((ClaimsIdentity)User.Identity).FindFirst("user_id").Value);
        }

        private Int32 GetCourseID()
        {
            // returns the ID of course in which the IguideME instance is loaded
            return Int32.Parse(((ClaimsIdentity)User.Identity).FindFirst("course").Value);
        }

        private JObject ReadFile(string filename)
        {
            /*
             * Generic function to read local datastorage
             */ 
            using (StreamReader r = new StreamReader(filename))
            {
                string json = r.ReadToEnd();
                var items = (JObject)JsonConvert.DeserializeObject(json);
                return JObject.Parse(json);
            }
        }

        private String MakeResponse(object payload, object grades)
        {
            IDictionary<string, object> response = new Dictionary<string, object>();
            response.Add("payload", payload);
            response.Add("peer_comp", grades);

            return (string)JsonConvert.SerializeObject(response);
        }

        [HttpGet]
        public IEnumerable<string> Get()
            => canvasTest.GetStudents(GetCourseID());

        [Authorize]
        [HttpGet]
        [Route("/Account")]
        public async Task<string> GetAccount()
        {
            var auth = await HttpContext.AuthenticateAsync();
            return auth.Principal.Identity.Name;
        }

        [Authorize]
        [HttpGet]
        [Route("/Discussions")]
        public string GetDiscussions()
        {
            // returns all discussions posted by the logged in user
            return JsonConvert.SerializeObject(
                canvasTest.GetDiscussions(GetCourseID(), GetUserName())
            );
        }

        [Authorize]
        [HttpGet]
        [Route("/Quizzes")]
        public string GetQuizzes()
        {
            // returns all quizzes available to the logged in user
            return JsonConvert.SerializeObject(canvasTest.GetQuizzes(GetCourseID(), GetUserID()));
        }

        [Authorize]
        [HttpGet]
        [Route("/Submissions")]
        public string GetSubmissions()
        {
            // returns all obtained exam grades for the logged in user
            return MakeResponse(canvasTest.GetSubmissions(GetCourseID(), GetUserID()), canvasTest.GetAllSubmissionGrades(GetCourseID()));
        }

        [Authorize]
        [HttpPost, HttpGet]
        [Route("/Consent")]
        public int ConsentView()
        {
            var path = "store/consent.json";

            if (Request.Method == "POST")
            {
                // register the consent of the user
                var data = ReadFile(path);
                using (var reader = new StreamReader(Request.Body))
                {
                    // get answer and write to file
                    var body = new StreamReader(Request.Body).ReadToEnd();
                    data[GetUser()] = JObject.Parse(body)["granted"];
                    using (StreamWriter outputFile = new StreamWriter(path))
                        outputFile.Write(data);
                }
                return (int) data[GetUser()];
            } else {
                // get the consent of the logged in user
                using (StreamReader r = new StreamReader(path))
                {
                    string json = r.ReadToEnd();
                    var items = (JObject)JsonConvert.DeserializeObject(json);

                    // format consent; -1 means no answer has yet been given
                    if (!items.ContainsKey(GetUser())) return -1;
                    return ((bool)items[GetUser()] == true ? 1 : 0);
                }
            }
        }

        [Authorize]
        [HttpGet]
        [Route("/Attendance")]
        public string AttendanceView()
        {
            var data = ReadFile("store/attendance.json");
            List<object> registry = new List<object>();
            IDictionary<string, int> peers = new Dictionary<string, int>();

            foreach (var entry in data)
            {
                data[entry.Key].ToList().ForEach(x =>
                {
                    if (!peers.ContainsKey((string)x["studentnaam"]))
                        peers.Add((string)x["studentnaam"], ((string)x["aanwezig"]).ToLower() == "ja" ? 1 : 0);
                    else
                    {
                        if (((string)x["aanwezig"]).ToLower() == "ja")
                        {
                            peers[(string)x["studentnaam"]] += 1;
                        }
                    }
                });

                // add all attendance registries for the student
                var attendance = data[entry.Key].FirstOrDefault(x => (string) x["studentnaam"] == GetUserName());

                if (attendance != null) registry.Add(attendance);
            }

            return MakeResponse(registry, peers.Values.ToList());
        }

        [Authorize]
        [HttpGet]
        [Route("/Practice-sessions")]
        public string PracticeSessionsView()
        {
            var data = ReadFile("store/practice_sessions.json");
            List<object> registry = new List<object>();
            List<float> grades = new List<float>();

            foreach (var entry in data)
            {
                grades.AddRange(data[entry.Key].Select(x => float.Parse((string) x["grade"])));

                // get the practice session for the logged in user
                var attendance = data[entry.Key].First(x => (string) x["studentnaam"] == GetUserName());
                registry.Add(attendance);
            }

            return MakeResponse(registry, grades);
        }

        [Authorize]
        [HttpGet]
        [Route("/Perusall")]
        public string PerusallView()
        {
            var data = ReadFile("store/perusall.json");
            List<object> assignments = new List<object>();
            List<float> grades = new List<float>();

            foreach (var entry in data)
            {
                grades.AddRange(data[entry.Key].Select(a => float.Parse((string)a["grade"], CultureInfo.InvariantCulture)).ToList());

                // get the perusall assignment of the logged in user
                var assignment = data[entry.Key].First(x => (string) x["studentnaam"] == GetUserName());
                assignments.Add(assignment);
            }

            return MakeResponse(assignments, grades.ToArray());
        }

        [Authorize]
        [HttpGet]
        [Route("/Is-admin")]
        public Boolean IsAdminView()
        {
            return administrators.Contains(GetUser());
        }

        [Authorize]
        [HttpPost, HttpGet]
        [Route("/Admin-perusall")]
        public string AdminPerusallView()
        {
            if (!administrators.Contains(GetUser()))
                return "permission denied";

            if (Request.Method == "POST")
            {
                // new Perusall assignment has been posted
                var perusall = ReadFile("store/perusall.json");
                using (var reader = new StreamReader(Request.Body))
                {
                    // add posted data to the Perusall data on disk
                    var body = JObject.Parse(new StreamReader(Request.Body).ReadToEnd());
                    perusall[(string) body["key"]] = body["payload"];

                    using (StreamWriter outputFile = new StreamWriter("store/perusall.json"))
                        outputFile.Write(perusall);
                }
                return (string)JsonConvert.SerializeObject(perusall);
            }

            // return new Perusall state
            var data = ReadFile("store/perusall.json");
            return (string)JsonConvert.SerializeObject(data);
        }

        [Authorize]
        [HttpPost, HttpGet]
        [Route("/Admin-practice-sessions")]
        public string AdminPracticeSessionsView()
        {
            var path = "store/practice_sessions.json";
            if (!administrators.Contains(GetUser()))
                return "permission denied";

            if (Request.Method == "POST")
            {
                var practice_sessions = ReadFile(path);
                using (var reader = new StreamReader(Request.Body))
                {
                    var body = JObject.Parse(new StreamReader(Request.Body).ReadToEnd());
                    practice_sessions[(string)body["key"]] = body["payload"];

                    using (StreamWriter outputFile = new StreamWriter(path))
                        outputFile.Write(practice_sessions);
                }
                return (string)JsonConvert.SerializeObject(practice_sessions);
            }

            var data = ReadFile(path);
            return (string)JsonConvert.SerializeObject(data);
        }

        [Authorize]
        [HttpPost, HttpGet]
        [Route("/Admin-attendance")]
        public string AdminAttendanceView()
        {
            var path = "store/attendance.json";
            if (!administrators.Contains(GetUser()))
                return "permission denied";

            if (Request.Method == "POST")
            {
                var attendance = ReadFile(path);
                using (var reader = new StreamReader(Request.Body))
                {
                    var body = JObject.Parse(new StreamReader(Request.Body).ReadToEnd());
                    attendance[(string)body["key"]] = body["payload"];

                    using (StreamWriter outputFile = new StreamWriter(path))
                        outputFile.Write(attendance);
                }
                return (string)JsonConvert.SerializeObject(attendance);
            }

            var data = ReadFile(path);
            return (string)JsonConvert.SerializeObject(data);
        }
    }
}
