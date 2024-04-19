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

        private readonly DatabaseManager _databaseManager;

        public AppController(ILogger<DataController> logger, DatabaseManager databaseManager)
            : base(logger)
        {
            this._logger = logger;
            this._databaseManager = databaseManager;
        }

        [Authorize]
        [Route("/app/self")]
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public ActionResult GetSelf()
        {
            /**
             * Returns information of the logged in user.
             */
            return Json(_databaseManager.GetUser(GetCourseID(), GetUserID()));
        }

        [Authorize]
        [HttpPost]
        [Route("/student/settings/notifications")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public void UpdateNotificationEnable()
        {
            var body = new StreamReader(Request.Body).ReadToEnd();
            _databaseManager.UpdateUserSettings(
                    this.GetCourseID(),
                    this.GetUserID(),
                    null,
                    null,
                    null,
                    null,
                    (bool)JObject.Parse(body)["enabled"],
                    0
                    );
        }

        [Authorize]
        [HttpPost]
        [Route("/student/settings/consent")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public void UpdateConsent()
        {
            var body = new StreamReader(Request.Body).ReadToEnd();
            _databaseManager.UpdateUserSettings(
                    this.GetCourseID(),
                    this.GetUserID(),
                    (bool)JObject.Parse(body)["enabled"],
                    null,
                    null,
                    null,
                    null,
                    0
                    );
        }

        [Authorize]
        [HttpPost]
        [Route("/student/settings/goal-grade")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public void UpdateGoalGrade()
        {
            var body = new StreamReader(Request.Body).ReadToEnd();
            _databaseManager.UpdateUserSettings(
                    this.GetCourseID(),
                    this.GetUserID(),
                    null,
                    (int)JObject.Parse(body)["grade"],
                    null,
                    null,
                    null,
                    0
                    );
        }

        [Authorize(Policy = "IsInstructor")]
        [Route("/student/{id}")]
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public ActionResult GetStudent(string id)
        {
            /**
             * Returns information of the user with the given id.
             */
            return Json(_databaseManager.GetUser(GetCourseID(), id));
        }

        [HttpGet]
        [Route("/app/notifications/{userID}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public ActionResult GetNotifications(string userID)
        {
            if (userID == GetUserID() || IsAdministrator())
            {
                return Json(
                    _databaseManager.GetAllUserNotifications(GetCourseID(), userID, GetHashCode())
                );
            }
            else
            {
                return Unauthorized();
            }
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

            PublicInformedConsent consent = _databaseManager.GetPublicInformedConsent(
                GetCourseID()
            );

            // Check if consent exists
            return consent == null ? BadRequest() : Json(consent);
        }

        // [Authorize(Policy = "IsInstructor")]
        // [Route("/app/consent")]
        // [HttpPatch]
        // [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        // [ProducesResponseType(StatusCodes.Status400BadRequest)]
        // [ProducesResponseType(StatusCodes.Status200OK)]
        // public ActionResult PatchConsent([FromBody] PublicInformedConsent obj)
        // {
        //     /**
        //      * Endpoint is used to allow instructors to change the informed
        //      * consent policy for their course.
        //      */
        //     _databaseManager.UpdateInformedConsent(
        //         GetCourseID(), obj.Text, this.GetHashCode());

        //     // return newly fetched consent object
        //     return Json(
        //         _databaseManager
        //         .GetPublicInformedConsent(GetCourseID()));
        // }

        [Authorize(Policy = "IsInstructor")]
        [Route("/app/peer-groups")]
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public ActionResult GetCoursePeerGroups()
        {
            // TODO: change this url and the function names, they aren't very intuitive.
            PeerGroup peerGroup = _databaseManager.GetPeerGroup(GetCourseID());

            // Check if consent exists
            return peerGroup != null ? Json(peerGroup) : NotFound();
        }

        [Authorize(Policy = "IsInstructor")]
        [Route("/app/peer-groups")]
        [HttpPatch]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public void PatchCoursePeerGroups([FromBody] PeerGroup obj)
        {
            /**
             * Endpoint is used to allow instructors to change the informed
             * consent policy for their course.
             */
            _databaseManager.UpdateCoursePeerGroups(
                GetCourseID(), obj.MinSize);
        }


        // TODO: check if possible to have separate routes for seperate authorizes.
        // [Authorize]
        // [Route("/app/track")]
        // [HttpPost]
        // [ProducesResponseType(StatusCodes.Status400BadRequest)]
        // [ProducesResponseType(StatusCodes.Status200OK)]
        // public ActionResult TrackAction()
        // {
        //     if (this.IsAdministrator()) return Json("");

        //     var body = new StreamReader(Request.Body).ReadToEnd();
        //     string action = (string)JObject.Parse(body)["action"];

        //     _databaseManager.TrackUserAction(
        //             this.GetUserID(),
        //             action
        //             );

        //     return Json("");
        // }



        [Authorize(Policy = "IsInstructor")]
        [Route("/app/notifications")]
        [HttpPost]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public ActionResult UpdateNotificationDates()
        {
            int courseID = this.GetCourseID();

            var body = new StreamReader(Request.Body).ReadToEnd();
            string dates = (string)JObject.Parse(body)["dates"];

            _databaseManager.UpdateNotificationDates(courseID, dates);

            return Ok();
        }

        [Authorize(Policy = "IsInstructor")]
        [Route("/app/notifications")]
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public ActionResult GetNotificationDates()
        {
            string allDates = _databaseManager.GetNotificationDates(GetCourseID());
            return allDates != null ? Json(allDates) : NotFound();
        }
    }
}
