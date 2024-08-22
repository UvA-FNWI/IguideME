using System.Collections.Generic;
using System.IO;
using IguideME.Web.Models;
using IguideME.Web.Models.App;
using IguideME.Web.Models.Impl;
using IguideME.Web.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json.Linq;

namespace IguideME.Web.Controllers
{
	public class CourseController : DataController
	{
		private readonly ILogger<DataController> _logger;

		private readonly DatabaseManager _databaseManager;

		public CourseController(ILogger<DataController> logger, DatabaseManager databaseManager)
			: base(logger)
		{
			this._logger = logger;
			this._databaseManager = databaseManager;
		}

		[Authorize]
		[Route("/api/course/{courseID}")]
		[HttpGet]
		public ActionResult GetCourse(string courseID)
		{
			//TODO: actually implement.
			return Ok(new Course(994, "Testcursus IguideME", "IguideME", WorkflowStates.AVAILABLE, true, ""));
		}

		[Authorize]
		[Route("/api/course")]
		[HttpGet]
		public ActionResult GetUsersCourses([FromQuery(Name = "userId")] string userID)
		{
			//TODO: actually implement.
			Course[] courses = [new Course(994, "Testcursus IguideME", "IguideME", WorkflowStates.AVAILABLE, true, "")];
			return Ok(courses);
		}

		[Authorize(Policy = "IsInstructor")]
		[HttpGet]
		[Route("/api/courses/{courseID}/students")]
		[ProducesResponseType(StatusCodes.Status200OK)]
		[ProducesResponseType(StatusCodes.Status401Unauthorized)]
		public ActionResult<List<User>> GetStudentsByCourse(string courseID)
		{

			if (int.TryParse(courseID, out int id))
				return Ok(
					_databaseManager
						.GetUsersWithGrantedConsent(id, UserRoles.student)
						.ToArray()
				);
			return NotFound();
		}

		[Authorize(Policy = "IsInstructor")]
		[Route("/api/course/{courseID}/setting/peer-group")]
		[HttpGet]
		public ActionResult<PeerGroup> GetPeerSettings(string courseID)
		{
			if (int.TryParse(courseID, out int id))
			{
				// TODO: Probably change to just being an int instead of peergroup object
				return Ok(_databaseManager.GetPeerGroup(id));
			}
			return NotFound();
		}

		[Authorize(Policy = "IsInstructor")]
		[Route("/api/course/{courseID}/setting/peer-group")]
		[HttpPost]
		public ActionResult PostPeerSettings(string courseID, [FromBody] PeerGroup obj)
		{
			if (int.TryParse(courseID, out int id))
			{
				_databaseManager.UpdateCoursePeerGroups(
					id, obj.MinSize);
				return Ok();
			}
			return NotFound();
		}

		[Authorize]
		[Route("/api/course/{courseID}/setting/consent")]
		[HttpGet]
		public ActionResult<PublicInformedConsent> GetConsentSettings(string courseID)
		{
			/**
             * Provide wether the informed consent is mandatory and the informed
             * consent text (may be null). Caution: if informed consent is
             * mandatory and no informed consent text is provided student's
             * won't be able to accept or decline the terms, and thus nobody
             * is able to use the application.
             */

			if (int.TryParse(courseID, out int id))
			{
				return Ok(_databaseManager.GetPublicInformedConsent(
					GetCourseID()
				));

			}

			return NotFound();
		}

		[Authorize(Policy = "IsInstructor")]
		[Route("/api/course/{courseID}/setting/consent")]
		[HttpPost]
		public ActionResult PostConsentSettings(string courseID, [FromBody] PublicInformedConsent obj)
		{
			if (int.TryParse(courseID, out int id))
			{
				/**
				 * Endpoint is used to allow instructors to change the informed
				 * consent policy for their course.
				 */
				_databaseManager.UpdateInformedConsent(
					GetCourseID(), obj.Text, this.GetHashCode());
				//TODO: check for errors
				return Ok();
			}
			return NotFound();
		}

		[Authorize(Policy = "IsInstructor")]
		[Route("/api/course/{courseID}/setting/notifications")]
		[HttpGet]
		public ActionResult GetNotificationSettings()
		{
			return Ok(_databaseManager.GetNotificationDates(GetCourseID()));
		}

		[Authorize(Policy = "IsInstructor")]
		[Route("/api/course/{courseID}/setting/notifications")]
		[HttpPost]
		public ActionResult PostNotificationSettings()
		{

			var body = JObject.Parse(new StreamReader(Request.Body).ReadToEnd());

			// Check if all required fields are present
			if (!body.ContainsKey("isRange") ||
				!body.ContainsKey("selectedDays") ||
				!body.ContainsKey("selectedDates"))
			{
				return BadRequest();
			}

			bool isRange = (bool)body["isRange"];
			string selectedDays = (string)body["selectedDays"];
			string selectedDates = (string)body["selectedDates"];

			_databaseManager.UpdateNotificationDates(GetCourseID(), isRange, selectedDays, selectedDates);

			return Ok();
		}
	}
}
