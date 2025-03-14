﻿using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using IguideME.Web.Models;
using IguideME.Web.Models.App;
using IguideME.Web.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json.Linq;

namespace IguideME.Web.Controllers
{
	[Authorize]
	[ApiController]
	[Route("[controller]")]
	public class TileController : DataController
	{
		private readonly ILogger<DataController> _logger;
		private readonly DatabaseManager _databaseManager;

		public TileController(ILogger<DataController> logger, DatabaseManager databaseManager)
			: base(logger)
		{
			_logger = logger;
			_databaseManager = databaseManager;
		}

		// -------------------- Tile logic --------------------

		[Authorize(Policy = "IsInstructor")]
		[HttpPost]
		[Route("/tiles/{tileID}")]
		[ProducesResponseType(StatusCodes.Status200OK)]
		[ProducesResponseType(StatusCodes.Status401Unauthorized)]
		public ActionResult PostTile(string tileID, [FromBody] Tile tile)
		{
			bool success = int.TryParse(tileID, out int id);

			if (success)
			{
				// Creates a new tile with information posted in the request's body
				int tilesInGroup = _databaseManager
					.GetTiles(GetCourseID())
					.Where(t => t.GroupID == tile.GroupID)
					.Count();

				_databaseManager.CreateTile(
				tile
				);
				return Ok();
			}
			return BadRequest();
		}

		[Authorize]
		[HttpGet]
		[Route("/tiles")]
		[ProducesResponseType(StatusCodes.Status200OK)]
		[ProducesResponseType(StatusCodes.Status401Unauthorized)]
		public ActionResult GetTiles()
		{
			// return all tiles registered to the course
			return Json(_databaseManager.GetTiles(GetCourseID(), true));
		}

		[Authorize(Policy = "IsInstructor")]
		[HttpGet]
		[Route("/grades/{id}")]
		public ActionResult GetCompareGrades(string id, [FromQuery(Name = "type")] string type)
		{

			return Ok(_databaseManager.GetCompareGrades(GetCourseID(), id, type));
		}

		[Authorize(Policy = "IsInstructor")]
		[HttpGet]
		[Route("/tiles/grades")]
		public ActionResult GetAllTileGrades()
		{

			return Ok(_databaseManager.GetAllTileGrades(GetCourseID()));
		}

		[Authorize(Policy = "IsInstructor")]
		[HttpGet]
		[Route("/entries/grades")]
		public ActionResult GetAllEntryGrades()
		{

			return Ok(_databaseManager.GetAllEntryGrades(GetCourseID()));
		}

		[Authorize]
		[HttpGet]
		[Route("/tilegroup/{id}/tiles")]
		[ProducesResponseType(StatusCodes.Status200OK)]
		[ProducesResponseType(StatusCodes.Status401Unauthorized)]
		public ActionResult GetGroupTiles(string id)
		{
			// return all tiles registered to the course
			return Json(_databaseManager.GetGroupTiles(GetCourseID(), id, true));
		}

		[Authorize]
		[HttpGet]
		[Route("/tiles/{tileID}/grades/{userID}")]
		[ProducesResponseType(StatusCodes.Status200OK)]
		[ProducesResponseType(StatusCodes.Status401Unauthorized)]
		public ActionResult GetTileGrades(string tileID, string userID)
		{
			if (!IsAdministrator() && userID != GetUserID())
			{
				return Unauthorized();
			}

			bool success = int.TryParse(tileID, out int id);
			if (success)
			{
				return Json(_databaseManager.GetTileGrade(id, userID, GetCourseID()));
			}
			return BadRequest();
		}

		[Authorize]
		[HttpGet]
		[Route("/tiles/groups")]
		[ProducesResponseType(StatusCodes.Status200OK)]
		[ProducesResponseType(StatusCodes.Status401Unauthorized)]
		public ActionResult GetTileGroups()
		{
			// return all tiles registered to the course
			return Json(_databaseManager.GetLayoutTileGroups(GetCourseID()));
		}

