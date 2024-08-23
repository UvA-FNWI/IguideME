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

		[Route("/api/setup")]
		[HttpPost]
		public async Task<IActionResult> SetupCourse()
		{
			if (!_databaseManager.IsCourseRegistered(GetCourseID()))
			{
				_databaseManager.RegisterCourse(GetCourseID(), GetCourseTitle());
				JobParametersModel obj =
					new() { CourseID = GetCourseID(), SendNotifications = false };
				await _queuedBackgroundService.PostWorkItemAsync(obj).ConfigureAwait(false);
			}
			return Accepted();
		}

	}
}
