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
        private readonly ILogger<DataController> _logger;
        private readonly CanvasHandler _canvasHandler;
        private readonly DatabaseManager _databaseManager;

        public TileController(
            ILogger<DataController> logger,
            CanvasHandler canvasHandler,
            DatabaseManager databaseManager) : base(
                logger)
        {
            _logger = logger;
            _canvasHandler = canvasHandler;
            _databaseManager = databaseManager;
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
            int tilesInGroup = _databaseManager.GetTiles(GetCourseID())
                .Where(t => t.GroupID == tile.GroupID)
                .Count();

            Tile newTile = _databaseManager.CreateTile(
                GetCourseID(),
                tile.GroupID,
                tile.Title,
                tilesInGroup + 1,
                (int)tile.Type,
                tile.Weight,
                tile.Visible,
                tile.Notifications
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
                _databaseManager.GetTiles(GetCourseID(), true));
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
                    _databaseManager.GetLayoutTileGroups(GetCourseID()));
        }

        [Authorize(Policy = "IsInstructor")]
        [HttpPost]
        [Route("/tiles/group")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public ActionResult PostTileGroup([FromBody] LayoutTileGroup obj)
        {
            _databaseManager.CreateLayoutTileGroup(GetCourseID(), obj.Title, obj.Position);
            return Json(
                    _databaseManager.GetLayoutTileGroups(GetCourseID()));
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
            bool success = int.TryParse(groupID, out int id);

            if (success)
            {
                _databaseManager.DeleteLayoutTileGroup(id);
                return Json(
                        _databaseManager.GetLayoutTileGroups(GetCourseID()));
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
            List<LearningGoal> goals = _databaseManager.GetGoals(GetCourseID());
            return Json(goals);
        }

        [Authorize]
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [Route("/tiles/{tileID}/goals")]
        public ActionResult GetTileGoals(string tileID)
        {
            bool success = int.TryParse(tileID, out int id);

            return success
                ? Json(
                    _databaseManager.GetGoals(GetCourseID(), id)
                )
                : BadRequest();
        }

        [Authorize(Policy = "IsInstructor")]
        [HttpPost]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [Route("/tiles/goals")]
        public ActionResult CreateTileGoal([FromBody] LearningGoal goal)
        {
            LearningGoal stored_goal = _databaseManager.CreateGoal(
                GetCourseID(), goal.TileID, goal.Title);

            foreach (GoalRequirement requirement in goal.Requirements)
            {
                _databaseManager.CreateGoalRequirement(
                    stored_goal.ID,
                    requirement.AssignmentID,
                    (int)requirement.Expression,
                    requirement.Value);
            }

            // load newly registered requirements into object
            stored_goal.Requirements = _databaseManager.GetGoalRequirements(stored_goal.ID);
            return Json(stored_goal);
        }

        [Authorize(Policy = "IsInstructor")]
        [HttpPatch]
        [Route("/tiles/goals/{tileID}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public ActionResult PatchTileGoal(string tileID, [FromBody] LearningGoal goal)
        {
            bool success = int.TryParse(tileID, out _);

            if (success)
            {
                foreach (GoalRequirement req in goal.Requirements)
                {
                    switch (req.State)
                    {
                        case EditState.New:
                            _databaseManager.CreateGoalRequirement(
                                req.GoalID,
                                req.AssignmentID,
                                (int)req.Expression,
                                req.Value
                            );
                            break;
                        case EditState.Updated:
                            _databaseManager.UpdateGoalRequirement(req);
                            break;
                        case EditState.Removed:
                            _databaseManager.DeleteGoalRequirement(req.ID);
                            break;
                    }
                }
                return Json(
                    _databaseManager.UpdateGoal(GetCourseID(), goal)
                );
            }

            return BadRequest();
        }

        [Authorize(Policy = "IsInstructor")]
        [HttpDelete]
        [Route("/tiles/goals/{goalID}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public ActionResult DeleteTileGoal(string goalID)
        {
            bool success = int.TryParse(goalID, out int id);
            _logger.LogInformation("deleting goal");

            if (success)
            {
                _databaseManager.DeleteGoal(GetCourseID(), id);
                return NoContent();
            }

            return BadRequest();
        }

        [Authorize]
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [Route("/tiles/entries")]
        public ActionResult GetTileEntries()
        {
            List<TileEntry> entries = _databaseManager.GetEntries(GetCourseID());
            return Json(entries);
        }

        [Authorize(Policy = "IsInstructor")]
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        // DBrefTODO: [Route("/tiles/entries/{entryID}/meta-keys")]
        [Route("/tiles/entries/{assignmentID}/meta-keys")]
        public ActionResult GetTileEntryMetaKeys(string assignmentID)
        {
            bool success = int.TryParse(assignmentID, out int id);

            return success
                ? Json(
                    _databaseManager
                        .GetEntryMetaKeys(id).ToArray())
                : BadRequest();
        }

        [Authorize]
        [HttpGet]
        [Route("/tiles/{tileID}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public ActionResult GetTile(string tileID)
        {
            bool success = int.TryParse(tileID, out int id);

            return success
                ? Json(
                    _databaseManager
                    .GetTile(GetCourseID(), id))
                : BadRequest();
        }

        [Authorize]
        [HttpGet]
        [Route("/tiles/{tileID}/entries")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public ActionResult GetTileEntries(string tileID)
        {
            bool success = int.TryParse(tileID, out int id);

            return success
                ? Json(
                    _databaseManager
                    .GetTileEntries(id).ToArray())
                : BadRequest();
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

            [JsonProperty(PropertyName = "order")]
            public int? Order { get; set; }

            // [JsonProperty(PropertyName = "graph_view")]
            // public bool? GraphView { get; set; }

            // [JsonProperty(PropertyName = "wildcard")]
            // public bool? Wildcard { get; set; }
        }

        [Authorize(Policy = "IsInstructor")]
        [HttpPatch]
        [Route("/tiles/{tileID}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public ActionResult PatchTile(string tileID, [FromBody] JSONRequest obj)
        {
            bool success = int.TryParse(tileID, out int id);
            if (success)
            {
                Tile tile = _databaseManager.GetTile(GetCourseID(), id);

                if (obj.GroupID != null)
                    tile.GroupID = (int)obj.GroupID;

                if (obj.Title != null)
                    tile.Title = obj.Title;

                if (obj.Notifications != null)
                    tile.Notifications = (bool)obj.Notifications;

                if (obj.Visible != null)
                    tile.Visible = (bool)obj.Visible;

                if (obj.Order != null)
                    tile.Order = (int)obj.Order;

                _databaseManager.UpdateTile(tile);

                return Json(
                    _databaseManager.GetTile(GetCourseID(), id)
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
            bool success = int.TryParse(tileID, out int id);

            if (success)
            {
                _databaseManager.DeleteTile(GetCourseID(), id);
                return NoContent();
            }

            return BadRequest();
        }

        [Authorize]
        [HttpGet]
        [Route("/tiles/{tileID}/submissions/{userID}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public ActionResult GetSubmissions(string tileID, string userID)
        {
            // Only instructors may view submissions of other students
            if (this.GetUserID() != userID &&
                !this.IsAdministrator())
                return Unauthorized();

            bool success = int.TryParse(tileID, out int id);

            return success
                ? Json(
                    _databaseManager.GetTileSubmissionsForUser(
                        this.GetCourseID(), id, userID))
                : BadRequest();
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

            bool success = int.TryParse(tileID, out int id);

            return success
                ? Json(
                    _databaseManager.GetTileSubmissions(
                        this.GetCourseID(), id))
                : BadRequest();
        }

        [Authorize]
        [HttpGet]
        [Route("/tiles/{tileID}/discussions/{userID}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public ActionResult GetDiscussions(string tileID, string userID)
        {
            int course_id = this.GetCourseID();
            // Only instructors may view submissions of other students
            if ((this.GetUserID() != userID &&
                !this.IsAdministrator()) ||
                !_databaseManager.GetUserConsent(course_id, userID))
                return Unauthorized();

            bool success = int.TryParse(tileID, out int id);

            if (!success)
            {
                return BadRequest();
            }

            User user = _databaseManager.GetUser(course_id, userID);

            List<AppDiscussion> discussions = _databaseManager.GetDiscussionsForTile(id);

            foreach (AppDiscussion discussion in new List<AppDiscussion>(discussions))
            {
                discussions.AddRange(_databaseManager.GetDiscussionEntries(
                    discussion.ID, user_id: user.UserID.ToString()));
                discussions.AddRange(_databaseManager.GetDiscussionReplies(
                    discussion.ID, user_id: user.UserID.ToString()));
            }

            return Json(discussions);
        }

        [Authorize]
        [HttpGet]
        [Route("/tiles/{tileID}/learning-outcomes/{userID}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public ActionResult GetLearningOutcomes(string tileID, string userID)
        {
            // Only instructors may view submissions of other students
            if (this.GetUserID() != userID &&
                !this.IsAdministrator())
                return Unauthorized();

            bool success = int.TryParse(tileID, out int id);

            if (success)
            {
                List<LearningGoal> goals = _databaseManager.GetGoals(GetCourseID())
                    .Where(g => g.TileID == id)
                    .ToList();

                List<AssignmentSubmission> submissions =
                    _databaseManager.GetTileSubmissionsForUser(
                        this.GetCourseID(),
                        userID);

                var response = goals.Select(g =>
                {
                    bool success = true;
                    g.Requirements = _databaseManager.GetGoalRequirements(g.ID);
                    foreach (GoalRequirement req in g.Requirements)
                    {
                        AssignmentSubmission submission = submissions.Find(
                            s => s.AssignmentID == req.AssignmentID);


                        if (submission == null)
                        {
                            success = false;
                        }
                        else
                        {
                            switch (req.Expression)
                            {
                                case GoalRequirement.LogicalExpressions.Less:
                                    if (submission.Grade >= req.Value)
                                        success = false;
                                    break;
                                case GoalRequirement.LogicalExpressions.LessEqual:
                                    if (submission.Grade > req.Value)
                                        success = false;
                                    break;
                                case GoalRequirement.LogicalExpressions.Equal:
                                    if (submission.Grade != req.Value)
                                        success = false;
                                    break;
                                case GoalRequirement.LogicalExpressions.GreaterEqual:
                                    if (submission.Grade < req.Value)
                                        success = false;
                                    break;
                                case GoalRequirement.LogicalExpressions.Greater:
                                    if (submission.Grade <= req.Value)
                                        success = false;
                                    break;
                                default:
                                    if (submission.Grade == req.Value)
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
        // DBrefTODO: The entry should be changed into the updated version of it
        // Which means, being able to retrieve a tileID and a contentID
        public void CreateEntry([FromBody] TileEntry entry)
        {
            _databaseManager.CreateTileEntry(entry);

            // return  Json(_databaseManager
            //     .GetEntries(this.GetCourseID())
            //     .Find(e => e.ID == entryID));
        }

        [Authorize(Policy = "IsInstructor")]
        [HttpDelete]
        [Route("/entries/{entryID}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public ActionResult DeleteEntry(string entryID)
        {

            bool success = int.TryParse(entryID, out int id);

            if (success)
            {
                _databaseManager.DeleteTileEntry(id);
                return NoContent();
            }

            return BadRequest();
        }

        [Authorize(Policy = "IsInstructor")]
        [HttpPost]
        // DBrefTODO: The entry Id should be changed into assignmentID
        // [Route("/entries/{entryID}/upload")]
        [Route("/entries/{assignmentID}/upload")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public ActionResult UploadTileData(int assignmentID, JObject data)
        {
            int courseID = this.GetCourseID();

            int id_column = data["id_column"].ToObject<int>();
            int grade_column = data["grade_column"].ToObject<int>();
            JArray table = (JArray)data["data"];

            string[] names = table[0].ToObject<string[]>();

            IEnumerable<int> range = Enumerable.Range(0, names.Length).Where(i => i != id_column && i != grade_column);
            foreach (JArray row in table.Cast<JArray>().Skip(1))
            {

                string[] values = row.ToObject<string[]>();

                _ = float.TryParse(values[grade_column], out float grade);

                int submissionID = _databaseManager.CreateUserSubmission(
                    assignmentID,
                    values[id_column],
                    grade,
                    DateTimeOffset.UtcNow.ToUnixTimeMilliseconds()
                );

                foreach (int i in range)
                {
                    _databaseManager.CreateSubmissionMeta(
                        submissionID,
                        names[i],
                        values[i]
                    );
                }
            }

            return NoContent();
        }

        [Authorize(Policy = "IsInstructor")]
        [HttpGet]
        // DBrefTODO: The entry Id should be changed into assignmentID
        // [Route("/entries/{entryID}/submissions")]
        [Route("/entries/{assignmentID}/submissions")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public ActionResult GetEntrySubmissions(string assignmentID)
        {
            // TODO: check userID?
            bool success = int.TryParse(assignmentID, out int entry_id);

            return success
                ? Json(
                    _databaseManager.GetAssignmentSubmissions(
                        this.GetCourseID(), entry_id))
                : BadRequest();
        }

        [Authorize]
        [HttpGet]
        [Route("/tiles/grade-summary/{userID}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public ActionResult GetGradeSummary(string userID)
        {
            // Only instructors may view submissions of other students
            return this.GetUserID() != userID && !this.IsAdministrator()
                ? Unauthorized()
                : Json(
                _databaseManager.GetTileSubmissionsForUser(
                    this.GetCourseID(), userID));
        }

        [Authorize]
        [HttpGet]
        [Route("/tiles/grade-history/{userID}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public ActionResult GetTileHistory(string userID)
        {
            User user = _databaseManager.GetUser(
                this.GetCourseID(), userID);

            return user == null
                ? BadRequest()
                : Json(
                _databaseManager.GetHistoricComparison(
                    this.GetCourseID(), userID));

        }

        //TODO: Change the route in the frontend
        [Authorize]
        [HttpGet]
        [Route("/peer-comparison/tiles/{userID}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public ActionResult GetPeerComparisonForTiles(string userID)
        {
            // Only instructors may view peer comparisons of other students
            if (this.GetUserID() != userID && !this.IsAdministrator())
                return Unauthorized();

            User user = _databaseManager.GetUser(
                this.GetCourseID(), userID);

            return user == null
                ? BadRequest()
                : Json(
                _databaseManager.GetUserPeerComparison(
                GetCourseID(),
                user.UserID,
                (int)Services.Workers.Comparison_Entity_Types.tile,
                GetHashCode()));
        }

        //TODO: Create the route in the frontend
        [Authorize]
        [HttpGet]
        [Route("/peer-comparison/assignments/{userID}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public ActionResult GetPeerComparisonForAssignments(string userID)
        {
            // Only instructors may view peer comparisons of other students
            if (this.GetUserID() != userID && !this.IsAdministrator())
                return Unauthorized();

            User user = _databaseManager.GetUser(
                this.GetCourseID(), userID);

            return user == null
                ? BadRequest()
                : Json(
                _databaseManager.GetUserPeerComparison(
                GetCourseID(),
                user.UserID,
                (int)Services.Workers.Comparison_Entity_Types.assignment,
                GetHashCode()));
        }

        [Authorize]
        [HttpGet]
        [Route("/results/{userID}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public ActionResult GetUserResults(string userID)
        {
            // Only instructors may view submissions of other students
            if (this.GetUserID() != userID && !this.IsAdministrator())
                return Unauthorized();

            User user = _databaseManager.GetUser(
                this.GetCourseID(), userID);

            return user == null
                ? BadRequest()
                : Json(
                _databaseManager.GetUserResults(
                    GetCourseID(), user.UserID));
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
                _databaseManager.GetLayoutColumns(GetCourseID()));
        }

        // TODO: change to accept a list/array and replace the columns in the database
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
            // return Json(
            //     _databaseManager.CreateLayoutColumn(
            //         GetCourseID(),
            //         (int) column.ContainerSize,
            //         column.Position));

            return Ok();
        }

        [Authorize(Policy = "IsInstructor")]
        [HttpPatch]
        [Route("/tiles/groups/{groupID}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public ActionResult UpdateTileGroup(string groupID, [FromBody] LayoutTileGroup tileGroup)
        {
            bool success = int.TryParse(groupID, out int id);

            _logger.LogInformation("position {p}", tileGroup.Position);

            return success
                ? Json(
                    _databaseManager.UpdateTileGroup(
                        GetCourseID(),
                        id,
                        tileGroup.ColumnID,
                        tileGroup.Title,
                        tileGroup.Position))
                : BadRequest();
        }

        [Authorize(Policy = "IsInstructor")]
        [HttpPatch]
        [Route("/tiles/groups/order")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public void UpdateTileGroupOrder([FromBody] int[] ids)
        {
            _databaseManager.UpdateTileGroupOrder(ids);
        }
    }
}