		[Authorize(Policy = "IsInstructor")]
		[HttpPost]
		[Route("/tiles/groups/{groupID}")]
		[ProducesResponseType(StatusCodes.Status200OK)]
		[ProducesResponseType(StatusCodes.Status400BadRequest)]
		[ProducesResponseType(StatusCodes.Status401Unauthorized)]
		public ActionResult PostTileGroup(string groupID, [FromBody] LayoutTileGroup obj)
		{
			bool success = int.TryParse(groupID, out int id);
			if (success)
			{
				_databaseManager.CreateLayoutTileGroup(GetCourseID(), obj.Title, obj.Position);
				return Ok();
			}
			return BadRequest();
		}

		[Authorize(Policy = "IsInstructor")]
		[HttpDelete]
		[Route("/tiles/groups/{groupID}")]
		[ProducesResponseType(StatusCodes.Status200OK)]
		[ProducesResponseType(StatusCodes.Status400BadRequest)]
		[ProducesResponseType(StatusCodes.Status401Unauthorized)]
		public ActionResult DeleteTileGroup(string groupID)
		{
			// Removes a tile group
			bool success = int.TryParse(groupID, out int id);

			if (success)
			{
				_databaseManager.DeleteLayoutTileGroup(id);
				return Ok();
			}

			return BadRequest();
		}

		[Authorize]
		[HttpGet]
		[ProducesResponseType(StatusCodes.Status200OK)]
		[ProducesResponseType(StatusCodes.Status401Unauthorized)]
		[Route("/learning-goals")]
		public ActionResult GetGoals()
		{
			return Json(_databaseManager.GetGoals(GetCourseID(), true));
		}

		[Authorize(Policy = "IsInstructor")]
		[HttpPost]
		[Route("/learning-goals/{ID}")]
		[ProducesResponseType(StatusCodes.Status200OK)]
		[ProducesResponseType(StatusCodes.Status400BadRequest)]
		[ProducesResponseType(StatusCodes.Status401Unauthorized)]
		public ActionResult PostGoal(string ID, [FromBody] LearningGoal obj)
		{
			bool success = int.TryParse(ID, out int id);
			if (success)
			{
				_databaseManager.CreateGoal(GetCourseID(), obj);
				return Ok();
			}
			return BadRequest();
		}

		[Authorize(Policy = "IsInstructor")]
		[HttpPatch]
		[Route("/learning-goals/{ID}")]
		[ProducesResponseType(StatusCodes.Status200OK)]
		[ProducesResponseType(StatusCodes.Status400BadRequest)]
		[ProducesResponseType(StatusCodes.Status401Unauthorized)]
		public ActionResult PatchGoal(string ID, [FromBody] LearningGoal obj)
		{
			bool success = int.TryParse(ID, out int id);
			if (success)
			{
				_databaseManager.UpdateGoal(GetCourseID(), obj);
				return Ok();
			}
			return BadRequest();
		}

		[Authorize(Policy = "IsInstructor")]
		[HttpDelete]
		[Route("/learning-goals/{ID}")]
		[ProducesResponseType(StatusCodes.Status204NoContent)]
		[ProducesResponseType(StatusCodes.Status400BadRequest)]
		[ProducesResponseType(StatusCodes.Status401Unauthorized)]
		public ActionResult DeleteGoal(string ID)
		{
			bool success = int.TryParse(ID, out int id);

			if (success)
			{
				_databaseManager.DeleteGoal(GetCourseID(), id);
				return Ok();
			}

			return BadRequest();
		}

		[Authorize(Policy = "IsInstructor")]
		[HttpPost]
		[Route("/learning-goals/requirements/{ID}")]
		[ProducesResponseType(StatusCodes.Status200OK)]
		[ProducesResponseType(StatusCodes.Status400BadRequest)]
		[ProducesResponseType(StatusCodes.Status401Unauthorized)]
		public ActionResult PostGoalRequirement(string ID, [FromBody] GoalRequirement obj)
		{
			bool success = int.TryParse(ID, out int id);
			if (success)
			{
				_databaseManager.CreateGoalRequirement(obj);
				return Ok();
			}
			return BadRequest();
		}

