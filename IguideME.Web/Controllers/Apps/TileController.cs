using System.Linq;
using IguideME.Web.Models;
using IguideME.Web.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

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

		[Authorize]
		[HttpGet]
		[Route("api/tile/group")]
		public ActionResult GetTileGroups()
		{
			return Ok(_databaseManager.GetLayoutTileGroups(GetCourseID()));
		}

		[Authorize(Policy = "IsInstructor")]
		[HttpPost]
		[Route("api/tile/group/{groupID}")]
		public ActionResult PostTileGroup(string groupID, [FromBody] LayoutTileGroup obj)
		{
			if (int.TryParse(groupID, out int id))
			{
				_databaseManager.CreateLayoutTileGroup(GetCourseID(), obj.Title, obj.Position);
				return Ok();
			}
			return BadRequest();
		}

		[Authorize(Policy = "IsInstructor")]
		[HttpDelete]
		[Route("api/tile/group/{groupID}")]
		public ActionResult DeleteTileGroup(string groupID)
		{
			if (int.TryParse(groupID, out int id))
			{
				_databaseManager.DeleteLayoutTileGroup(id);
				return Ok();
			}

			return NotFound();
		}

		[Authorize(Policy = "IsInstructor")]
		[HttpPatch]
		[Route("api/tile/group/{groupID}")]
		public ActionResult PatchtileGroup(string groupID, [FromBody] LayoutTileGroup tileGroup)
		{
			if (int.TryParse(groupID, out int id))
				return Ok(
					_databaseManager.UpdateTileGroup(
						GetCourseID(),
						id,
						tileGroup.ColumnID,
						tileGroup.Title,
						tileGroup.Position
					)
				);

			return NotFound();
		}

		[Authorize(Policy = "IsInstructor")]
		[HttpPatch]
		[Route("api/tile/group/order")]
		public ActionResult PatchTileGroupOrder([FromBody] int[] ids)
		{
			_databaseManager.UpdateTileGroupOrder(ids);
			return Ok();
		}


		// -------------------- Tile logic --------------------

		[Authorize]
		[HttpGet]
		[Route("api/tile")]
		public ActionResult GetTiles()
		{
			return Ok(_databaseManager.GetTiles(GetCourseID(), true));
		}

		[Authorize]
		[HttpGet]
		[Route("api/tile/{tileID}")]
		public ActionResult GetTile(string tileID)
		{
			if (int.TryParse(tileID, out int id))
				return Ok(_databaseManager.GetTile(GetCourseID(), id, true));

			return BadRequest();
		}

		[Authorize(Policy = "IsInstructor")]
		[HttpPost]
		[Route("api/tile/{tileID}")]
		public ActionResult PostTile(string tileID, [FromBody] Tile tile)
		{
			if (int.TryParse(tileID, out int id))
			{
				// TODO: this should probably be done in sql
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


		[Authorize(Policy = "IsInstructor")]
		[HttpPatch]
		[Route("api/tile/{tileID}")]
		public ActionResult PatchTile(string tileID, [FromBody] Tile tile)
		{
			if (int.TryParse(tileID, out int id))
			{
				_databaseManager.UpdateTile(tile);
				_databaseManager.DeleteAllTileEntries(tile.ID);
				// The tile ID inside the entry objects need to be overwritten.
				_databaseManager.CreateTileEntries(tile.ID, tile.Entries);

				return Ok();
			}
			return NotFound();
		}

		[Authorize(Policy = "IsInstructor")]
		[HttpDelete]
		[Route("api/tile/{tileID}")]
		public ActionResult DeleteTile(string tileID)
		{

			if (int.TryParse(tileID, out int id))
			{
				_databaseManager.DeleteTile(GetCourseID(), id);
				return Ok();
			}

			return NotFound();
		}

		[Authorize(Policy = "IsInstructor")]
		[HttpPatch]
		[Route("api/tile/order")]
		public ActionResult PatchTileOrder([FromBody] int[] ids)
		{
			_databaseManager.UpdateTileOrder(ids);
			return Ok();
		}

		[Authorize]
		[HttpGet]
		[Route("api/tile-group/{id}/tile")]
		public ActionResult GetGroupTiles(string id)
		{
			return Ok(_databaseManager.GetGroupTiles(GetCourseID(), id, true));
		}

		[Authorize]
		[HttpGet]
		[Route("api/tile/{tileID}/grade/{userID}")]
		public ActionResult GetTileGrades(string tileID, string userID)
		{
			if (userID != GetUserID() && !IsAdministrator())
				return Unauthorized();

			if (int.TryParse(tileID, out int id))
				return Json(_databaseManager.GetTileGrade(id, userID, GetCourseID()));

			return BadRequest();
		}

		//TODO: getalltilegrades













	}
}
