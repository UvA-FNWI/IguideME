using System.IO;
using IguideME.Web.Models.Impl;
using IguideME.Web.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json.Linq;

namespace IguideME.Web.Controllers
{
	public class UserController : DataController
	{
		private readonly ILogger<DataController> _logger;

		private readonly DatabaseManager _databaseManager;

		public UserController(ILogger<DataController> logger, DatabaseManager databaseManager)
			: base(logger)
		{
			this._logger = logger;
			this._databaseManager = databaseManager;

		}

		[Authorize(Policy = "IsInstructor")]
		[HttpGet]
		[Route("api/user/student")]
		public ActionResult GetStudents()
		{
			return Ok(
				_databaseManager
					.GetUsersWithGrantedConsent(this.GetCourseID(), UserRoles.student)
					.ToArray()
			);
		}

		[Authorize(Policy = "IsInstructor")]
		[Route("api/user/student/{userID}")]
		[HttpGet]
		public ActionResult GetStudent(string userID)
		{
			return Ok(_databaseManager.GetUser(GetCourseID(), userID));
		}

		[Authorize]
		[Route("/api/user/self")]
		[HttpGet]
		public ActionResult GetSelf()
		{
			return Ok(_databaseManager.GetUser(GetCourseID(), GetUserID()));
		}


		[Authorize]
		[HttpPost]
		[Route("/student/settings/notifications")]
		public ActionResult PostNotificationSettings()
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
			return Ok();
		}

		[Authorize]
		[HttpPost]
		[Route("/student/settings/consent")]
		public ActionResult PostConsent()
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
			return Ok();
		}

		[Authorize]
		[HttpPost]
		[Route("/student/settings/goal-Grade")]
		public ActionResult PostGoalGrade()
		{
			var body = new StreamReader(Request.Body).ReadToEnd();
			_databaseManager.UpdateUserSettings(
					this.GetCourseID(),
					this.GetUserID(),
					null,
					(int)JObject.Parse(body)["Grade"],
					null,
					null,
					null,
					0
					);
			return Ok();
		}
	}

}