		[Authorize(Policy = "IsInstructor")]
		[HttpPatch]
		[Route("/learning-goals/requirements/{ID}")]
		[ProducesResponseType(StatusCodes.Status200OK)]
		[ProducesResponseType(StatusCodes.Status400BadRequest)]
		[ProducesResponseType(StatusCodes.Status401Unauthorized)]
		public ActionResult PatchGoalRequirement(string ID, [FromBody] GoalRequirement obj)
		{
			bool success = int.TryParse(ID, out int id);
			if (success)
			{
				_databaseManager.UpdateGoalRequirement(obj);
				return Ok();
			}
			return BadRequest();
		}

		[Authorize(Policy = "IsInstructor")]
		[HttpDelete]
		[Route("/learning-goals/requirements/{ID}")]
		[ProducesResponseType(StatusCodes.Status204NoContent)]
		[ProducesResponseType(StatusCodes.Status400BadRequest)]
		[ProducesResponseType(StatusCodes.Status401Unauthorized)]
		public ActionResult DeleteRequirement(string ID)
		{
			bool success = int.TryParse(ID, out int id);

			if (success)
			{
				_databaseManager.DeleteGoalRequirement(id);
				return Ok();
			}

			return BadRequest();
		}

		[Authorize]
		[HttpGet]
		[Route("/tile/{tileID}")]
		[ProducesResponseType(StatusCodes.Status200OK)]
		[ProducesResponseType(StatusCodes.Status401Unauthorized)]
		[ProducesResponseType(StatusCodes.Status400BadRequest)]
		public ActionResult GetTile(string tileID)
		{
			bool success = int.TryParse(tileID, out int id);

			return success
				? Json(
					_databaseManager
					.GetTile(GetCourseID(), id, true))
				: BadRequest();
		}


		[Authorize(Policy = "IsInstructor")]
		[HttpPatch]
		[Route("/tiles/{tileID}")]
		[ProducesResponseType(StatusCodes.Status200OK)]
		[ProducesResponseType(StatusCodes.Status400BadRequest)]
		[ProducesResponseType(StatusCodes.Status401Unauthorized)]
		public ActionResult PatchTile(string tileID, [FromBody] Tile tile)
		{
			bool success = int.TryParse(tileID, out int id);
			if (success)
			{
				_databaseManager.UpdateTile(tile);
				_databaseManager.DeleteAllTileEntries(tile.ID);
				// The tile ID inside the entry objects need to be overwritten.
				_databaseManager.CreateTileEntries(tile.ID, tile.Entries);

				return Ok();
			}
			return BadRequest();
		}

		[Authorize(Policy = "IsInstructor")]
		[HttpDelete]
		[Route("/tiles/{tileID}")]
		[ProducesResponseType(StatusCodes.Status200OK)]
		[ProducesResponseType(StatusCodes.Status400BadRequest)]
		[ProducesResponseType(StatusCodes.Status401Unauthorized)]
		public ActionResult DeleteTile(string tileID)
		{
			bool success = int.TryParse(tileID, out int id);

			if (success)
			{
				_databaseManager.DeleteTile(GetCourseID(), id);
				return Ok();
			}

			return BadRequest();
		}

		[Authorize]
		[HttpGet]
		[Route("/assignments/{entryID}/submissions/{userID}")]
		[ProducesResponseType(StatusCodes.Status204NoContent)]
		[ProducesResponseType(StatusCodes.Status400BadRequest)]
		[ProducesResponseType(StatusCodes.Status401Unauthorized)]
		public ActionResult GetSubmission(string entryID, string userID)
		{
			// Only instructors may view submissions of other students
			if (this.GetUserID() != userID &&
				!this.IsAdministrator())
				return Unauthorized();

			bool success = int.TryParse(entryID, out int id);

			return success
				? Ok(
					_databaseManager.GetAssignmentSubmissionForUser(
						this.GetCourseID(), id, userID))
				: BadRequest();
		}

