using IguideME.Web.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace IguideME.Web.Controllers
{
	public class NotificationController : DataController
	{
		private readonly ILogger<DataController> _logger;

		private readonly DatabaseManager _databaseManager;

		public NotificationController(ILogger<DataController> logger, DatabaseManager databaseManager)
			: base(logger)
		{
			this._logger = logger;
			this._databaseManager = databaseManager;
		}

		[HttpGet]
		[Route("/api/notifications/{userID}")]
		public ActionResult GetNotifications(string userID)
		{
			if (this.GetUserID() != userID &&
				!this.IsAdministrator())
				return Unauthorized();

			return Ok(
					_databaseManager.GetAllUserNotifications(GetCourseID(), userID, GetHashCode())
				);
		}
	}
}
