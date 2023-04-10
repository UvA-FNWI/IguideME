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
        private readonly ILogger<DataController> _logger;
        private readonly CanvasHandler canvasHandler;

        public ModelController(
            ILogger<DataController> logger,
            CanvasHandler canvasHandler) : base(
                logger, canvasHandler)
        {
            this._logger = logger;
            this.canvasHandler = canvasHandler;
        }

        [Authorize(Policy = "IsInstructor")]
        [Route("/models/upload")]
        [HttpPost]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public ActionResult UploadModel([FromBody] GradePredictionModel model)
        {


            int modelID = DatabaseManager.Instance.CreateGradePredictionModel(GetCourseID(), model.Intercept);

            _logger.LogInformation("Uploading model: {intercept}, {parameters}", model.Intercept, model.Parameters);
            foreach (var parameter in model.Parameters)
            {
                DatabaseManager.Instance.CreateGradePredictionModelParameter(
                    modelID,
                    parameter.ParameterID,
                    parameter.Weight);
            }

            return Json(DatabaseManager.Instance.GetGradePredictionModels(GetCourseID()));
        }

        // tip: you can use [AllowAnonymous] for debugging purpuses
        [Authorize(Policy = "IsInstructor")]
        [Route("/models")]
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public ActionResult GetModels()
        {
            return Json(DatabaseManager.Instance.GetGradePredictionModels(GetCourseID()));
        }

        [Authorize(Policy = "IsInstructor")]
        [Route("/models")]
        [HttpDelete]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        public ActionResult DeleteModel()
        {
            // TODO: implement
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