		[Authorize]
		[HttpGet]
		[Route("/learning-goals/{entryID}/{userID}")]
		[ProducesResponseType(StatusCodes.Status204NoContent)]
		[ProducesResponseType(StatusCodes.Status400BadRequest)]
		[ProducesResponseType(StatusCodes.Status401Unauthorized)]
		public ActionResult GetLearningGoal(string entryID, string userID)
		{
			// Only instructors may view submissions of other students
			if (this.GetUserID() != userID &&
				!this.IsAdministrator())
				return Unauthorized();

			bool success = int.TryParse(entryID, out int id);

			return success
				? Json(
					_databaseManager.GetLearningGoalForUser(
						this.GetCourseID(), id, userID))
				: BadRequest();
		}

		[Authorize]
		[HttpGet]
		[Route("/discussions/{entryID}/{userID}")]
		[ProducesResponseType(StatusCodes.Status204NoContent)]
		[ProducesResponseType(StatusCodes.Status400BadRequest)]
		[ProducesResponseType(StatusCodes.Status401Unauthorized)]
		public ActionResult GetTopicCount(string entryID, string userID)
		{
			// Only instructors may view submissions of other students
			if (this.GetUserID() != userID &&
				!this.IsAdministrator())
				return Unauthorized();

			bool success = int.TryParse(entryID, out int id);

			return success
				? Json(
					_databaseManager.GetTopicGradesForUser(
						this.GetCourseID(), id, userID))
				: BadRequest();
		}
		[Authorize]
		[HttpGet]
		[Route("/discussions/{userID}")]
		[ProducesResponseType(StatusCodes.Status204NoContent)]
		[ProducesResponseType(StatusCodes.Status400BadRequest)]
		[ProducesResponseType(StatusCodes.Status401Unauthorized)]
		public ActionResult GetUserDiscussionEntries(string userID)
		{
			// Only instructors may view submissions of other students
			if (this.GetUserID() != userID &&
				!this.IsAdministrator())
				return Unauthorized();


			return Json(
					_databaseManager.GetUserDiscussionEntries(
						this.GetCourseID(), userID));
		}


		[Authorize]
		[HttpGet]
		[Route("/tiles/{tileID}/submissions")]
		[ProducesResponseType(StatusCodes.Status204NoContent)]
		[ProducesResponseType(StatusCodes.Status400BadRequest)]
		[ProducesResponseType(StatusCodes.Status401Unauthorized)]
		public ActionResult GetTileSubmissions(string tileID)
		{
			// Only instructors may view submissions of other students
			if (!this.IsAdministrator())
				return Unauthorized();

			if (int.TryParse(tileID, out int id))
			{
				return Ok(_databaseManager.GetTileSubmissions(this.GetCourseID(), id));
			}

			return BadRequest();

		}

		[Authorize(Policy = "IsInstructor")]
		[HttpGet]
		[Route("/external-assignments")]
		public ActionResult GetExternalAssignments()
		{
			return Ok(_databaseManager.GetExternalAssignments(GetCourseID()));
		}

		[Authorize(Policy = "IsInstructor")]
		[HttpGet]
		[Route("/assignments/{assignmentID}/submissions")]
		public ActionResult GetAssignmentSubmissions(int assignmentID)
		{
			return Ok(_databaseManager.GetAssignmentSubmissions(GetCourseID(), assignmentID));
		}

		[Authorize(Policy = "IsInstructor")]
		[HttpPatch]
		[Route("/external-assignments/{assignmentID}")]
		public ActionResult PatchAssignment([FromBody] AppAssignment assignment)
		{
			assignment.CourseID = this.GetCourseID();
			_databaseManager.UpdateExternalAssignment(assignment);
			return Ok();
		}

		[Authorize(Policy = "IsInstructor")]
		[HttpDelete]
		[Route("/external-assignments/{assignmentID}")]
		public ActionResult DeleteExternalAssignment(int assignmentID)
		{
			int courseID = this.GetCourseID();
			_databaseManager.DeleteExternalAssignment(assignmentID, courseID);
			return Ok();
		}

		[Authorize(Policy = "IsInstructor")]
		[HttpPatch]
		[Route("/external-assignments/{assignmentID}/title")]
		public ActionResult PatchAssignmentTitle(int assignmentID)
		{
			int courseID = this.GetCourseID();
			var body = new StreamReader(Request.Body).ReadToEnd();
			_databaseManager.UpdateExternalAssignmentTitle(assignmentID, courseID, (string)JObject.Parse(body)["title"]);
			return Ok();
		}

