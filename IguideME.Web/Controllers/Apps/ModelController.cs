using IguideME.Web.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using IguideME.Web.Models.App;

namespace IguideME.Web.Controllers
{
    [Authorize]
    [ApiController]
    [Route("[controller]")]
    public class ModelController : DataController
    {
        private readonly ILogger<DataController> logger;
        private readonly CanvasTest canvasTest;
        private readonly IQueuedBackgroundService _queuedBackgroundService;
        private readonly IComputationJobStatusService _computationJobStatusService;

        public ModelController(
            ILogger<DataController> logger,
            CanvasTest canvasTest,
            IQueuedBackgroundService queuedBackgroundService,
            IComputationJobStatusService computationJobStatusService) : base(
                logger, canvasTest, queuedBackgroundService, computationJobStatusService)
        {
            this.logger = logger;
            this.canvasTest = canvasTest;

            this._queuedBackgroundService = queuedBackgroundService;
            this._computationJobStatusService = computationJobStatusService;
        }

        [Authorize(Policy = "IsInstructor")]
        [Route("/models/upload")]
        [HttpPost]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public ActionResult UploadModel([FromBody] PredictiveModel[] models)
        {
            DatabaseManager.Instance.DeletePredictiveModels(GetCourseID());

            foreach (PredictiveModel model in models)
            {
                int modelID = DatabaseManager.Instance.CreatePredictiveModel(
                    GetCourseID(),
                    model.EntryCollection,
                    model.MSE);

                foreach (ModelTheta theta in model.Theta)
                {
                    DatabaseManager.Instance.CreateModelTheta(
                        modelID,
                        theta.TileID,
                        theta.EntryID,
                        theta.Intercept,
                        theta.MetaKey,
                        theta.Value);
                }
            }

            return Json(DatabaseManager.Instance
                .GetPredictiveModels(GetCourseID()));
        }

        [Authorize(Policy = "IsInstructor")]
        [Route("/models")]
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public ActionResult GetModels()
        {
            return Json(DatabaseManager.Instance
                .GetPredictiveModels(GetCourseID()));
        }

        [Authorize(Policy = "IsInstructor")]
        [Route("/models")]
        [HttpDelete]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        public ActionResult DeleteModels()
        {
            DatabaseManager.Instance.DeletePredictiveModels(GetCourseID());
            return NoContent();
        }

        [Authorize(Policy = "IsInstructor")]
        [Route("/app/grade-predictor")]
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public ActionResult GetGradePredictor()
        {
            return Content(
                "[]"
            );
        }
    }
}
