using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using IguideME.Web.Models;
using IguideME.Web.Models.App;
using IguideME.Web.Models.Service;
using IguideME.Web.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json.Linq;

namespace IguideME.Web.Controllers
{
    [Authorize]
    [ApiController]
    [Route("[controller]")]
    public class DataMartController : DataController
    {
        private readonly ILogger<DataController> _logger;
        private readonly CanvasTest canvasTest;
        private readonly IQueuedBackgroundService _queuedBackgroundService;
        private readonly IComputationJobStatusService _computationJobStatusService;

        public DataMartController(
            ILogger<DataController> logger,
            CanvasTest canvasTest,
            IQueuedBackgroundService queuedBackgroundService,
            IComputationJobStatusService computationJobStatusService) : base(
                logger, canvasTest, queuedBackgroundService, computationJobStatusService)
        {
            this._logger = logger;
            this.canvasTest = canvasTest;

            this._queuedBackgroundService = queuedBackgroundService;
            this._computationJobStatusService = computationJobStatusService;
        }


        // -------------------- Synchronization managers --------------------

        [Authorize(Policy = "IsInstructor")]
        [HttpPost, Route("/datamart/start-sync")]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status202Accepted, Type = typeof(JobCreatedModel))]
        public async Task<IActionResult> BeginComputation([FromBody] JobParametersModel obj)
        {
            obj.CourseID = this.GetCourseID();
            obj.Notifications_bool = false;
            return Accepted(
                await _queuedBackgroundService.PostWorkItemAsync(obj).ConfigureAwait(false)
            );
        }

        [Authorize(Policy = "IsInstructor")]
        [HttpGet, Route("/datamart/status")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(IReadOnlyDictionary<string, JobModel>))]
        public async Task<IActionResult> GetAllJobsAsync()
        {
            return Ok(await _computationJobStatusService.GetAllJobsAsync().ConfigureAwait(false));
        }

        [Authorize(Policy = "IsInstructor")]
        [HttpDelete, Route("/datamart/clear")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> ClearAllJobsAsync()
        {
            await _computationJobStatusService.ClearAllJobsAsync().ConfigureAwait(false);
            return Ok();
        }

        [Authorize(Policy = "IsInstructor")]
        [HttpGet, Route("/datamart/synchronizations")]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public JsonResult GetSynchronizations()
        {
            return Json(
                DatabaseManager.Instance.GetSyncHashes(this.GetCourseID()));
        }

        // -------------------- Synchronization registry --------------------

        [Authorize(Policy = "IsInstructor")]
        [HttpGet, Route("/datamart/hashes")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public JsonResult GetSyncHashes()
        {
            return Json(
                DatabaseManager.Instance.GetSyncHashes(this.GetCourseID()));
        }

        [Authorize(Policy = "IsInstructor")]
        [HttpGet, Route("/datamart/users")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public JsonResult GetUsers()
        {
            return Json(
                DatabaseManager.Instance.GetUsers(this.GetCourseID()));
        }

        [Authorize]
        [HttpGet, Route("/datamart/predictions/{userID}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public ActionResult GetUserPredictions(string userID)
        {
            if (!this.IsAdministrator() && "self" != userID && userID != GetUserID())
                return Unauthorized();

            return Json(
                DatabaseManager.Instance
                    .GetPredictedGrades(
                        GetCourseID(),
                        userID == "self" ? GetUserID() : userID));
        }

        [Authorize]
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [Route("/datamart/consent")]
        public JsonResult GetConsent()
        {
            if (this.IsAdministrator()) return Json(1);

            return Json(
                DatabaseManager.Instance.GetConsent(
                    GetCourseID(), GetUserID()));
        }

        [Authorize]
        [HttpPost]
        [Route("/datamart/consent")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public JsonResult PostConsent()
        {
            var body = new StreamReader(Request.Body).ReadToEnd();
            ConsentData consent = new ConsentData(
                GetCourseID(),
                GetUserID(),
                GetUserName(),
                (int)JObject.Parse(body)["granted"]
            );
            DatabaseManager.Instance.SetConsent(consent);
            return Json(consent.Granted);
        }

        [Authorize]
        [HttpGet]
        [Route("/Is-admin")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public Boolean IsAdminView()
        {
            return IsAdministrator();
        }

        [Authorize(Policy = "IsInstructor")]
        [HttpGet]
        [Route("/Students")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public ActionResult GetStudents()
        {
            return Json(
                DatabaseManager.Instance.GetUsers(this.GetCourseID())
                .ToArray());
        }

        [Authorize(Policy = "IsInstructor")]
        [HttpGet]
        [Route("/Consents")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public ActionResult GetConsents()
        {
            return Json(
                DatabaseManager.Instance.GetConsents(this.GetCourseID())
                .ToArray());
        }

        [Authorize(Policy = "IsInstructor")]
        [HttpGet]
        [Route("/submissions")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public ActionResult GetSubmissions()
        {
            return Json(
                DatabaseManager.Instance.GetCourseSubmissions(GetCourseID()));
        }

        [Authorize(Policy = "IsInstructor")]
        [HttpGet]
        [Route("/goal-grades")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public ActionResult GetGoalGrades()
        {
            // returns all goal grades
            return Json(
                DatabaseManager.Instance.GetGoalGrades(
                    this.GetCourseID()));
        }

        [Authorize]
        [HttpGet]
        [Route("/goal-grade/{userID}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public ActionResult GetGoalGrade(string userID)
        {
            if (this.GetUserID() != userID &&
                !this.IsAdministrator())
                return Unauthorized();

            // returns the goal grade for the logged in user
            return Json(
                DatabaseManager.Instance.GetUserGoalGrade(
                    this.GetCourseID(),
                    userID));
        }

        [Authorize]
        [HttpGet]
        [Route("/goal-grade")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public ActionResult GetGoalGrade()
        {
            // returns the goal grade for the logged in user
            return Json(
                DatabaseManager.Instance.GetUserGoalGrade(
                    this.GetCourseID(),
                    this.GetUserID()));
        }

        [Authorize]
        [HttpPost]
        [Route("/goal-grade")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public ActionResult UpdateGoalGrade()
        {
            var body = new StreamReader(Request.Body).ReadToEnd();
            DatabaseManager.Instance.UpdateUserGoalGrade(
                    this.GetCourseID(),
                    this.GetUserID(),
                    (int)JObject.Parse(body)["goal_grade"]);

            return Json(
                DatabaseManager.Instance.GetUserGoalGrade(
                    this.GetCourseID(),
                    this.GetUserID()));
        }

        // -------------------- Canvas registry --------------------

        [Authorize(Policy = "IsInstructor")]
        [HttpGet]
        [Route("/datamart/canvas/assignments")]
        public ActionResult GetCanvasAssignments()
        {
            return Json(
                DatabaseManager.Instance.GetAssignments(GetCourseID())
            );
        }

        [Authorize(Policy = "IsInstructor")]
        [HttpGet]
        [Route("/datamart/canvas/discussions")]
        public ActionResult GetCanvasDiscussions()
        {
            int course_id = this.GetCourseID();

            List<AppDiscussion> discussions = DatabaseManager.Instance.GetDiscussions(course_id);

            foreach (AppDiscussion discussion in new List<AppDiscussion>(discussions)) {
                discussions.AddRange(DatabaseManager.Instance.GetDiscussionEntries(course_id,
                    discussion.DiscussionID));
                discussions.AddRange(DatabaseManager.Instance.GetDiscussionReplies(course_id,
                    discussion.DiscussionID));
            }
            return Json(
                discussions
            );
        }

        // -------------------- User notifications --------------------
        [Authorize(Policy = "IsInstructor")]
        [HttpGet]
        [Route("/datamart/notifications")]
        public ActionResult GetCourseNotifications()
        {
            return Json(DatabaseManager.Instance.GetAllNotifications(GetCourseID()));
        }

        [Authorize]
        [HttpGet]
        [Route("/datamart/notifications/{userID}")]
        public ActionResult GetNotifications(string userID)
        {
            if (!this.IsAdministrator() && userID != GetUserID())
                return Unauthorized();

            return Json(
                DatabaseManager.Instance.GetPendingNotifications(
                    GetCourseID(), userID)
            );
        }

        // -------------------- Accept List --------------------

        [Authorize(Policy = "IsInstructor")]
        [HttpPost]
        [Route("/datamart/accept-list")]
        public ActionResult CreateAcceptList([FromBody] AcceptList[] acceptList)
        {
            DatabaseManager.Instance.ResetAcceptList(GetCourseID());

            foreach (AcceptList list in acceptList)
            {
                DatabaseManager.Instance.RegisterAcceptedStudent(
                    GetCourseID(),
                    list.UserID,
                    list.Accepted);
            }

            return Json(
                DatabaseManager.Instance.GetAcceptList(GetCourseID())
            );
        }

        [Authorize(Policy = "IsInstructor")]
        [HttpPatch]
        [Route("/datamart/accept-list")]
        public ActionResult UpdateAcceptList()
        {
            var body = new StreamReader(Request.Body).ReadToEnd();
            DatabaseManager.Instance.SetAcceptListRequired(
                GetCourseID(),
                (bool)JObject.Parse(body)["enabled"]);
            return Json((bool)JObject.Parse(body)["enabled"]);
        }

        [Authorize(Policy = "IsInstructor")]
        [HttpGet]
        [Route("/datamart/accept-list")]
        public ActionResult GetAcceptList()
        {
            return Json(
                DatabaseManager.Instance.GetAcceptList(GetCourseID())
            );
        }

        [Authorize]
        [HttpGet]
        [Route("/datamart/accept-list/{userID}")]
        public ActionResult GetAcceptListByStudent(string userID)
        {
            var course = DatabaseManager.Instance.GetPublicInformedConsent(GetCourseID());

            if (!course.AcceptList || IsAdministrator()) return Json(true);

            AcceptList student = DatabaseManager.Instance
                .GetAcceptList(GetCourseID())
                .Find(x => x.UserID == (userID == "self" ? GetUserID() : userID));

            return Json(
                student != null && student.Accepted
            );
        }
    }
}
