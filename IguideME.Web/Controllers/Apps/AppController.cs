using System.Collections.Generic;
using System.IO;

using IguideME.Web.Models.App;
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
    public class AppController : DataController
    {
        private readonly ILogger<DataController> _logger;
        private readonly CanvasHandler _canvasHandler;

        private readonly DatabaseManager _databaseManager;

        public AppController(
            ILogger<DataController> logger,
            CanvasHandler canvasHandler,
            DatabaseManager databaseManager) : base(
                logger, canvasHandler, databaseManager)
        {
            this._logger = logger;
            this._canvasHandler = canvasHandler;
            this._databaseManager = databaseManager;

        }

        // [Authorize(Policy = "IsInstructor")]
        [Route("/app/setup")]
        [HttpPost]
        public void SetupCourse() {
            if (!_databaseManager.IsCourseRegistered(GetCourseID()))
                _databaseManager.RegisterCourse(GetCourseID(), GetCourseTitle());
        }

        [Authorize]
        [Route("/app/self")]
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public ActionResult GetSelf()
        {
            /**
             * Returns information of the logged in user.
             */
            Models.Impl.User user = _databaseManager.GetUser(this.GetUserID());
            user.CourseID = GetCourseID();
            return Json(
                user
            );
        }

        [Authorize(Policy = "IsInstructor")]
        [HttpGet]
        [Route("/app/notification/{userID}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public ActionResult GetNotificationEnable(string userID)
        {

            return Json(
                _databaseManager.GetNotificationEnable(
                    this.GetCourseID(),
                    userID,
                    this.GetHashCode()));
        }

// What is the difference between these two ?????
        [Authorize]
        [HttpGet]
        [Route("/app/notification")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public ActionResult GetNotificationEnable()
        {
            return Json(
                _databaseManager.GetNotificationEnable(
                    this.GetCourseID(),
                    this.GetUserID(),
                    this.GetHashCode()));
        }

        [Authorize]
        [HttpPost]
        [Route("/app/notification")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public ActionResult UpdateNotificationEnable()
        {
            var body = new StreamReader(Request.Body).ReadToEnd();
            _databaseManager.UpdateNotificationEnable(
                    this.GetCourseID(),
                    this.GetUserID(),
                    (bool) JObject.Parse(body)["enable"],
                    this.GetHashCode()
                    );

            return Json(
                _databaseManager.GetNotificationEnable(
                    this.GetCourseID(),
                    this.GetUserID(),
                    this.GetHashCode()));
        }

        [Authorize]
        [Route("/app/course")]
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public ActionResult GetConsent()
        {
            /**
             * Provide wether the informed consent is mandatory and the informed
             * consent text (may be null). Caution: if informed consent is
             * mandatory and no informed consent text is provided student's
             * won't be able to accept or decline the terms, and thus nobody
             * is able to use the application.
             */

            PublicInformedConsent consent = _databaseManager
                .GetPublicInformedConsent(GetCourseID());

            // Check if consent exists
            return consent == null ? BadRequest() : Json(consent);
        }

        [Authorize(Policy = "IsInstructor")]
        [Route("/app/consent")]
        [HttpPatch]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public ActionResult PatchConsent([FromBody] PublicInformedConsent obj)
        {
            /**
             * Endpoint is used to allow instructors to change the informed
             * consent policy for their course.
             */
            _databaseManager.UpdateInformedConsent(
                GetCourseID(), obj.Text);

            // return newly fetched consent object
            return Json(
                _databaseManager
                .GetPublicInformedConsent(GetCourseID()));
        }

        [Authorize(Policy = "IsInstructor")]
        [Route("/app/peer-groups")]
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public ActionResult GetCoursePeerGroups()
        {
            PeerGroup peerGroup = _databaseManager
                .GetPeerGroup(GetCourseID());

            // Check if consent exists
            return peerGroup != null ? Json(peerGroup) : NotFound();
        }

        [Authorize(Policy = "IsInstructor")]
        [Route("/app/peer-groups")]
        [HttpPatch]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public ActionResult PatchCoursePeerGroups([FromBody] PeerGroup obj)
        {
            /**
             * Endpoint is used to allow instructors to change the informed
             * consent policy for their course.
             */
            _databaseManager.UpdateCoursePeerGroups(
                GetCourseID(), obj.MinSize);

            // return newly fetched consent object
            return Json(
               _databaseManager
                .GetPeerGroup(GetCourseID()));
        }


        // TODO: check if possible to have separate routes for seperate authorizes.
        [Authorize]
        [Route("/app/track")]
        [HttpPost]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public ActionResult TrackAction()
        {
            if (this.IsAdministrator()) return Json("");

            var body = new StreamReader(Request.Body).ReadToEnd();
            string action = (string) JObject.Parse(body)["action"];

            _databaseManager.TrackUserAction(
                    this.GetUserID(),
                    action
                    );

            return Json("");
        }



        [Authorize(Policy = "IsInstructor")]
        [Route("/app/notifications")]
        [HttpPost]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public ActionResult UpdateNotificationDates()
        {
            int courseID = this.GetCourseID();

            var body = new StreamReader(Request.Body).ReadToEnd();
            string dates = (string) JObject.Parse(body)["dates"];

            _databaseManager.UpdateNotificationDates(
                courseID,
                dates);

            return Json("");
            // return Json(
            //     _databaseManager
            //     .GetNotificationDates(GetCourseID()));
        }


        [Authorize(Policy = "IsInstructor")]
        [Route("/app/notifications")]
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public ActionResult GetNotificationDates()
        {
            List<string> allDates = _databaseManager.GetNotificationDates(GetCourseID());

            return allDates != null ? Json(allDates) : NotFound();
        }
    }
}