		[Authorize(Policy = "IsInstructor")]
		[HttpPost]
		[Route("/external-assignments")]
		public ActionResult PostAssignment([FromBody] AppAssignment assignment)
		{
			assignment.CourseID = this.GetCourseID();
			return Ok(_databaseManager.RegisterExternalAssignment(assignment));
		}

		[Authorize(Policy = "IsInstructor")]
		[HttpPost]
		[Route("/entries/{assignmentID}/upload")]
		[ProducesResponseType(StatusCodes.Status204NoContent)]
		[ProducesResponseType(StatusCodes.Status400BadRequest)]
		[ProducesResponseType(StatusCodes.Status401Unauthorized)]
		public ActionResult UploadExternalData(int assignmentID, JObject data)
		{
			int courseID = this.GetCourseID();

			int id_column = data["idColumn"].ToObject<int>();
			int grade_column = data["gradeColumn"].ToObject<int>();
			JArray table = (JArray)data["data"];

			string[] names = table[0].ToObject<string[]>();

			AppAssignment ass = _databaseManager.GetAssignment(courseID, assignmentID);

			// IEnumerable<int> range = Enumerable.Range(0, names.Length).Where(i => i != id_column && i != grade_column);
			foreach (JArray row in table.Cast<JArray>())
			{

				string[] values = row.ToObject<string[]>();

				_ = float.TryParse(values[grade_column], out float Grade);

				int submissionID = _databaseManager.CreateUserSubmission(
				new(
				-1,
					assignmentID,
					values[id_column],
					Grade * 100 / (ass.MaxGrade > 0 ? ass.MaxGrade : 1),
					DateTimeOffset.UtcNow.ToUnixTimeMilliseconds()
				));

				// foreach (int i in range)
				// {
				//     _databaseManager.CreateSubmissionMeta(
				//         submissionID,
				//         names[i],
				//         values[i]
				//     );
				// }
			}

			return NoContent();
		}

		// [Authorize]
		// [HttpGet]
		// [Route("/tiles/Grade-summary/{userID}")]
		// [ProducesResponseType(StatusCodes.Status200OK)]
		// [ProducesResponseType(StatusCodes.Status401Unauthorized)]
		// public ActionResult GetGradeSummary(string userID)
		// {
		//     // Only instructors may view submissions of other students
		//     return this.GetUserID() != userID && !this.IsAdministrator()
		//         ? Unauthorized()
		//         : Json(
		//         _databaseManager.GetTileSubmissionsForUser(
		//             this.GetCourseID(), userID));
		// }

		// [Authorize]
		// [HttpGet]
		// [Route("/tiles/Grade-history/{userID}")]
		// [ProducesResponseType(StatusCodes.Status200OK)]
		// [ProducesResponseType(StatusCodes.Status401Unauthorized)]
		// public ActionResult GetTileHistory(string userID)
		// {
		//     User user = _databaseManager.GetUser(
		//         this.GetCourseID(), userID);

		//     return user == null
		//         ? BadRequest()
		//         : Json(
		//         _databaseManager.GetHistoricComparison(
		//             this.GetCourseID(), userID));

		// }

		//TODO: Change the route in the frontend
		// [Authorize]
		// [HttpGet]
		// [Route("/peer-comparison/tiles/{userID}")]
		// [ProducesResponseType(StatusCodes.Status200OK)]
		// [ProducesResponseType(StatusCodes.Status401Unauthorized)]
		// public ActionResult GetPeerComparisonForTiles(string userID)
		// {
		//     // Only instructors may view peer comparisons of other students
		//     if (this.GetUserID() != userID && !this.IsAdministrator())
		//         return Unauthorized();

		//     User user = _databaseManager.GetUser(
		//         this.GetCourseID(), userID);

		//     return user == null
		//         ? BadRequest()
		//         : Json(
		//         _databaseManager.GetUserPeerComparison(
		//         GetCourseID(),
		//         user.UserID,
		//         (int)Services.Workers.Comparison_Entity_Types.tile,
		//         GetHashCode()));
		// }

