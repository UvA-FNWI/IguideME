using System;
using System.Security.Claims;
using IguideME.Web.Services;
using IguideME.Web.Services.LMSHandlers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace IguideME.Web.Controllers
{
    [Authorize]
    [ApiController]
    [Route("[controller]")]
    public class DataController : Controller
    {
        private readonly ILogger<DataController> _logger;
        private readonly ILMSHandler _lmsHandler;

        public DataController(ILogger<DataController> logger, ILMSHandler lmsHandler)
        {
            this._logger = logger;
            this._lmsHandler = lmsHandler;
        }

        // -------------------- Helper functions --------------------

        protected string GetUserID()
        {
            // tmp for brightspace until we have an environment
            // return "p371565";
            if (
                int.TryParse(
                    (User.Identity as ClaimsIdentity).FindFirst("userid").Value,
                    out int id
                )
            )
            {
                string user = DatabaseManager.Instance.GetUserID(this.GetCourseID(), id);
                if (user != null)
                {
                    return user;
                }
                _logger.LogInformation("Could not find user {user} in database.", id);
                // Try's to find the user in canvas.
                return _lmsHandler
                    .GetUser(
                        this.GetCourseID(),
                        (User.Identity as ClaimsIdentity).FindFirst("userid").Value
                    )
                    .UserID;
            }

            _logger.LogError("Unable to parse userid claim");
            throw new Exception();
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
            // tmp for brightspace until we have an environment
            // return 83337;
            // returns the ID of course in which the IguideME instance is loaded
            _logger.LogInformation("User identity: {}", User.Identity);
            return int.Parse((User.Identity as ClaimsIdentity).FindFirst("courseid").Value);
        }

        protected string GetCourseTitle()
        {
            return (User.Identity as ClaimsIdentity).FindFirst("courseName").Value;
        }
    }
}
