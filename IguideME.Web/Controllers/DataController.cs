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
        private readonly CanvasHandler _canvasHandler;
        private readonly DatabaseManager _databaseManager;

        public DataController(
            ILogger<DataController> logger,
            CanvasHandler canvasHandler,
            DatabaseManager databaseManager
            )
        {
            this._logger = logger;
            this._canvasHandler = canvasHandler;
            this._databaseManager = databaseManager;

        }

        // -------------------- Helper functions --------------------

        protected string GetUserID()
        {
            if (int.TryParse((User.Identity as ClaimsIdentity).FindFirst("userid").Value, out int id)) {

                string user = _databaseManager.GetUserID(this.GetCourseID(), id);
                if (user != null) {
                    return user;
                }
            }

            _logger.LogInformation("Could not find user {user} in database.", id);
            // Try's to find the user in canvas.
            return _canvasHandler.GetUser(this.GetCourseID(), (User.Identity as ClaimsIdentity).FindFirst("userid").Value).LoginID;
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
