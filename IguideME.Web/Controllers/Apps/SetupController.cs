using System.Threading.Tasks;
using IguideME.Web.Models.Service;
using IguideME.Web.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
namespace IguideME.Web.Controllers
{
	public class SetupController : DataController
	{
		private readonly ILogger<DataController> _logger;
		private readonly DatabaseManager _databaseManager;
		private readonly IQueuedBackgroundService _queuedBackgroundService;
		private readonly IComputationJobStatusService _computationJobStatusService;

		public SetupController(ILogger<DataController> logger,
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

		[Route("/api/setup/{courseID}")]
		[HttpPost]
		public async Task<IActionResult> SetupCourse(string courseID)
		{
			if (int.TryParse(courseID, out int id))
			{
				if (!_databaseManager.IsCourseRegistered(id))
				{
					_databaseManager.RegisterCourse(id, GetCourseTitle());

					// Start the first sync in order to get data from the lms
					JobParametersModel obj =
						new() { CourseID = id, SendNotifications = false };
					await _queuedBackgroundService.PostWorkItemAsync(obj).ConfigureAwait(false);
				}
				return Accepted();
			}

			return BadRequest();
		}

	}
}
