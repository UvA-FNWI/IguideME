using IguideME.Web.Models.App;
using IguideME.Web.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace IguideME.Web.Controllers
{
    public class AnalyticController : DataController
    {
        private readonly ILogger<DataController> _logger;

        private readonly DatabaseManager _databaseManager;

        public AnalyticController(ILogger<DataController> logger, DatabaseManager databaseManager)
            : base(logger)
        {
            this._logger = logger;
            this._databaseManager = databaseManager;
        }

        [Route("/analytics/track")]
        [HttpPost]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public ActionResult Track([FromBody] NewUserTrackerEntry entry)
        {
            _databaseManager.InsertUserAction(
                entry.UserID,
                entry.Action,
                entry.ActionDetail,
                entry.CourseID
            );

            return Ok("User action has been saved.");
        }

        // Using results instead of events as some adblockers block it otherwise.
        [Authorize(Policy = "IsInstructor")]
        [Route("/analytics/results/{courseID}")]
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public ActionResult GetAllEvents(int courseID)
        {
            return Ok(_databaseManager.RetrieveAllActionsPerCourse(courseID));
        }
    }
}
