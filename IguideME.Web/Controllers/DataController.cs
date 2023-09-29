using IguideME.Web.Services;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

using System.Security.Claims;

namespace IguideME.Web.Controllers
{
    [Authorize]
    [ApiController]
    [Route("[controller]")]
    public class DataController : Controller
    {
        private readonly ILogger<DataController> _logger;
        private readonly CanvasHandler _canvasHandler;

        public DataController(
            ILogger<DataController> logger,
            CanvasHandler canvasHandler
            )
        {
            this._logger = logger;
            this._canvasHandler = canvasHandler;

        }

        // -------------------- Helper functions --------------------

        protected string GetUserID()
        {

            if (int.TryParse((User.Identity as ClaimsIdentity).FindFirst("userid").Value, out int id))
            {

                string user = DatabaseManager.Instance.GetUserID(this.GetCourseID(), id);
                if (user != null)
                {
                    return user;
                }

            }

            _logger.LogInformation("Could not find user {user} in database.", id);
            // Try's to find the user in canvas.
            return _canvasHandler.GetUser(this.GetCourseID(), (User.Identity as ClaimsIdentity).FindFirst("userid").Value).SISUserID; //TODO: fix
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
