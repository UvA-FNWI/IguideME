using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using IguideME.Web.Models.Service;
using IguideME.Web.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using UserRoles = IguideME.Web.Models.Impl.UserRoles;

namespace IguideME.Web.Controllers
{
    [Authorize]
    [ApiController]
    [Route("[controller]")]
    public class DataMartController : DataController
    {
        private readonly ILogger<DataController> _logger;
        private readonly DatabaseManager _databaseManager;

        private readonly IQueuedBackgroundService _queuedBackgroundService;
        private readonly IComputationJobStatusService _computationJobStatusService;

        public DataMartController(
            ILogger<DataController> logger,
            DatabaseManager databaseManager,
            IQueuedBackgroundService queuedBackgroundService,
            IComputationJobStatusService computationJobStatusService
        )
            : base(logger)
        {
            this._logger = logger;
            this._databaseManager = databaseManager;

            this._queuedBackgroundService = queuedBackgroundService;
            this._computationJobStatusService = computationJobStatusService;
        }

        // -------------------- Synchronization managers --------------------

        // [Authorize(Policy = "IsInstructor")]
        // [HttpPost, Route("/datamart/test")]
        // [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        // public void LogDBTable()
        // {
        //     var body = new StreamReader(Request.Body).ReadToEnd();

        //     _databaseManager.LogTable(JObject.Parse(body)["name"].ToString());
        // }

        // TODO: move to different controller (+ change route)
        [Route("/app/setup")]
        [HttpPost]
        public async void SetupCourse()
        {
            if (!_databaseManager.IsCourseRegistered(GetCourseID()))
            {
                _databaseManager.RegisterCourse(GetCourseID(), GetCourseTitle());
                JobParametersModel obj =
                    new() { CourseID = GetCourseID(), SendNotifications = false };
                await _queuedBackgroundService.PostWorkItemAsync(obj).ConfigureAwait(false);
            }
        }

