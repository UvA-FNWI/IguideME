using IguideME.Web.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Security.Claims;

namespace IguideME.Web.Controllers
{
    [Authorize]
    [ApiControllerAttribute]
    [Route("[controller]")]
    public class DataController : Controller
    {
        private readonly ILogger<DataController> _logger;
        private readonly CanvasHandler canvasTest;
        private readonly IQueuedBackgroundService _queuedBackgroundService;
        private readonly IComputationJobStatusService _computationJobStatusService;

        public DataController(
            ILogger<DataController> logger,
            CanvasHandler canvasTest,
            IQueuedBackgroundService queuedBackgroundService,
            IComputationJobStatusService computationJobStatusService)
        {
            this._logger = logger;
            this.canvasTest = canvasTest;

            this._queuedBackgroundService = queuedBackgroundService;
            this._computationJobStatusService = computationJobStatusService;
        }

        // -------------------- Helper functions --------------------

        protected string GetUserID()
        {
            // returns the logged in user
            return canvasTest.GetUser(this.GetCourseID(), (User.Identity as ClaimsIdentity).FindFirst("userid").Value).LoginID;
        }

        protected string GetUserName()
        {
            // returns the name of the logged in user
            return (User.Identity as ClaimsIdentity).FindFirst("user_name").Value;
        }

        protected bool IsAdministrator()
        {
            return User.IsInRole("Teacher");
        }

        protected int GetCourseID()
        {
            // returns the ID of course in which the IguideME instance is loaded
            return int.Parse((User.Identity as ClaimsIdentity).FindFirst("courseid").Value);
        }

        protected string GetCourseTitle()
        {
            _logger.LogInformation("testestests");
            return (User.Identity as ClaimsIdentity).FindFirst("courseName").Value;
        }
    }
}
