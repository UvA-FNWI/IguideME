using IguideME.Web.Models.App;
using IguideME.Web.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace IguideME.Web.Controllers
{
    [Authorize]
    [ApiController]
    [Route("[controller]")]
    public class AppController : DataController
    {
        private readonly ILogger<DataController> logger;
        private readonly CanvasTest canvasTest;
        private readonly IQueuedBackgroundService _queuedBackgroundService;
        private readonly IComputationJobStatusService _computationJobStatusService;

        public AppController(
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
            return Json(
                DatabaseManager.Instance.GetUser(GetCourseID(), this.GetUserLoginID())
            );
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
            PublicInformedConsent consent = DatabaseManager.Instance
                .GetPublicInformedConsent(GetCourseID());

            // Check if consent exists
            if (consent == null) return BadRequest();

            return Json(consent);
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
            DatabaseManager.Instance.UpdateInformedConsent(
                GetCourseID(), obj.RequireConsent, obj.Text);

            // return newly fetched consent object
            return Json(
                DatabaseManager.Instance
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
            PeerGroup peerGroup = DatabaseManager.Instance
                .GetPeerGroup(GetCourseID());

            // Check if consent exists
            if (peerGroup == null) return NotFound();

            return Json(peerGroup);
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
            DatabaseManager.Instance.UpdateCoursePeerGroups(
                GetCourseID(), obj.MinSize, obj.PersonalizedPeers);

            // return newly fetched consent object
            return Json(
               DatabaseManager.Instance
                .GetPeerGroup(GetCourseID()));
        }
    }
}
