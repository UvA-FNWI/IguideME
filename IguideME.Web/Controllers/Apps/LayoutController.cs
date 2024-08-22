using System.Collections.Generic;
using IguideME.Web.Models;
using IguideME.Web.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace IguideME.Web.Controllers
{
	public class LayoutController : DataController
	{
		private readonly ILogger<DataController> _logger;

		private readonly DatabaseManager _databaseManager;

		public LayoutController(ILogger<DataController> logger, DatabaseManager databaseManager)
			: base(logger)
		{
			this._logger = logger;
			this._databaseManager = databaseManager;
		}

		[Authorize]
		[HttpGet]
		[Route("api/layout/columns")]
		public ActionResult GetLayoutColumns()
		{
			return Ok(_databaseManager.GetLayoutColumns(GetCourseID()));
		}

		[Authorize]
		[HttpPost]
		[Route("api/layout/columns")]
		public ActionResult CreateOrUpdateLayoutColumns([FromBody] List<LayoutColumn> columns)
		{
			_databaseManager.DeleteAllLayoutColumns(GetCourseID());

			_databaseManager.CreateLayoutColumns(columns, GetCourseID());

			return Ok();
		}

	}
}
