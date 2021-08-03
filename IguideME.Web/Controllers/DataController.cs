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
        private readonly ILogger<DataController> logger;
        private readonly CanvasTest canvasTest;
        private readonly IQueuedBackgroundService _queuedBackgroundService;
        private readonly IComputationJobStatusService _computationJobStatusService;

        public DataController(
            ILogger<DataController> logger,
            CanvasTest canvasTest,
            IQueuedBackgroundService queuedBackgroundService,
            IComputationJobStatusService computationJobStatusService)
        {
            this.logger = logger;
            this.canvasTest = canvasTest;

            this._queuedBackgroundService = queuedBackgroundService;
            this._computationJobStatusService = computationJobStatusService;
        }

        // -------------------- Helper functions --------------------

        protected string GetUserLoginID()
        {
            // returns the logged in user
            return ((ClaimsIdentity)User.Identity).FindFirst("user").Value;
        }

        protected string GetUserName()
        {
            // returns the name of the logged in user
            return ((ClaimsIdentity)User.Identity).FindFirst("user_name").Value;
        }

        protected Int32 GetUserID()
        {
            // returns the ID of the logged in user
            return Int32.Parse(((ClaimsIdentity)User.Identity).FindFirst("user_id").Value);
        }

        protected string GetUserRole()
        {
            // returns the ID of the logged in user
            return ((ClaimsIdentity)User.Identity).FindFirst("roles").Value.ToLower();
        }

        protected bool IsAdministrator()
        {
            return this.GetUserRole() == "instructor";
        }

        protected Int32 GetCourseID()
        {
            // returns the ID of course in which the IguideME instance is loaded
            return Int32.Parse(((ClaimsIdentity)User.Identity).FindFirst("course").Value);
        }
    }
}
