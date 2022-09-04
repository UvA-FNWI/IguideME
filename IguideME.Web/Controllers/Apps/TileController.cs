using System;
using System.Collections.Generic;
using System.Linq;
using IguideME.Web.Models;
using IguideME.Web.Models.App;
using IguideME.Web.Models.Impl;
using IguideME.Web.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace IguideME.Web.Controllers
{
    [Authorize]
    [ApiController]
    [Route("[controller]")]
    public class TileController : DataController
    {
        private readonly ILogger<DataController> logger;
        private readonly CanvasTest canvasTest;
        private readonly IQueuedBackgroundService _queuedBackgroundService;
        private readonly IComputationJobStatusService _computationJobStatusService;

        public TileController(
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


        // -------------------- Tile logic --------------------

        [Authorize(Policy = "IsInstructor")]
        [HttpPost]
        [Route("/tiles")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public JsonResult PostTile([FromBody] Tile tile)
        {
            // Creates a new tile with information posted in the request's body
            int tilesInGroup = DatabaseManager.Instance.GetTiles(GetCourseID())
                .Where(t => t.GroupID == tile.GroupID)
                .Count();

            Tile newTile = DatabaseManager.Instance.CreateTile(
                GetCourseID(),
                tile.GroupID,
                tile.Title,
                tilesInGroup + 1,
                tile.ContentType,
                tile.TileType,
                tile.Visible,
                tile.Notifications,
                tile.GraphView,
                tile.Wildcard
            );

            // return newly created tile
            return Json(newTile);
        }

        [Authorize]
        [HttpGet]
        [Route("/tiles")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public ActionResult GetTiles()
        {
            // return all tiles registered to the course
            return Json(
                DatabaseManager.Instance.GetTiles(GetCourseID()));
        }

        [Authorize]
        [HttpGet]
        [Route("/tiles/groups")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public ActionResult GetTileGroupsDEV()
        {
            // return all tiles registered to the course
            return Json(
                    DatabaseManager.Instance.GetLayoutTileGroups(GetCourseID()));
        }

        [Authorize(Policy = "IsInstructor")]
        [HttpPost]
        [Route("/tiles/groups")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public ActionResult PostTileGroup([FromBody] LayoutTileGroup obj)
        {
            DatabaseManager.Instance.CreateLayoutTileGroup(GetCourseID(), obj.Title, obj.Position);
            return Json(
                    DatabaseManager.Instance.GetLayoutTileGroups(GetCourseID()));
        }

        [Authorize(Policy = "IsInstructor")]
        [HttpDelete]
        [Route("/tiles/groups/{groupID}")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public ActionResult DeleteTileGroup(string groupID)
        {
            // Removes a tile group
            int id;
            bool success = Int32.TryParse(groupID, out id);

            if (success)
            {
                DatabaseManager.Instance.DeleteLayoutTileGroup(id);
                return Json(
                        DatabaseManager.Instance.GetLayoutTileGroups(GetCourseID()));
            }

            return BadRequest();
        }

        [Authorize]
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [Route("/tiles/goals")]
        public ActionResult GetGoals()
        {
            List<LearningGoal> goals = DatabaseManager.Instance.GetGoals(GetCourseID());
            return Json(goals);
        }

        [Authorize]
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [Route("/tiles/{tileID}/goals")]
        public ActionResult GetTileGoals(string tileID)
        {
            int id;
            bool success = Int32.TryParse(tileID, out id);

            if (success)
            {
                return Json(
                    DatabaseManager.Instance
                        .GetGoals(GetCourseID())
                        .Where(g => g.TileID == id)
                        .ToArray());
            }

            return BadRequest();
        }

        [Authorize(Policy = "IsInstructor")]
        [HttpPost]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [Route("/tiles/goals")]
        public ActionResult CreateTileGoal([FromBody] LearningGoal goal)
        {
            LearningGoal _goal = DatabaseManager.Instance.CreateGoal(
                GetCourseID(), goal.TileID, goal.Title);

            foreach (GoalRequirement requirement in goal.Requirements)
            {
                DatabaseManager.Instance.CreateGoalRequirement(
                    _goal.ID,
                    requirement.TileID,
                    requirement.EntryID,
                    requirement.MetaKey,
                    requirement.Value,
                    requirement.Expression);
            }

            // load newly registered requirements into object
            _goal.FetchRequirements();
            return Json(_goal);
        }


        [Authorize]
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [Route("/tiles/entries")]
        public ActionResult GetTileEntries()
        {
            List<TileEntry> entries = DatabaseManager.Instance.GetEntries(GetCourseID());
            return Json(entries);
        }

        [Authorize(Policy = "IsInstructor")]
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [Route("/tiles/entries/{entryID}/meta-keys")]
        public ActionResult GetTileEntryMetaKeys(string entryID)
        {
            int id;
            bool success = Int32.TryParse(entryID, out id);

            if (success)
                return Json(
                    DatabaseManager.Instance
                        .GetEntryMetaKeys(id).ToArray());

            return BadRequest();
        }

        [Authorize]
        [HttpGet]
        [Route("/tiles/{tileID}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public ActionResult GetTile(string tileID)
        {
            int id;
            bool success = Int32.TryParse(tileID, out id);

            if (success)
                return Json(
                    DatabaseManager.Instance
                    .GetTile(GetCourseID(), id));

            return BadRequest();
        }

        [Authorize]
        [HttpGet]
        [Route("/tiles/{tileID}/entries")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public ActionResult GetTileEntries(string tileID)
        {
            int id;
            bool success = Int32.TryParse(tileID, out id);

            if (success)
                return Json(
                    DatabaseManager.Instance
                    .GetTileEntries(id).ToArray());

            return BadRequest();
        }

        //  TODO: refactor to own class
        public class JSONRequest
        {
            [JsonProperty(PropertyName = "notifications")]
            public bool? Notifications { get; set; }

            [JsonProperty(PropertyName = "group_id")]
            public int? GroupID { get; set; }

            [JsonProperty(PropertyName = "title")]
            public string Title { get; set; }

            [JsonProperty(PropertyName = "visible")]
            public bool? Visible { get; set; }

            [JsonProperty(PropertyName = "position")]
            public int? Position { get; set; }

            [JsonProperty(PropertyName = "graph_view")]
            public bool? GraphView { get; set; }

            [JsonProperty(PropertyName = "wildcard")]
            public bool? Wildcard { get; set; }
        }

        [Authorize(Policy = "IsInstructor")]
        [HttpPatch]
        [Route("/tiles/{tileID}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public ActionResult PatchTile(string tileID, [FromBody] JSONRequest obj)
        {
            int id;
            bool success = Int32.TryParse(tileID, out id);
            if (success)
            {
                Tile tile = DatabaseManager.Instance.GetTile(GetCourseID(), id);

                if (obj.GroupID != null)
                    tile.GroupID = (int) obj.GroupID;

                if (obj.Title != null)
                    tile.Title = (string)obj.Title;

                if (obj.Notifications != null)
                    tile.Notifications = (bool)obj.Notifications;

                if (obj.Visible != null)
                    tile.Visible = (bool)obj.Visible;

                if (obj.Position != null)
                    tile.Position = (int)obj.Position;

                if (obj.GraphView != null)
                    tile.GraphView = (bool) obj.GraphView;

                if (obj.Wildcard != null)
                    tile.Wildcard = (bool) obj.Wildcard;

                DatabaseManager.Instance.UpdateTile(GetCourseID(), tile);

                return Json(
                    DatabaseManager.Instance.GetTile(GetCourseID(), Int32.Parse(tileID))
                );
            }
            return BadRequest();
        }

        [Authorize(Policy = "IsInstructor")]
        [HttpDelete]
        [Route("/tiles/{tileID}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public ActionResult DeleteTile(string tileID)
        {
            int id;
            bool success = Int32.TryParse(tileID, out id);

            if (success)
            {
                DatabaseManager.Instance.DeleteTile(id);
                return NoContent();
            }

            return BadRequest();
        }

        [Authorize]
        [HttpGet]
        [Route("/tiles/{tileID}/submissions/{userLoginID}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public ActionResult GetSubmissions(string tileID, string userLoginID)
        {
            // Only instructors may view submissions of other students
            if (this.GetUserLoginID() != userLoginID &&
                !this.IsAdministrator())
                return Unauthorized();

            int id;
            bool success = Int32.TryParse(tileID, out id);

            if (success)
                return Json(
                    DatabaseManager.Instance.GetTileSubmissionsForUser(
                        this.GetCourseID(), id, userLoginID));

            return BadRequest();
        }

        [Authorize]
        [HttpGet]
        [Route("/tiles/{tileID}/discussions/{userLoginID}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public ActionResult GetDiscussions(string tileID, string userLoginID)
        {
            // Only instructors may view submissions of other students
            if (this.GetUserLoginID() != userLoginID &&
                !this.IsAdministrator())
                return Unauthorized();

            int id;
            bool success = Int32.TryParse(tileID, out id);

            if (success)
                return Json(
                    DatabaseManager.Instance.GetDiscussions(
                        this.GetCourseID(), id, userLoginID));

            return BadRequest();
        }

        [Authorize]
        [HttpGet]
        [Route("/tiles/{tileID}/learning-outcomes/{userLoginID}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public ActionResult GetLearningOutcomes(string tileID, string userLoginID)
        {
            // Only instructors may view submissions of other students
            if (this.GetUserLoginID() != userLoginID &&
                !this.IsAdministrator())
                return Unauthorized();

            int id;
            bool success = Int32.TryParse(tileID, out id);

            if (success)
            {
                List<LearningGoal> goals = DatabaseManager.Instance.GetGoals(GetCourseID())
                    .Where(g => g.TileID == id)
                    .ToList();

                List<TileEntrySubmission> submissions =
                    DatabaseManager.Instance.GetTileSubmissionsForUser(
                        this.GetCourseID(),
                        userLoginID);

                var response = goals.Select(g =>
                {
                    bool success = true;
                    g.FetchRequirements();
                    foreach (GoalRequirement req in g.Requirements)
                    {
                        TileEntrySubmission submission = submissions.Find(
                            s => s.EntryID == req.EntryID);


                        if (submission == null)
                        {
                            success = false;
                        } else
                        {
                            switch (req.Expression)
                            {
                                case "lte":
                                    if (float.Parse(submission.Grade) > req.Value)
                                        success = false;
                                    break;
                                case "gte":
                                    if (float.Parse(submission.Grade) < req.Value)
                                        success = false;
                                    break;
                                default:
                                    if (float.Parse(submission.Grade) != req.Value)
                                        success = false;
                                    break;
                            }
                        }
                    }

                    return new Dictionary<string, object>
                    {
                        { "goal", g },
                        { "success", success }
                    };
                });

                return Json(response);
            }

            return BadRequest();
        }

        [Authorize(Policy = "IsInstructor")]
        [HttpPost]
        [Route("/entries")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public ActionResult CreateEntry([FromBody] TileEntry entry)
        {
            int entryID = DatabaseManager.Instance.CreateTileEntry(entry);
            return Json(DatabaseManager.Instance
                .GetEntries(this.GetCourseID())
                .Find(e => e.ID == entryID));
        }

        [Authorize(Policy = "IsInstructor")]
        [HttpDelete]
        [Route("/entries/{entryID}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public ActionResult DeleteEntry(string entryID)
        {

            int id;
            bool success = Int32.TryParse(entryID, out id);

            if (success)
            {
                DatabaseManager.Instance.DeleteTileEntry(id);
                return NoContent();
            }

            return BadRequest();
        }

        [Authorize(Policy = "IsInstructor")]
        [HttpPost]
        [Route("/entries/{entryID}/upload")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public ActionResult UploadTileData(string entryID, JArray input)
        {
            int id;
            bool success = Int32.TryParse(entryID, out id);

            if (!success) return BadRequest();

            foreach (JObject row in input.Children())
            {
                // register submission
                int submissionID = DatabaseManager.Instance.CreateUserSubmission(
                    this.GetCourseID(),
                    id,
                    row.GetValue("studentloginid").ToString(),
                    row.GetValue("grade").ToString(),
                    DateTime.Now.ToShortDateString());

                foreach (JProperty property in row.Properties())
                {
                    // don't register the id or grade as a meta attribute
                    if (property.Name == "studentloginid" ||
                        property.Name == "grade" ||
                        property.Name == "entry_id")
                        continue;

                    // add meta attributes
                    DatabaseManager.Instance.CreateSubmissionMeta(
                        submissionID, property.Name, property.Value.ToString());
                }
            }
            return NoContent();
        }

        [Authorize(Policy = "IsInstructor")]
        [HttpGet]
        [Route("/entries/{entryID}/submissions")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public ActionResult GetEntrySubmissions(string entryID, string userLoginID)
        {
            int id;
            bool success = Int32.TryParse(entryID, out id);

            if (success)
                return Json(
                    DatabaseManager.Instance.GetTileEntrySubmissions(
                        this.GetCourseID(), id));

            return BadRequest();
        }

        [Authorize]
        [HttpGet]
        [Route("/tiles/grade-summary/{userLoginID}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public ActionResult GetGradeSummary(string userLoginID)
        {
            // Only instructors may view submissions of other students
            if (this.GetUserLoginID() != userLoginID && !this.IsAdministrator())
                return Unauthorized();

            return Json(
                DatabaseManager.Instance.GetTileSubmissionsForUser(
                    this.GetCourseID(), userLoginID));
        }

        [Authorize]
        [HttpGet]
        [Route("/peer-comparison/{userLoginID}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public ActionResult GetPeerComparison(string userLoginID)
        {
            // Only instructors may view peer comparisons of other students
            if (this.GetUserLoginID() != userLoginID && !this.IsAdministrator())
                return Unauthorized();

            User user = DatabaseManager.Instance.GetUser(
                this.GetCourseID(), userLoginID);

            if (user == null) return BadRequest();

            return Json(
                DatabaseManager.Instance.GetUserPeerComparison(
                GetCourseID(), user.LoginID));
        }

        [Authorize]
        [HttpGet]
        [Route("/results/{userLoginID}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public ActionResult GetUserResults(string userLoginID)
        {
            // Only instructors may view submissions of other students
            if (this.GetUserLoginID() != userLoginID && !this.IsAdministrator())
                return Unauthorized();

            User user = DatabaseManager.Instance.GetUser(
                this.GetCourseID(), userLoginID);

            if (user == null) return BadRequest();

            return Json(
                DatabaseManager.Instance.GetUserResults(
                    GetCourseID(), user.LoginID));
        }

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
            return Json(
                DatabaseManager.Instance.GetLayoutColumns(GetCourseID()));
        }

        [Authorize]
        [HttpPost]
        [Route("/layout/columns")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public ActionResult CreateLayoutColumn([FromBody] LayoutColumn column)
        {
            return Json(
                DatabaseManager.Instance.CreateLayoutColumn(
                    GetCourseID(),
                    column.ContainerSize,
                    column.Position));
        }

        [Authorize(Policy = "IsInstructor")]
        [HttpPatch]
        [Route("/layout/columns/{columnID}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public ActionResult UpdateLayoutColumn(string columnID, [FromBody] LayoutColumn layoutColumn)
        {
            int id;
            bool success = Int32.TryParse(columnID, out id);

            if (success)
                return Json(
                    DatabaseManager.Instance.UpdateLayoutColumn(
                        GetCourseID(),
                        id,
                        layoutColumn.ContainerSize,
                        layoutColumn.Position));

            return BadRequest();
        }

        [Authorize(Policy = "IsInstructor")]
        [HttpDelete]
        [Route("/layout/columns/{columnID}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public ActionResult DeleteLayoutColumn(string columnID)
        {
            int id;
            bool success = Int32.TryParse(columnID, out id);

            if (success)
            {
                DatabaseManager.Instance.DeleteLayoutColumn(id);
                return NoContent();
            }

            return BadRequest();
        }

        [Authorize(Policy = "IsInstructor")]
        [HttpPatch]
        [Route("/tiles/groups/{groupID}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public ActionResult UpdateTileGroup(string groupID, [FromBody] LayoutTileGroup tileGroup)
        {
            int id;
            bool success = Int32.TryParse(groupID, out id);

            if (success)
                return Json(
                    DatabaseManager.Instance.UpdateTileGroup(
                        GetCourseID(),
                        id,
                        tileGroup.ColumnID,
                        tileGroup.Title,
                        tileGroup.Position));
            else return BadRequest();
        }
    }
}