		//TODO: Create the route in the frontend
		// [Authorize]
		// [HttpGet]
		// [Route("/peer-comparison/assignments/{userID}")]
		// [ProducesResponseType(StatusCodes.Status200OK)]
		// [ProducesResponseType(StatusCodes.Status401Unauthorized)]
		// public ActionResult GetPeerComparisonForAssignments(string userID)
		// {
		//     // Only instructors may view peer comparisons of other students
		//     if (this.GetUserID() != userID && !this.IsAdministrator())
		//         return Unauthorized();

		//     User user = _databaseManager.GetUser(
		//         this.GetCourseID(), userID);

		//     return user == null
		//         ? BadRequest()
		//         : Json(
		//         _databaseManager.GetUserPeerComparison(
		//         GetCourseID(),
		//         user.UserID,
		//         (int)Services.Workers.Comparison_Entity_Types.assignment,
		//         GetHashCode()));
		// }

		// [Authorize]
		// [HttpGet]
		// [Route("/results/{userID}")]
		// [ProducesResponseType(StatusCodes.Status200OK)]
		// [ProducesResponseType(StatusCodes.Status401Unauthorized)]
		// public ActionResult GetUserResults(string userID)
		// {
		//     // Only instructors may view submissions of other students
		//     if (this.GetUserID() != userID && !this.IsAdministrator())
		//         return Unauthorized();

		//     User user = _databaseManager.GetUser(
		//         this.GetCourseID(), userID);

		//     return user == null
		//         ? BadRequest()
		//         : Json(
		//         _databaseManager.GetUserResults(
		//             GetCourseID(), user.UserID));
		// }

		[Authorize]
		[HttpGet]
		[Route("/layout/columns")]
		[ProducesResponseType(StatusCodes.Status200OK)]
		[ProducesResponseType(StatusCodes.Status401Unauthorized)]
		public ActionResult GetLayoutColumns()
		{
			/**
             * Returns all columns registered to the course.
             */
			return Json(_databaseManager.GetLayoutColumns(GetCourseID()));
		}

		[Authorize]
		[HttpPost]
		[Route("/layout/columns")]
		[ProducesResponseType(StatusCodes.Status200OK)]
		[ProducesResponseType(StatusCodes.Status401Unauthorized)]
		public ActionResult CreateOrUpdateLayoutColumns([FromBody] List<LayoutColumn> columns)
		{
			//Step 1: Delete pre-existing Layout (if it exists)
			_databaseManager.DeleteAllLayoutColumns(GetCourseID());

			//Step 2: Save the new Layout
			_databaseManager.CreateLayoutColumns(columns, GetCourseID());

			return Ok();
		}

		[Authorize(Policy = "IsInstructor")]
		[HttpPatch]
		[Route("/tiles/groups/{groupID}")]
		[ProducesResponseType(StatusCodes.Status200OK)]
		[ProducesResponseType(StatusCodes.Status401Unauthorized)]
		public ActionResult UpdateTileGroup(string groupID, [FromBody] LayoutTileGroup tileGroup)
		{
			if (int.TryParse(groupID, out int id))
				return Json(
					_databaseManager.UpdateTileGroup(
						GetCourseID(),
						id,
						tileGroup.ColumnID,
						tileGroup.Title,
						tileGroup.Position
					)
				);

			return BadRequest();
		}

		[Authorize(Policy = "IsInstructor")]
		[HttpPatch]
		[Route("/tiles/groups/order")]
		[ProducesResponseType(StatusCodes.Status200OK)]
		[ProducesResponseType(StatusCodes.Status401Unauthorized)]
		public ActionResult UpdateTileGroupOrder([FromBody] int[] ids)
		{
			_databaseManager.UpdateTileGroupOrder(ids);
			return Ok();
		}

		[Authorize(Policy = "IsInstructor")]
		[HttpPatch]
		[Route("/tiles/order")]
		[ProducesResponseType(StatusCodes.Status200OK)]
		[ProducesResponseType(StatusCodes.Status401Unauthorized)]
		public ActionResult UpdateTileOrder([FromBody] int[] ids)
		{
			_databaseManager.UpdateTileOrder(ids);
			return Ok();
		}
	}
}
