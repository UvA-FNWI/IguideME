using IguideME.Web.Models.App;
using IguideME.Web.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace IguideME.Web.Controllers
{
	public class EntryController : DataController
	{
		private readonly ILogger<DataController> _logger;

		private readonly DatabaseManager _databaseManager;

		public EntryController(ILogger<DataController> logger, DatabaseManager databaseManager)
			: base(logger)
		{
			this._logger = logger;
			this._databaseManager = databaseManager;
		}

		[Authorize(Policy = "IsInstructor")]
		[HttpGet]
		[Route("api/assignments")]
		public ActionResult GetAssignments()
		{
			return Ok(_databaseManager.GetAssignmentsMap(GetCourseID()));
		}

		[Authorize]
		[HttpGet]
		[Route("api/assignment/{entryID}/submissions/{userID}")]
		public ActionResult GetAssignmentSubmission(string entryID, string userID)
		{
			if (this.GetUserID() != userID &&
				!this.IsAdministrator())
				return Unauthorized();

			if (int.TryParse(entryID, out int id))
				return Ok(
					_databaseManager.GetAssignmentSubmissionForUser(
						this.GetCourseID(), id, userID));

			return NotFound();
		}

		[Authorize(Policy = "IsInstructor")]
		[HttpGet]
		[Route("api/discussion/topics")]
		public ActionResult GetTopics()
		{
			return Ok(_databaseManager.GetDiscussions(this.GetCourseID()));
		}

		[Authorize]
		[HttpGet]
		[Route("api/discussion/{entryID}/{userID}")]
		public ActionResult GetTopicCount(string entryID, string userID)
		{
			if (this.GetUserID() != userID &&
				!this.IsAdministrator())
				return Unauthorized();

			if (int.TryParse(entryID, out int id))
				return Ok(
					_databaseManager.GetTopicGradesForUser(
						this.GetCourseID(), id, userID));

			return NotFound();
		}

		[Authorize]
		[HttpGet]
		[Route("api/discussions/{userID}")]
		public ActionResult GetUserDiscussionEntries(string userID)
		{
			if (this.GetUserID() != userID &&
				!this.IsAdministrator())
				return Unauthorized();


			return Ok(
					_databaseManager.GetUserDiscussionEntries(
						this.GetCourseID(), userID));
		}

		[Authorize]
		[HttpGet]
		[Route("api/learning-goals")]
		public ActionResult GetLearningGoals()
		{
			return Ok(_databaseManager.GetGoals(GetCourseID(), true));
		}


		[Authorize]
		[HttpGet]
		[Route("api/learning-goal/{entryID}/{userID}")]
		public ActionResult GetLearningGoal(string entryID, string userID)
		{
			if (this.GetUserID() != userID &&
				!this.IsAdministrator())
				return Unauthorized();

			if (int.TryParse(entryID, out int id))
				return Ok(_databaseManager.GetLearningGoalForUser(this.GetCourseID(), id, userID));

			return NotFound();
		}

		[Authorize(Policy = "IsInstructor")]
		[HttpPost]
		[Route("api/learning-goal/{entryID}")]
		public ActionResult PostLearningGoal(string entryID, [FromBody] LearningGoal goal)
		{
			//TODO: Do we want to get the id or do something with it?
			if (int.TryParse(entryID, out int id))
			{
				_databaseManager.CreateGoal(GetCourseID(), goal);
				return Ok();
			}
			return BadRequest();
		}

		[Authorize(Policy = "IsInstructor")]
		[HttpPatch]
		[Route("api/learning-goal/{entryID}")]
		public ActionResult PatchLearningGoal(string entryID, [FromBody] LearningGoal obj)
		{
			if (int.TryParse(entryID, out int id))
			{
				_databaseManager.UpdateGoal(GetCourseID(), obj);
				return Ok();
			}
			return BadRequest();
		}

		[Authorize(Policy = "IsInstructor")]
		[HttpDelete]
		[Route("api/learning-goals/{entryID}")]
		public ActionResult DeleteLearningGoal(string entryID)
		{
			if (int.TryParse(entryID, out int id))
			{
				_databaseManager.DeleteGoal(GetCourseID(), id);
				return Ok();
			}

			return BadRequest();

		}

		[Authorize(Policy = "IsInstructor")]
		[HttpPost]
		[Route("api/learning-goal/requirements/{reqID}")]
		public ActionResult PostGoalRequirement(string reqID, [FromBody] GoalRequirement obj)
		{
			if (int.TryParse(reqID, out int id))
			{
				_databaseManager.CreateGoalRequirement(obj);
				return Ok();
			}
			return BadRequest();
		}

		[Authorize(Policy = "IsInstructor")]
		[HttpPatch]
		[Route("api/learning-goal/requirements/{reqID}")]
		public ActionResult PatchGoalRequirement(string reqID, [FromBody] GoalRequirement obj)
		{
			if (int.TryParse(reqID, out int id))
			{
				_databaseManager.UpdateGoalRequirement(obj);
				return Ok();
			}
			return NotFound();
		}

		[Authorize(Policy = "IsInstructor")]
		[HttpDelete]
		[Route("/learning-goals/requirements/{ID}")]
		public ActionResult DeleteRequirement(string ID)
		{

			if (int.TryParse(ID, out int id))
			{
				_databaseManager.DeleteGoalRequirement(id);
				return Ok();
			}

			return NotFound();
		}
	}
}
