using IguideME.Web.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.Security.Claims;
using UserRoles = IguideME.Web.Models.Impl.UserRoles;


namespace IguideME.Web.Controllers
{
    [Authorize]
    [ApiController]
    [Route("[controller]")]
    public class DataController : Controller
    {
        private readonly ILogger<DataController> _logger;

        public DataController(ILogger<DataController> logger)
        {
            this._logger = logger;

        }

        // -------------------- Helper functions --------------------

        protected string GetUserID()
        {
            return (User.Identity as ClaimsIdentity).FindFirst("loginid").Value;
        }

        protected string GetUserName()
        {
            // returns the name of the logged in user
            return (User.Identity as ClaimsIdentity).FindFirst("user_name").Value;
        }

        protected bool IsAdministrator()
        {
            return User.IsInRole(UserRoles.instructor.ToString());
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
