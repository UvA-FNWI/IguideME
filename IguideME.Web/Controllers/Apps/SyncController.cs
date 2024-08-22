using System.Collections.Generic;
using System.Threading.Tasks;
using IguideME.Web.Models.App;
using IguideME.Web.Models.Service;
using IguideME.Web.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace IguideME.Web.Controllers
{
	public class SyncController : DataController
	{
		private readonly ILogger<DataController> _logger;
		private readonly DatabaseManager _databaseManager;
		private readonly IQueuedBackgroundService _queuedBackgroundService;
		private readonly IComputationJobStatusService _computationJobStatusService;

		public SyncController(ILogger<DataController> logger,
			DatabaseManager databaseManager,
			IQueuedBackgroundService queuedBackgroundService,
			IComputationJobStatusService computationJobStatusService
		) : base(logger)
		{
			this._logger = logger;
			this._databaseManager = databaseManager;
			this._queuedBackgroundService = queuedBackgroundService;
			this._computationJobStatusService = computationJobStatusService;
		}

		[Authorize(Policy = "IsInstructor")]
		[HttpGet, Route("/api/sync/synchronizations")]
		public ActionResult<List<DataSynchronization>> GetSyncs()
		{
			return Ok(_databaseManager.GetSyncHashes(this.GetCourseID()));
		}

		[Authorize(Policy = "IsInstructor")]
		[HttpGet, Route("/api/sync/status")]
		[ProducesResponseType(StatusCodes.Status200OK)]
		[ProducesResponseType(StatusCodes.Status401Unauthorized)]
		[ProducesResponseType(
			StatusCodes.Status200OK,
			Type = typeof(IReadOnlyDictionary<string, JobModel>)
		)]
		public async Task<IActionResult> GetAllJobs()
		{
			return Ok(await _computationJobStatusService.GetAllJobsAsync().ConfigureAwait(false));
		}

		[Authorize(Policy = "IsInstructor")]
		[HttpPost, Route("api/sync/start-sync")]
		public async Task<IActionResult> StartSync([FromBody] JobParametersModel obj)
		{
			obj.CourseID = this.GetCourseID();
			obj.SendNotifications = false;
			return Accepted(
				await _queuedBackgroundService.PostWorkItemAsync(obj).ConfigureAwait(false)
			);
		}

		[Authorize(Policy = "IsInstructor")]
		[HttpPost, Route("api/sync/stop-sync")]
		[ProducesResponseType(StatusCodes.Status401Unauthorized)]
		[ProducesResponseType(StatusCodes.Status202Accepted, Type = typeof(JobCreatedModel))]
		public IActionResult StopSync([FromBody] JobParametersModel obj)
		{
			//TODO: ComputationJobStatusSevice.cs
			return Accepted();
		}

	}
}
