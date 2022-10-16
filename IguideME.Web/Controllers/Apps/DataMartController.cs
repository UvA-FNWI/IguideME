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
        private readonly ILogger<DataController> logger;
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
            this.logger = logger;
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
        [HttpGet, Route("/datamart/predictions/{userLoginID}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public ActionResult GetUserPredictions(string userLoginID)
        {
            if ("self" != userLoginID &&
                !this.IsAdministrator() && userLoginID != GetUserLoginID())
                return Unauthorized();

            return Json(
                DatabaseManager.Instance
                    .GetPredictedGrades(
                        GetCourseID(),
                        userLoginID == "self" ? GetUserLoginID() : userLoginID));
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
                GetUserLoginID(),
                GetUserName(),
                (int)JObject.Parse(body)["granted"]
            );
            logger.LogInformation("Setting consent: " + JObject.Parse(body)["granted"]);
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
        [Route("/Submissions")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public ActionResult GetSubmissions()
        {
            // returns all obtained exam grades for the logged in user
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
        [Route("/goal-grade")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public ActionResult GetGoalGrade()
        {
            // returns the goal grade for the logged in user
            return Json(
                DatabaseManager.Instance.GetUserGoalGrade(
                    this.GetCourseID(),
                    this.GetUserLoginID()));
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
                    this.GetUserLoginID(),
                    (int)JObject.Parse(body)["goal_grade"]);

            // returns all obtained exam grades for the logged in user
            return Json(
                DatabaseManager.Instance.GetUserGoalGrade(
                    this.GetCourseID(),
                    this.GetUserLoginID()));
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
            return Json(
                DatabaseManager.Instance.GetDiscussions(GetCourseID())
            );
        }

        // -------------------- User notifications --------------------

        [Authorize]
        [HttpGet]
        [Route("/datamart/notifications/{userLoginID}")]
        public ActionResult GetNotifications(string userLoginID)
        {
            if (!this.IsAdministrator() && userLoginID != GetUserLoginID())
                return Unauthorized();

            return Json(
                DatabaseManager.Instance.GetPendingNotifications(
                    GetCourseID(), userLoginID)
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
                    list.StudentLoginID,
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
        [Route("/datamart/accept-list/{studentLoginID}")]
        public ActionResult GetAcceptListByStudent(string studentLoginID)
        {
            var course = DatabaseManager.Instance.GetPublicInformedConsent(GetCourseID());

            if (!course.AcceptList || IsAdministrator()) return Json(true);

            AcceptList student = DatabaseManager.Instance
                .GetAcceptList(GetCourseID())
                .Find(x => x.StudentLoginID == (studentLoginID == "self" ? GetUserLoginID() : studentLoginID));

            return Json(
                student != null ? student.Accepted : false
            );
        }
    }
}
