﻿using System;
using System.Collections.Generic;
using System.Linq;

using IguideME.Web.Models;
using IguideME.Web.Models.App;
using IguideME.Web.Models.Impl;
using IguideME.Web.Services;
using IguideME.Web.Services.LMSHandlers;

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
        private readonly ILMSHandler _lmsHandler;

        public TileController(
            ILogger<DataController> logger,
            ILMSHandler lmsHandler) : base(
                logger, lmsHandler)
        {
            this._logger = logger;
            this._lmsHandler = lmsHandler;
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
            bool success = int.TryParse(groupID, out int id);

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
            bool success = int.TryParse(tileID, out int id);

            return success
                ? Json(
                    DatabaseManager.Instance.GetGoals(GetCourseID(), id)
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
            LearningGoal stored_goal = DatabaseManager.Instance.CreateGoal(
                GetCourseID(), goal.TileID, goal.Title);

            foreach (GoalRequirement requirement in goal.Requirements)
            {
                DatabaseManager.Instance.CreateGoalRequirement(
                    stored_goal.ID,
                    requirement.TileID,
                    requirement.EntryID,
                    requirement.MetaKey,
                    requirement.Value,
                    requirement.Expression);
            }

            // load newly registered requirements into object
            stored_goal.FetchRequirements();
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
                            DatabaseManager.Instance.CreateGoalRequirement(
                                req.GoalID,
                                req.TileID,
                                req.EntryID,
                                req.MetaKey,
                                req.Value,
                                req.Expression
                            );
                            break;
                        case EditState.Updated:
                            DatabaseManager.Instance.UpdateGoalRequirement(req);
                            break;
                        case EditState.Removed:
                            DatabaseManager.Instance.DeleteGoalRequirement(req.GoalID, req.ID);
                            break;
                    }
                }
                return Json(
                    DatabaseManager.Instance.UpdateGoal(GetCourseID(), goal)
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
                DatabaseManager.Instance.DeleteGoal(GetCourseID(), id);
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
            bool success = int.TryParse(entryID, out int id);

            return success
                ? Json(
                    DatabaseManager.Instance
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
                    DatabaseManager.Instance
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
                    DatabaseManager.Instance
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
            bool success = int.TryParse(tileID, out int id);
            if (success)
            {
                Tile tile = DatabaseManager.Instance.GetTile(GetCourseID(), id);

                if (obj.GroupID != null)
                    tile.GroupID = (int)obj.GroupID;

                if (obj.Title != null)
                    tile.Title = obj.Title;

                if (obj.Notifications != null)
                    tile.Notifications = (bool)obj.Notifications;

                if (obj.Visible != null)
                    tile.Visible = (bool)obj.Visible;

                if (obj.Position != null)
                    tile.Position = (int)obj.Position;

                if (obj.GraphView != null)
                    tile.GraphView = (bool)obj.GraphView;

                if (obj.Wildcard != null)
                    tile.Wildcard = (bool)obj.Wildcard;

                DatabaseManager.Instance.UpdateTile(GetCourseID(), tile);

                return Json(
                    DatabaseManager.Instance.GetTile(GetCourseID(), id)
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
                DatabaseManager.Instance.DeleteTile(GetCourseID(), id);
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
                    DatabaseManager.Instance.GetTileSubmissionsForUser(
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
                    DatabaseManager.Instance.GetTileSubmissions(
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
                (DatabaseManager.Instance.GetConsent(course_id, userID) != 1))
                return Unauthorized();

            bool success = int.TryParse(tileID, out int id);

            if (!success)
            {
                return BadRequest();
            }

            User user = DatabaseManager.Instance.GetUser(course_id, userID);

            _logger.LogInformation("Getting discussions for user {u} with {i}", user.UserID, userID);

            List<AppDiscussion> discussions = DatabaseManager.Instance.GetDiscussionsForTile(course_id, id);

            foreach (AppDiscussion discussion in new List<AppDiscussion>(discussions))
            {
                _logger.LogInformation("found discussion for tile with title {t}", discussion.Title);
                discussions.AddRange(DatabaseManager.Instance.GetDiscussionEntries(course_id,
                    discussion.DiscussionID, user_id: user.UserID.ToString()));
                discussions.AddRange(DatabaseManager.Instance.GetDiscussionReplies(course_id,
                    discussion.DiscussionID, user_id: user.UserID.ToString()));
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
                List<LearningGoal> goals = DatabaseManager.Instance.GetGoals(GetCourseID())
                    .Where(g => g.TileID == id)
                    .ToList();

                List<AssignmentSubmission> submissions =
                    DatabaseManager.Instance.GetTileSubmissionsForUser(
                        this.GetCourseID(),
                        userID);

                var response = goals.Select(g =>
                {
                    bool success = true;
                    g.FetchRequirements();
                    foreach (GoalRequirement req in g.Requirements)
                    {
                        AssignmentSubmission submission = submissions.Find(
                            s => s.EntryID == req.EntryID);


                        if (submission == null)
                        {
                            success = false;
                        }
                        else
                        {
                            switch (req.Expression)
                            {
                                case "lte":
                                    if (submission.Grade > req.Value)
                                        success = false;
                                    break;
                                case "gte":
                                    if (submission.Grade < req.Value)
                                        success = false;
                                    break;
                                default:
                                    if (submission.Grade != req.Value)
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

            bool success = int.TryParse(entryID, out int id);

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
        public ActionResult UploadTileData(int entryID, JObject data)
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

                if (DatabaseManager.Instance.GetConsent(courseID, values[id_column]) != 1)
                {
                    continue;
                }

                int submissionID = DatabaseManager.Instance.CreateUserSubmission(courseID, new AssignmentSubmission(-1, entryID, -1, values[id_column], grade, ""),
                    DateTime.Now.ToShortDateString()
                );

                foreach (int i in range)
                {
                    DatabaseManager.Instance.CreateSubmissionMeta(
                        submissionID,
                        names[i],
                        values[i],
                        courseID
                    );
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
        public ActionResult GetEntrySubmissions(string entryID)
        {
            // TODO: check userID?
            bool success = int.TryParse(entryID, out int entry_id);

            return success
                ? Json(
                    DatabaseManager.Instance.GetTileEntrySubmissions(
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
                DatabaseManager.Instance.GetTileSubmissionsForUser(
                    this.GetCourseID(), userID));
        }

        [Authorize]
        [HttpGet]
        [Route("/tiles/grade-history/{userID}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public ActionResult GetTileHistory(string userID)
        {
            User user = DatabaseManager.Instance.GetUser(
                this.GetCourseID(), userID);

            return user == null
                ? BadRequest()
                : Json(
                DatabaseManager.Instance.GetHistoricComparison(
                    this.GetCourseID(), userID));

        }

        [Authorize]
        [HttpGet]
        [Route("/peer-comparison/{userID}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public ActionResult GetPeerComparison(string userID)
        {
            // Only instructors may view peer comparisons of other students
            if (this.GetUserID() != userID && !this.IsAdministrator())
                return Unauthorized();

            User user = DatabaseManager.Instance.GetUser(
                this.GetCourseID(), userID);

            return user == null
                ? BadRequest()
                : Json(
                DatabaseManager.Instance.GetUserPeerComparison(
                GetCourseID(), user.UserID));
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

            User user = DatabaseManager.Instance.GetUser(
                this.GetCourseID(), userID);

            return user == null
                ? BadRequest()
                : Json(
                DatabaseManager.Instance.GetUserResults(
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
            bool success = int.TryParse(columnID, out int id);

            return success
                ? Json(
                    DatabaseManager.Instance.UpdateLayoutColumn(
                        GetCourseID(),
                        id,
                        layoutColumn.ContainerSize,
                        layoutColumn.Position))
                : BadRequest();
        }

        [Authorize(Policy = "IsInstructor")]
        [HttpDelete]
        [Route("/layout/columns/{columnID}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public ActionResult DeleteLayoutColumn(string columnID)
        {
            bool success = int.TryParse(columnID, out int id);

            if (success)
            {
                DatabaseManager.Instance.DeleteLayoutColumn(GetCourseID(), id);
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
            bool success = int.TryParse(groupID, out int id);

            return success
                ? Json(
                    DatabaseManager.Instance.UpdateTileGroup(
                        GetCourseID(),
                        id,
                        tileGroup.ColumnID,
                        tileGroup.Title,
                        tileGroup.Position))
                : BadRequest();
        }
    }
}
