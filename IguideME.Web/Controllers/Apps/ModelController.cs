﻿using IguideME.Web.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using IguideME.Web.Models.App;
using IguideME.Web.Services.LMSHandlers;

namespace IguideME.Web.Controllers
{
    [Authorize]
    [ApiController]
    [Route("[controller]")]
    public class ModelController : DataController
    {
        private readonly ILogger<DataController> _logger;
        private readonly ILMSHandler _lmsHandler;

        public ModelController(
            ILogger<DataController> logger,
            ILMSHandler lmsHandler) : base(
                logger, lmsHandler)
        {
            this._logger = logger;
            this._lmsHandler = lmsHandler;
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
