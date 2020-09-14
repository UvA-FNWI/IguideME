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
using IguideME.Web.Models;
using UvA.DataNose.Connectors.Canvas;

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
        private readonly string[] administrators = new string[3] { "testscience158-tst", "nzupanc1", "evvliet1" };

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

        private String MakeResponse(object payload, float[] grades)
        {
            IDictionary<string, object> response = new Dictionary<string, object>();
            response.Add("payload", payload);
            response.Add("peer_comp", new PeerComparisonData(grades));

            return (string) JsonConvert.SerializeObject(response);
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
            if (Request.Method == "POST")
            {
                var body = new StreamReader(Request.Body).ReadToEnd();
                ConsentData consent = new ConsentData(GetCourseID(), GetUserID(), (int) JObject.Parse(body)["granted"]);
                DatabaseManager.Instance.SetConsent(consent);
                return consent.Granted;
            } else {
                return DatabaseManager.Instance.GetConsent(GetCourseID(), GetUserID());
            }
        }

        [Authorize]
        [HttpGet]
        [Route("/Attendance")]
        public string AttendanceView()
        {
            IDictionary<string, float> peers = new Dictionary<string, float>();
            var attendance = DatabaseManager.Instance.GetAttendance(GetCourseID(), null);

            foreach (var entry in attendance)
            {
                if (!peers.ContainsKey(entry.UserName))
                {
                    peers.Add(entry.UserName, (entry.Present.ToLower() == "ja" ? 1 : 0));
                } else if (entry.Present.ToLower() == "ja")
                {
                    peers[entry.UserName] += 1;
                }
            }

            return MakeResponse(attendance.Where(x => x.UserName == GetUserName()), peers.Values.ToArray());
        }

        [Authorize]
        [HttpGet]
        [Route("/Practice-sessions")]
        public string PracticeSessionsView()
        {
            var sessions = DatabaseManager.Instance.GetPracticeSessions(GetCourseID(), null);
            var grades = sessions.Select(x => x.Grade);
            return MakeResponse(sessions.Where(x => x.UserName == GetUserName()), grades.ToArray());
        }

        [Authorize]
        [HttpGet]
        [Route("/Perusall")]
        public string PerusallView()
        {
            var assignments = DatabaseManager.Instance.GetPerusall(GetCourseID(), null);
            var grades = assignments.Select(x => x.Grade);
            return MakeResponse(assignments.Where(x => x.UserName == GetUserName()), grades.ToArray());
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
        public PerusallData[] AdminPerusallView()
        {
            if (!administrators.Contains(GetUser()))
                return null;

            if (Request.Method == "POST")
            {
                using (var reader = new StreamReader(Request.Body))
                {
                    var body = JObject.Parse(new StreamReader(Request.Body).ReadToEnd());
                    List<PerusallData> sessions = JsonConvert.DeserializeObject<List<PerusallData>>(body["payload"].ToString());
                    DatabaseManager.Instance.AddPerusall(GetCourseID(), (string)body["key"], sessions.ToArray());
                    return sessions.ToArray();
                }
            }

            return DatabaseManager.Instance.GetPerusall(GetCourseID(), null);
        }

        [Authorize]
        [HttpPost, HttpGet]
        [Route("/Admin-practice-sessions")]
        public PracticeSessionData[] AdminPracticeSessionsView()
        {
            if (!administrators.Contains(GetUser()))
                return null;

            if (Request.Method == "POST")
            {
                using (var reader = new StreamReader(Request.Body))
                {
                    var body = JObject.Parse(new StreamReader(Request.Body).ReadToEnd());
                    List<PracticeSessionData> sessions = JsonConvert.DeserializeObject<List<PracticeSessionData>>(body["payload"].ToString());
                    DatabaseManager.Instance.AddPracticeSession(GetCourseID(), (string) body["key"], sessions.ToArray());
                    return sessions.ToArray();
                }
            }

            return DatabaseManager.Instance.GetPracticeSessions(GetCourseID(), null);
        }

        [Authorize]
        [HttpPost, HttpGet]
        [Route("/Admin-attendance")]
        public AttendanceData[] AdminAttendanceView()
        {
            if (!administrators.Contains(GetUser()))
                return null;

            if (Request.Method == "POST")
            {
                using (var reader = new StreamReader(Request.Body))
                {
                    var body = JObject.Parse(new StreamReader(Request.Body).ReadToEnd());
                    List<AttendanceData> attendance = JsonConvert.DeserializeObject<List<AttendanceData>>(body["payload"].ToString());
                    DatabaseManager.Instance.AddAttendance(GetCourseID(), (string) body["key"], attendance.ToArray());
                    return attendance.ToArray();
                }
            }

            return DatabaseManager.Instance.GetAttendance(GetCourseID(), null);
        }
    }
}