        [Authorize(Policy = "IsInstructor")]
        [HttpPost, Route("/datamart/start-sync")]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status202Accepted, Type = typeof(JobCreatedModel))]
        public async Task<IActionResult> BeginComputation([FromBody] JobParametersModel obj)
        {
            obj.CourseID = this.GetCourseID();
            obj.SendNotifications = false;
            return Accepted(
                await _queuedBackgroundService.PostWorkItemAsync(obj).ConfigureAwait(false)
            );
        }

        [Authorize(Policy = "IsInstructor")]
        [HttpPost, Route("/datamart/stop-sync")]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status202Accepted, Type = typeof(JobCreatedModel))]
        public IActionResult StopComputation([FromBody] JobParametersModel obj)
        {
            //TODO: ComputationJobStatusSevice.cs
            return Accepted();
        }

        [Authorize(Policy = "IsInstructor")]
        [HttpGet, Route("/datamart/status")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(
            StatusCodes.Status200OK,
            Type = typeof(IReadOnlyDictionary<string, JobModel>)
        )]
        public async Task<IActionResult> GetAllJobsAsync()
        {
            return Ok(await _computationJobStatusService.GetAllJobsAsync().ConfigureAwait(false));
        }

        // [Authorize(Policy = "IsInstructor")]
        // [HttpDelete, Route("/datamart/clear")]
        // [ProducesResponseType(StatusCodes.Status200OK)]
        // [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        // public async Task<IActionResult> ClearAllJobsAsync()
        // {
        //     await _computationJobStatusService.ClearAllJobsAsync().ConfigureAwait(false);
        //     return Ok();
        // }

        [Authorize(Policy = "IsInstructor")]
        [HttpGet, Route("/datamart/synchronizations")]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public JsonResult GetSynchronizations()
        {
            return Json(_databaseManager.GetSyncHashes(this.GetCourseID()));
        }

        // -------------------- Synchronization registry --------------------

        // [Authorize(Policy = "IsInstructor")]
        // [HttpGet, Route("/datamart/users")]
        // [ProducesResponseType(StatusCodes.Status200OK)]
        // [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        // public JsonResult GetUsers()
        // {
        //     return Json(
        //         _databaseManager.GetUsers(this.GetCourseID()));
        // }

        // TODO: move to different controller + url
        // [Authorize]
        // [HttpGet, Route("/datamart/predictions/{userID}")]
        // [ProducesResponseType(StatusCodes.Status200OK)]
        // [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        // public ActionResult GetUserPredictions(string userID)
        // {
        //     return !this.IsAdministrator() && "self" != userID && userID != GetUserID()
        //         ? Unauthorized()
        //         : Json(
        //         _databaseManager
        //             .GetPredictedGrades(
        //                 GetCourseID(),
        //                 userID == "self" ? GetUserID() : userID));
        // }

        // [Authorize]
        // [HttpGet]
        // [ProducesResponseType(StatusCodes.Status200OK)]
        // [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        // [Route("/datamart/consent")]
        // // DBrefTODO: This was a ConsentData item, now it is just a bool wit the result
        // public JsonResult GetConsent()
        // {
        //     return this.IsAdministrator()
        //         ? Json(1)
        //         : Json(
        //         _databaseManager.GetUserConsent(
        //             GetCourseID(), GetUserID()));
        // }

        // [Authorize]
        // [HttpPost]
        // [Route("/datamart/consent")]
        // [ProducesResponseType(StatusCodes.Status200OK)]
        // [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        // public JsonResult PostConsent()
        // {
        //     var body = new StreamReader(Request.Body).ReadToEnd();
        //     ConsentData consent = new(
        //         GetCourseID(),
        //         GetUserID(),
        //         (int)JObject.Parse(body)["granted"]
        //     );
        //     _databaseManager.SetUserConsent(consent, this.GetHashCode());
        //     return Json(consent.Granted);
        // }

        // TODO: move to different controller.
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
        [Route("/students")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public ActionResult GetStudents()
        {
            return Json(
                _databaseManager
                    .GetUsersWithGrantedConsent(this.GetCourseID(), UserRoles.student)
                    .ToArray()
            );
        }

        [Authorize(Policy = "IsInstructor")]
        [HttpGet]
        [Route("/students/settings")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public ActionResult GetStudentsWithSettings()
        {
            return Json(
                _databaseManager
                    .GetUsersWithSettings(this.GetCourseID(), UserRoles.student)
                    .ToArray()
            );
        }

        // [Authorize(Policy = "IsInstructor")]
        // [HttpGet]
        // [Route("/Consents")]
        // [ProducesResponseType(StatusCodes.Status200OK)]
        // [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        // DBrefTODO: This is useless now, we have the GetGoalGrades() that substitutes this
        // public ActionResult GetConsents()
        // {
        //     return Json(
        //         _databaseManager.GetConsents(this.GetCourseID(), GetHashCode())
        //         .ToArray());
        // }

        // [Authorize(Policy = "IsInstructor")]
        // [HttpGet]
        // [Route("/submissions")]
        // [ProducesResponseType(StatusCodes.Status200OK)]
        // [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        // public ActionResult GetSubmissions()
        // {
        //     return Json(
        //         _databaseManager.GetCourseSubmissions(GetCourseID()));
        // }

        // [Authorize(Policy = "IsInstructor")]
        // [HttpGet]
        // [Route("/goal-grades")]
        // [ProducesResponseType(StatusCodes.Status200OK)]
        // [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        // // DBrefTODO: We used to return GoalGrade type, now it's User type entity
        // public ActionResult GetGoalGrades()
        // {
        //     // returns all users along with their goal grades
        //     return Json(
        //         _databaseManager.GetUsers(
        //             this.GetCourseID(),
        //             UserRoles.student));
        // }

        // [Authorize]
        // [HttpGet]
        // [Route("/goal-grade/{userID}")]
        // [ProducesResponseType(StatusCodes.Status200OK)]
        // [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        // public ActionResult GetGoalGrade(string userID)
        // {
        //     if (this.GetUserID() != userID &&
        //         !this.IsAdministrator())
        //         return Unauthorized();

        //     // returns the goal grade for the logged in user
        //     return Json(
        //         _databaseManager.GetUserGoalGrade(
        //             this.GetCourseID(),
        //             userID,
        //             this.GetHashCode()));
        // }

        // [Authorize]
        // [HttpGet]
        // [Route("/goal-grade")]
        // [ProducesResponseType(StatusCodes.Status200OK)]
        // [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        // public ActionResult GetGoalGrade()
        // {
        //     // returns the goal grade for the logged in user
        //     return Json(
        //         _databaseManager.GetUserGoalGrade(
        //             this.GetCourseID(),
        //             this.GetUserID(),
        //             this.GetHashCode()));
        // }

        // [Authorize]
        // [HttpPost]
        // [Route("/goal-grade")]
        // [ProducesResponseType(StatusCodes.Status200OK)]
        // [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        // public ActionResult UpdateGoalGrade()
        // {
        //     var body = new StreamReader(Request.Body).ReadToEnd();
        //     _databaseManager.UpdateUserSettings(
        //             this.GetCourseID(),
        //             this.GetUserID(),
        //             (int)JObject.Parse(body)["goal_grade"],
        //             null,
        //             null,
        //             null,
        //             0
        //         );

        //     return Json(
        //         _databaseManager.GetUserGoalGrade(
        //             this.GetCourseID(),
        //             this.GetUserID(),
        //             this.GetHashCode()));
        // }

        // -------------------- Canvas registry --------------------

        // TODO: move to different controller.
        [Authorize(Policy = "IsInstructor")]
        [HttpGet]
        [Route("/assignments")]
        public ActionResult GetCanvasAssignments()
        {
            return Json(_databaseManager.GetAssignmentsMap(GetCourseID()));
        }

        // TODO: move to different controller.
        // [Authorize(Policy = "IsInstructor")]
        // [HttpGet]
        // [Route("/datamart/discussions")]
        // public ActionResult GetDiscussions()
        // {
        //     int course_id = this.GetCourseID();

        //     List<AppDiscussion> discussions = _databaseManager.GetDiscussions(course_id);

        //     foreach (AppDiscussion discussion in new List<AppDiscussion>(discussions))
        //     {
        //         discussions.AddRange(_databaseManager.GetDiscussionEntries(
        //             discussion.ID));
        //         discussions.AddRange(_databaseManager.GetDiscussionReplies(
        //             discussion.ID));
        //     }
        //     return Json(
        //         discussions
        //     );
        // }

        // TODO: move to different controller.
        [Authorize(Policy = "IsInstructor")]
        [HttpGet]
        [Route("/topics")]
        public ActionResult GetCanvasTopics()
        {
            return Json(_databaseManager.GetDiscussions(this.GetCourseID()));
        }

        // -------------------- User notifications --------------------
        // [Authorize(Policy = "IsInstructor")]
        // [HttpGet]
        // [Route("/datamart/notifications")]
        // public ActionResult GetCourseNotifications()
        // {
        //     return Json(_databaseManager.GetAllNotifications(GetCourseID()));
        // }

        // [Authorize]
        // [HttpGet]
        // [Route("/datamart/notifications/{userID}")]
        // public ActionResult GetNotifications(string userID)
        // {
        //     return !this.IsAdministrator() && userID != GetUserID()
        //         ? Unauthorized()
        //         : Json(
        //         _databaseManager.GetPendingNotifications(
        //             GetCourseID(), userID, GetHashCode())
        //     );
        // }

        ///////////////////////////////////////////////////////////////////////////////////////////////
        // -------------------- Accept List --------------------

        // [Authorize(Policy = "IsInstructor")]
        // [HttpPost]
        // [Route("/datamart/accept-list")]
        // public ActionResult CreateAcceptList([FromBody] AcceptList[] acceptList)
        // {
        //     _databaseManager.ResetAcceptList(GetCourseID());

        //     foreach (AcceptList list in acceptList)
        //     {
        //         _databaseManager.RegisterAcceptedStudent(
        //             GetCourseID(),
        //             list.UserID,
        //             list.Accepted);
        //     }

        //     return Json(
        //         _databaseManager.GetAcceptList(GetCourseID())
        //     );
        // }

        // [Authorize(Policy = "IsInstructor")]
        // [HttpPatch]
        // [Route("/datamart/accept-list")]
        // public ActionResult UpdateAcceptList()
        // {
        //     var body = new StreamReader(Request.Body).ReadToEnd();
        //     _databaseManager.SetAcceptListRequired(
        //         GetCourseID(),
        //         (bool)JObject.Parse(body)["enabled"]);
        //     return Json((bool)JObject.Parse(body)["enabled"]);
        // }

        // [Authorize(Policy = "IsInstructor")]
        // [HttpGet]
        // [Route("/datamart/accept-list")]
        // public ActionResult GetAcceptList()
        // {
        //     return Json(
        //         _databaseManager.GetAcceptList(GetCourseID())
        //     );
        // }

        // [Authorize]
        // [HttpGet]
        // [Route("/datamart/accept-list/{userID}")]
        // public ActionResult GetAcceptListByStudent(string userID)
        // {
        //     var course = _databaseManager.GetPublicInformedConsent(GetCourseID());

        //     // if (!course.AcceptList || IsAdministrator()) return Json(true);
        //     if (IsAdministrator()) return Json(true);

        //     AcceptList student = _databaseManager
        //         .GetAcceptList(GetCourseID())
        //         .Find(x => x.UserID == (userID == "self" ? GetUserID() : userID));

        //     return Json(
        //         student != null && student.Accepted
        //     );
        // }
    }
}
