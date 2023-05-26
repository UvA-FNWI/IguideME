using System;
using System.Collections.Generic;
using System.Data.SQLite;
using System.Data;
using IguideME.Web.Models;
using IguideME.Web.Models.App;
using IguideME.Web.Models.Impl;
using Microsoft.Extensions.Logging;
using Discussion = UvA.DataNose.Connectors.Canvas.Discussion;
using DiscussionEntry = UvA.DataNose.Connectors.Canvas.DiscussionEntry;
using DiscussionReply = UvA.DataNose.Connectors.Canvas.DiscussionReply;
using System.Linq;

namespace IguideME.Web.Services
{

    public sealed class DatabaseManager
    {
        private static DatabaseManager s_instance;
        private readonly string _connection_string;
        private readonly ILogger _logger;

        DatabaseManager(bool isDev = false) {
            DatabaseManager.s_instance = this;
            _connection_string = isDev ? "Data Source=db.sqlite;Version=3;New=False;Compress=True;"
                                      : "Data Source=/data/IguideME.db;Version=3;New=False;Compress=True;";

            DatabaseManager.s_instance.RunMigrations();
            DatabaseManager.s_instance.CreateTables();
            ILoggerFactory factory = LoggerFactory.Create(builder => builder.AddConsole());
            _logger = factory.CreateLogger("DatabaseManager");
        }

        // TODO: I think we want the database manager to just be a singleton that we add using dependency injection just like canvashandler (although that one maybe shouldn't be singleton probably)
        public static void Initialize(bool isDev = false)
        {
            new DatabaseManager(isDev);
        }

        public static DatabaseManager Instance
        {
            get { return s_instance; }
        }

        private SQLiteConnection GetConnection() => new(_connection_string);

        private void NonQuery(string query, params SQLiteParameter[] parameters)
        {
            SQLiteConnection connection = GetConnection();
            try {
                connection.Open();
                using(SQLiteCommand command = connection.CreateCommand())
                {
                    command.CommandText = query;
                    foreach (SQLiteParameter param in parameters) {
                        command.Parameters.Add(param);
                    }
                    command.ExecuteNonQuery();
                }
                connection.Close();
            } catch {
                // Close connection before rethrowing
                connection.Close();
                throw;
            }
        }

        private int IDNonQuery(string query, params SQLiteParameter[] parameters)
        {
            int id = 0;
            SQLiteConnection connection = GetConnection();
            try {
                connection.Open();
                using(SQLiteCommand command = connection.CreateCommand())
                {
                    command.CommandText = query;
                    foreach (SQLiteParameter param in parameters) {
                        command.Parameters.Add(param);
                    }
                    command.ExecuteNonQuery();
                }

                using(SQLiteCommand command = connection.CreateCommand())
                {
                    command.CommandText = "SELECT last_insert_rowid()";
                    id = int.Parse(command.ExecuteScalar().ToString());
                }
                connection.Close();
            } catch {
                // Close connection before rethrowing
                connection.Close();
                throw;
            }

            return id;
        }

        private SQLiteDataReader Query(string query, params SQLiteParameter[] parameters)
        {
            SQLiteConnection connection = GetConnection();
            try {
                connection.Open();
                using(SQLiteCommand command = connection.CreateCommand())
                {
                    command.CommandText = query;
                    foreach (SQLiteParameter param in parameters) {
                        command.Parameters.Add(param);
                    }
                    return command.ExecuteReader(CommandBehavior.CloseConnection);
                }
            } catch (Exception e) {
                // Close connection before rethrowing
                _logger.LogError("Exception encountered while creating query: {message}\n {trace}", e.Message, e.StackTrace);
                connection.Close();
                throw;
            }
        }

        private void PrintQueryError(string title, int rows, SQLiteDataReader r, Exception e) {
            string error = $"{title}\nRequested:\nColumn | Data Type | Value | Type\n";

            try {
                for (int i = 0; i <= rows; i++)
                    error += $"{r.GetName(i)} {r.GetDataTypeName(i)} {r.GetValue(i)} {r.GetValue(i).GetType()}\n";

                _logger.LogError("Error reading from the query: {error} \n\n {message} \n {trace}", error, e.Message, e.StackTrace);
            } catch (Exception ex) {
                _logger.LogError("Error in printquerryerror: {message} {trace}\n\nOriginal error:\n{original} {originaltrace}", ex.Message, ex.StackTrace, e.Message, e.StackTrace);
            }
        }

        public void LogTable(string name) {
            _logger.LogInformation("Logging table {name}", name);

            string table = "";
            using (SQLiteDataReader r = Query("select * from @name", new SQLiteParameter("name", name)))
            {
                for (int i = 0; i < r.FieldCount; i++)
                {
                    table += r.GetName(i) + "\t";
                }
                table += "\n\n";
                while (r.Read()) {
                    for (int i = 0; i < r.FieldCount; i++) {
                        table += r.GetValue(i).ToString() + "\t";
                    }
                    table += "\n";
                }
            }

            _logger.LogInformation("contents:\n {table}", table);

        }

        private void CreateTables()
        {
            // collection of all table creation queries
            string[] queries =
            {
                DatabaseQueries.CREATE_TABLE_COURSE_SETTINGS,
                DatabaseQueries.CREATE_TABLE_USER_SETTINGS,
                DatabaseQueries.CREATE_TABLE_USER_TRACKER,
                DatabaseQueries.CREATE_TABLE_PEER_GROUP,
                DatabaseQueries.CREATE_TABLE_SYNC_HISTORY,
                DatabaseQueries.CREATE_TABLE_LAYOUT_COLUMN,
                DatabaseQueries.CREATE_TABLE_LAYOUT_TILE_GROUP,
                DatabaseQueries.CREATE_TABLE_TILE,
                DatabaseQueries.CREATE_TABLE_TILE_ENTRY,
                DatabaseQueries.CREATE_TABLE_TILE_ENTRY_SUBMISSION,
                DatabaseQueries.CREATE_TABLE_TILE_ENTRY_SUBMISSION_META,
                DatabaseQueries.CREATE_TABLE_EXTERNAL_DATA,
                DatabaseQueries.CREATE_TABLE_CANVAS_USER,
                DatabaseQueries.CREATE_TABLE_CANVAS_ASSIGNMENT,
                DatabaseQueries.CREATE_TABLE_CANVAS_DISCUSSION,
                DatabaseQueries.CREATE_TABLE_CANVAS_DISCUSSION_ENTRY,
                DatabaseQueries.CREATE_TABLE_CANVAS_DISCUSSION_REPLY,
                DatabaseQueries.CREATE_TABLE_GRADE_PREDICTION_MODEL,
                DatabaseQueries.CREATE_TABLE_GRADE_PREDICTION_MODEL_PARAMETER,
                DatabaseQueries.CREATE_TABLE_PREDICTED_GRADE,
                DatabaseQueries.CREATE_TABLE_LEARNING_GOALS,
                DatabaseQueries.CREATE_TABLE_GOAL_REQUREMENTS,
                DatabaseQueries.CREATE_TABLE_NOTIFICATIONS,
                DatabaseQueries.CREATE_TABLE_ACCEPT_LIST,
                DatabaseQueries.CREATE_TABLE_MIGRATIONS,
            };

            // create tables if they do not exist
            foreach (string query in queries)
                NonQuery(query);
        }

        private void RunMigrations()
        {
            foreach (KeyValuePair<string, string> entry in DatabaseQueries.MIGRATIONS)
            {
                string migration_id = entry.Key;
                using (SQLiteDataReader r = Query(DatabaseQueries.QUERY_MIGRATIONS, new SQLiteParameter("id", migration_id)))
                    if (r.HasRows)
                        continue;

                // _logger.LogInformation("Migration {id} not yet applied, proceeding to apply...", migration_id);

                Console.WriteLine($"Migration {migration_id} not yet applied, proceeding to apply...");

                string migration_sql = entry.Value;
                NonQuery(migration_sql);
                NonQuery(DatabaseQueries.REGISTER_MIGRATION, new SQLiteParameter("id", migration_id));
            }
        }

        private string GetCurrentHash(int courseID)
        {
            /**
             * Retrieve latest complete synchronization for course. If no
             * historic synchronization was found then null is returned.
             */
            using (SQLiteDataReader r = Query(DatabaseQueries.QUERY_LATEST_SYNCS_FOR_COURSE,
                                              new SQLiteParameter("courseID", courseID),
                                              new SQLiteParameter("limit", 1)))
                if (r.Read())
                    return r.GetValue(0).ToString();

            return null;
        }

        private List<string> GetRecentHashes(int courseID, int number_of_hashes)
        {
            /**
             * Retrieve latest n complete synchronizations for course. If no
             * historic synchronization was found then null is returned.
             */

            List<string> hashes = new();

            using (SQLiteDataReader r = Query(DatabaseQueries.QUERY_LATEST_SYNCS_FOR_COURSE,
                                              new SQLiteParameter("courseID", courseID),
                                              new SQLiteParameter("limit", number_of_hashes)))
                while (r.Read()) {
                    hashes.Add(r.GetValue(0).ToString());
                }

            return hashes;
        }

        public void CleanupSync(int courseID) {
            RemoveSyncsWithStatus(courseID, "BUSY");

            List<string> hashes = new();

            using (SQLiteDataReader r = Query(DatabaseQueries.QUERY_OLD_HASHES_FOR_COURSE,
                                              new SQLiteParameter("courseID", courseID),
                                              new  SQLiteParameter("offset", 15))) {
                while (r.Read()) {
                    try {
                        hashes.Add(r.GetValue(0).ToString());
                    } catch (Exception e) {
                        _logger.LogError("Unable to get old sync: {sync}\nError: {message}\n{trace}", r.GetValue(0), e.Message, e.StackTrace);
                    }
                }
            }
            foreach (string hash in hashes) {
                NonQuery(DatabaseQueries.DELETE_OLD_SYNCS_FOR_COURSE, new SQLiteParameter("courseID", courseID), new SQLiteParameter("hash", hash));
            }
        }

        public bool IsCourseRegistered(int courseID)
        {
            using (SQLiteDataReader r = Query(DatabaseQueries.QUERY_DOES_COURSE_EXIST, new SQLiteParameter("courseID", courseID)))
                return r.Read();
        }

        public void RegisterCourse(int courseID, string courseName)
        {
            /**
             * Create a new course.
             */
            NonQuery(DatabaseQueries.REGISTER_COURSE,
                new SQLiteParameter("courseID", courseID),
                new SQLiteParameter("courseName", courseName));
        }

        public List<int> GetCourseIds()
        {
            List<int> course_ids = new();
            using (SQLiteDataReader r = Query(DatabaseQueries.QUERY_COURSE_IDS)) {
                try {
                    while (r.Read()) {
                        course_ids.Add(r.GetInt32(0));
                    }

                } catch (Exception e) {
                    PrintQueryError("GetCourseIds", 0, r, e);
                }
            }
            return course_ids;
        }


        public void RemoveSyncsWithStatus(int courseID, string status) {
            _logger.LogInformation("Starting cleanup of sync hystory ");
            try {
                NonQuery(
                    DatabaseQueries.DELETE_INCOMPLETE_SYNCS,
                    new SQLiteParameter("courseID", courseID),
                    new SQLiteParameter("status", status)
                );
            } catch (Exception e) {
                _logger.LogError("Error removing syncs: {message}\n{trace}", e.Message, e.StackTrace);
            }
        }

        public void RegisterSync(
            int courseID,
            string hashCode)
        {
            /**
             * Create a new synchronization record.
             */
            NonQuery(
                DatabaseQueries.REGISTER_NEW_SYNC,
                new SQLiteParameter("courseID", courseID),
                new SQLiteParameter("hash", hashCode)
            );
        }

        public void CompleteSync(string hashCode)
        {
            /**
             * Update synchronization record state to completed.
             */
            NonQuery(
                DatabaseQueries.COMPLETE_NEW_SYNC,
                new SQLiteParameter("hash", hashCode)
            );
        }

        public List<DataSynchronization> GetSyncHashes(int courseID)
        {
            /**
             * Return all synchronization records for a course.
             */
            List<DataSynchronization> hashes = new();

            using (SQLiteDataReader r = Query(DatabaseQueries.QUERY_SYNC_HASHES_FOR_COURSE, new SQLiteParameter("courseID", courseID))) {
                while (r.Read()) {
                    try {
                        DateTime endtime = r.GetValue(3).GetType() != typeof(DBNull) ? r.GetDateTime(3) : new DateTime();

                        hashes.Add(new DataSynchronization(
                            r.GetInt32(0),
                            r.GetInt32(1),
                            r.GetDateTime(2),
                            endtime,
                            r.GetValue(4).ToString(),
                            r.GetValue(5).ToString())
                        );
                    } catch (Exception e) {
                        PrintQueryError("GetSyncHashes", 5, r, e);
                    }
                }
            }

            return hashes;
        }

        public int GetMinimumPeerGroupSize(int courseID)
        {

            using(SQLiteDataReader r = Query(DatabaseQueries.QUERY_PEER_GROUP_FOR_COURSE, new SQLiteParameter("courseID", courseID))) {
                if (r.Read())
                    return r.GetInt32(0);
            }

            return 1;
        }

        // TODO: do we need this function?
        public bool HasPersonalizedPeers(int courseID)
        {
            using (SQLiteDataReader r = Query(DatabaseQueries.QUERY_PERSONALIZED_PEERS_FOR_COURSE, new SQLiteParameter("courseID", courseID)))
                if (r.Read())
                    return r.GetBoolean(0);

            return true;
        }

        public List<string> GetNotificationDates(int courseID)
        {
            List<string> dates = new();
            using (SQLiteDataReader r = Query(DatabaseQueries.QUERY_NOTIFICATION_DATES_FOR_COURSE, new SQLiteParameter("courseID", courseID)))
                if (r.Read())
                    return r.GetValue(0).ToString().Split(new char[] {',','-'}).ToList();

            return dates;
        }

        public void RegisterUser(
            int courseID,
            int? studentnumber,
            string userID,
            string name,
            string sortableName,
            string role,
            string syncHash)
        {
            NonQuery(DatabaseQueries.REGISTER_USER_FOR_COURSE,
                    new SQLiteParameter("courseID", courseID),
                    new SQLiteParameter("studentnumber", studentnumber),
                    new SQLiteParameter("userID", userID),
                    new SQLiteParameter("name", name),
                    new SQLiteParameter("sortableName", sortableName),
                    new SQLiteParameter("role", role),
                    new SQLiteParameter("syncHash", syncHash)
                    );
        }

        public void RegisterAssignment(
            int? assignmentID,
            int courseID,
            string name,
            bool published,
            bool muted,
            string dueDate,
            double? pointsPossible,
            int? position,
            int gradingType,
            string submissionType,
            string syncHash)
        {
            NonQuery(
                DatabaseQueries.REGISTER_CANVAS_ASSIGNMENT,
                new SQLiteParameter("assignmentID", assignmentID.ToString()),
                new SQLiteParameter("courseID", courseID),
                new SQLiteParameter("name", name),
                new SQLiteParameter("published", published),
                new SQLiteParameter("muted", muted),
                new SQLiteParameter("dueDate", dueDate),
                new SQLiteParameter("pointsPossible", pointsPossible),
                new SQLiteParameter("position", position),
                new SQLiteParameter("gradingType", gradingType),
                new SQLiteParameter("submissionType", submissionType),
                new SQLiteParameter("hash", syncHash)
            );
        }

        public void RegisterDiscussion(Discussion discussion, string syncHash)
        {
            NonQuery(
                DatabaseQueries.REGISTER_CANVAS_DISCUSSION,
                new SQLiteParameter("id", discussion.ID),
                new SQLiteParameter("courseID", discussion.CourseID),
                new SQLiteParameter("title", discussion.Title),
                new SQLiteParameter("userName", discussion.UserName),
                new SQLiteParameter("postedAt", discussion.PostedAt),
                new SQLiteParameter("message", discussion.Message),
                // new SQLiteParameter("message", discussion.Message.Replace("'", "''")), // TODO: remove if didn't break
                new SQLiteParameter("hash", syncHash)
            );
        }

        public void UpdateDiscussion(Discussion discussion, int tileID, string hash) {
            NonQuery(
                DatabaseQueries.UPDATE_CANVAS_DISCUSSION,
                new SQLiteParameter("id", discussion.ID),
                new SQLiteParameter("courseID", discussion.CourseID),
                new SQLiteParameter("title", discussion.Title),
                new SQLiteParameter("userName", discussion.UserName),
                new SQLiteParameter("postedAt", discussion.PostedAt),
                new SQLiteParameter("message", discussion.Message),
                // new SQLiteParameter("message", discussion.Message.Replace("'", "''")),
                new SQLiteParameter("tileID", tileID),
                new SQLiteParameter("hash", hash)
            );
        }

        public int RegisterDiscussionEntry(DiscussionEntry entry, string userID)
        {
            return IDNonQuery(
                    DatabaseQueries.REGISTER_CANVAS_DISCUSSION_ENTRY,
                    new SQLiteParameter("courseID", entry.CourseID),
                    new SQLiteParameter("topicID", entry.TopicID),
    				new SQLiteParameter("postedAt", entry.CreatedAt),
                    new SQLiteParameter("message", entry.Message),
                    // new SQLiteParameter("message", entry.Message.Replace("'", "''")),
                    new SQLiteParameter("postedBy", userID)
            );
        }

        public void RegisterDiscussionReply(DiscussionReply reply, int entry_id, string userID)
        {
            if (entry_id == -1) {
                return;
            }

            NonQuery(
                DatabaseQueries.REGISTER_CANVAS_DISCUSSION_REPLY,
                new SQLiteParameter("entryID", entry_id),
                new SQLiteParameter("userID", userID),
                new SQLiteParameter("postedAt", reply.CreatedAt),
                new SQLiteParameter("message", reply.Message)
            );
        }

        public List<User> GetUsers(int courseID, string role = "*", string hash = null)
        {
            string activeHash = hash ?? this.GetCurrentHash(courseID);
            if (activeHash == null)
            {
                _logger.LogInformation("Hash is null, returning empty user list.");
                return new List<User>() { };
            }

            List<User> users = new();

            using (SQLiteDataReader r = Query(DatabaseQueries.QUERY_USERS_WITH_ROLE_FOR_COURSE,
                    new SQLiteParameter("courseID", courseID),
                    new SQLiteParameter("role", role),
                    new SQLiteParameter("hash", activeHash)
                )) {
                // collect all users
                while (r.Read())
                {
                    User user = new(
                        r.GetInt32(0),
                        courseID,
                        r.GetInt32(1),
                        r.GetValue(2).ToString(),
                        r.GetValue(3).ToString(),
                        r.GetValue(4).ToString(),
                        r.GetValue(5).ToString()
                    );
                    users.Add(user);
                }
            }

            return users;
        }

        public string GetUserID(int courseID, int id) {
            string hash = this.GetCurrentHash(courseID);

            if (hash == null) return null;

            using (SQLiteDataReader r = Query(DatabaseQueries.QUERY_USER_ID,
                    new SQLiteParameter("courseID", courseID),
                    new SQLiteParameter("id", id),
                    new SQLiteParameter("hash", hash)
                )) {
                if (r.Read())
                {
                    return r.GetValue(0).ToString();
                }
            }

            return null;
        }

        public User GetUser(int courseID, string userID, string hash = null)
        {
            string activeHash = hash ?? this.GetCurrentHash(courseID);
            if (activeHash == null) return null;

            User user = null;
            using (SQLiteDataReader r = Query(DatabaseQueries.QUERY_USER_FOR_COURSE,
                    new SQLiteParameter("courseID", courseID),
                    new SQLiteParameter("userID", userID),
                    new SQLiteParameter("hash", activeHash)
                )) {
                if (r.Read())
                {
                    user = new User(
                        r.GetInt32(0),
                        courseID,
                        r.GetInt32(1),
                        r.GetValue(2).ToString(),
                        r.GetValue(3).ToString(),
                        r.GetValue(4).ToString(),
                        r.GetValue(5).ToString()
                    );
                }
            }

            return user;
        }

        public List<User> GetUsersWithGoalGrade(
            int courseID,
            int goalGrade,
            string hash = null)
        {
            string activeHash = hash ?? this.GetCurrentHash(courseID);
            if (activeHash == null) return new List<User> { };

            List<User> users = new();

            using(SQLiteDataReader r = Query(DatabaseQueries.QUERY_USERS_WITH_GOAL_GRADE,
                    new SQLiteParameter("courseID", courseID),
                    new SQLiteParameter("hash", activeHash),
                    new SQLiteParameter("goalGrade", goalGrade)
                )) {
                // collect all users
                while (r.Read())
                {
                    User user = new(
                        r.GetInt32(0),
                        courseID,
                        r.GetInt32(1),
                        r.GetValue(2).ToString(),
                        r.GetValue(3).ToString(),
                        r.GetValue(4).ToString(),
                        r.GetValue(5).ToString()
                    );
                    users.Add(user);
                }
            }

            return users;
        }

        public int CreateGradePredictionModel(int courseID, float intercept)
        {
            NonQuery($"UPDATE `grade_prediction_model` SET `enabled`=False"); // TODO: Choose model in a UI.
            return IDNonQuery(
                    DatabaseQueries.REGISTER_GRADE_PREDICTION_MODEL,
                    new SQLiteParameter("courseID", courseID),
                    new SQLiteParameter("intercept", intercept)
                );
        }

        public int CreateGradePredictionModelParameter(int modelID, int parameterID, float weight)
        {
            return IDNonQuery(
                    DatabaseQueries.REGISTER_GRADE_PREDICTION_MODEL_PARAMETER,
                    new SQLiteParameter("modelID", modelID),
                    new SQLiteParameter("parameterID", parameterID),
                    new SQLiteParameter("weight", weight)
                );
        }

        public List<GradePredictionModel> GetGradePredictionModels(int courseID)
        {
            List<GradePredictionModel> models = new();
            GradePredictionModel model;

            using(SQLiteDataReader r = Query(DatabaseQueries.QUERY_GRADE_PREDICTION_MODELS_FOR_COURSE,
                    new SQLiteParameter("courseID", courseID)
                )) {
                while (r.Read())
                {
                    try {
                        model = new GradePredictionModel(r.GetInt32(0),
                                                    courseID,
                                                    r.GetBoolean(2),
                                                    r.GetFloat(1));
                        // model.getParameters();
                        models.Add(model);
                    } catch (Exception e) {
                        PrintQueryError("GetGrade{redictionModels", 2, r, e);
                    }
                }
            }

            models.ForEach((GradePredictionModel model) => model.GetParameters());

            return models;
        }

        public GradePredictionModel GetGradePredictionModel(int courseID)
        {

            GradePredictionModel model = null;

            using(SQLiteDataReader r = Query(DatabaseQueries.QUERY_GRADE_PREDICTION_MODEL_FOR_COURSE,
                new SQLiteParameter("courseID", courseID)
                )) {
                if (r.Read()) {
                    model = new GradePredictionModel(
                            r.GetInt32(0),
                            courseID,
                            true,
                            r.GetFloat(1));
                }
            }

            model?.GetParameters();
            return model;
        }


        public List<GradePredictionModelParameter> GetGradePredictionModelParameters(int modelID)
        {

            List<GradePredictionModelParameter> parameters = new();

            using(SQLiteDataReader r = Query(DatabaseQueries.QUERY_GRADE_PREDICTION_MODEL_PARAMETERS_FOR_MODEL,
                new SQLiteParameter("modelID", modelID)
            )) {
                while (r.Read())
                {
                    GradePredictionModelParameter parameter = new(
                            r.GetInt32(0),
                            r.GetInt32(1),
                            r.GetInt32(2),
                            r.GetFloat(3)
                        );
                    parameters.Add(parameter);
                }
            }

            return parameters;
        }

        public void CreatePredictedGrade(
            int courseID,
            string userID,
            double grade)
        {
            try {
                NonQuery(DatabaseQueries.REGISTER_PREDICTED_GRADE,
                    new SQLiteParameter("courseID", courseID),
                    new SQLiteParameter("userID", userID),
                    new SQLiteParameter("grade", grade)
                );
            } catch (Exception e) {
                _logger.LogError("Error storing predicted grade: {message}\n{trace}", e.Message, e.StackTrace);
            }
        }

        public void RegisterUserSettings(ConsentData data)
        {
             NonQuery(DatabaseQueries.REGISTER_USER_SETTINGS,
                new SQLiteParameter("CourseID", data.CourseID),
                new SQLiteParameter("UserID", data.UserID),
                new SQLiteParameter("UserName", data.UserName),
                new SQLiteParameter("Granted", data.Granted)
            );
        }

        public bool GetTileNotificationState(int tileID)
        {
            bool result = false;
            using(SQLiteDataReader r = Query(DatabaseQueries.QUERY_TILE_NOTIFICATIONS_STATE,
                    new SQLiteParameter("tileID", tileID)
                )) {
                if (r.Read())
                {
                    try{
                        result = r.GetBoolean(0);
                    }
                    catch (Exception e) {
                        PrintQueryError("GetUserGoalGrade", 0, r, e);
                    }
                }
                return result;
            }
        }

        public void UpdateNotificationEnable(int courseID, string userID, bool enable)
        {
            NonQuery(DatabaseQueries.UPDATE_NOTIFICATION_ENABLE,
                    new SQLiteParameter("enable", enable),
                    new SQLiteParameter("courseID", courseID),
                    new SQLiteParameter("userID", userID)
            );
        }

        public bool GetNotificationEnable(int courseID, string userID)
        {

            bool result = true;
            using(SQLiteDataReader r = Query(DatabaseQueries.QUERY_NOTIFICATIONS_ENABLE,
                    new SQLiteParameter("courseID", courseID),
                    new SQLiteParameter("userID", userID)
                )) {
                if (r.Read())
                {
                    try{
                        result = r.GetBoolean(0);
                    }
                    catch (Exception e) {
                        PrintQueryError("GetUserGoalGrade", 0, r, e);
                    }
                }
                return result;
            }
        }

        public void UpdateUserGoalGrade(int courseID, string userID, int grade)
        {
            NonQuery(DatabaseQueries.UPDATE_USER_GOAL_GRADE,
                new SQLiteParameter("grade", grade),
                new SQLiteParameter("courseID", courseID),
                new SQLiteParameter("userID", userID)
            );
        }

        public int GetUserGoalGrade(int courseID, string userID)
        {
            int result = -1;
            using(SQLiteDataReader r = Query(DatabaseQueries.QUERY_USER_GOAL_GRADE,
                    new SQLiteParameter("courseID", courseID),
                    new SQLiteParameter("userID", userID)
                )) {
                if (r.Read())
                {
                    try{
                        result = Convert.ToInt32(r.GetValue(0).ToString());
                    }
                    catch (Exception e) {
                        PrintQueryError("GetUserGoalGrade", 0, r, e);
                    }
                }
                return result;
            }
        }

        public GoalData[] GetGoalGrades(int courseID)
        {
            List<GoalData> goals = new();

            using(SQLiteDataReader r = Query(DatabaseQueries.QUERY_GOAL_GRADES,
                    new SQLiteParameter("courseID", courseID)
                )) {
                while (r.Read())
                {
                    try
                    {
                        int grade = r.GetValue(0).GetType() != typeof(DBNull) ? (r.GetInt32(0)) : 0;
                        goals.Add(new GoalData(courseID, grade, r.GetValue(1).ToString()));
                    } catch (Exception e)
                    {
                        PrintQueryError("GetGoalGrades", 0, r, e);
                    }
                }
            }
            return goals.ToArray();
        }


        public void CreateUserPeer(
            int courseID,
            int goalGrade,
            List<string> userIDs,
            int tileID,
            float avgGrade,
            float minGrade,
            float maxGrade,
            string syncHash)
        {
            string combinedIDs = string.Join( ",", userIDs);
            NonQuery(DatabaseQueries.REGISTER_USER_PEER,
                new SQLiteParameter("courseID", courseID),
                new SQLiteParameter("goalGrade", goalGrade),
                new SQLiteParameter("combinedIDs", combinedIDs),
                new SQLiteParameter("tileID", tileID),
                new SQLiteParameter("avgGrade", avgGrade),
                new SQLiteParameter("minGrade", minGrade),
                new SQLiteParameter("maxGrade", maxGrade),
                new SQLiteParameter("hash", syncHash)
            );
        }


        public List<String> GetPeersFromGroup(
            int courseID,
            int goalGrade,
            string hash = null)
        {
            string activeHash = hash ?? this.GetCurrentHash(courseID);
            if (activeHash == null) return new List<string> { };

            List<String> peers = new();

            using(SQLiteDataReader r = Query(DatabaseQueries.QUERY_GROUP_PEERS,
                    new SQLiteParameter("courseID", courseID),
                    new SQLiteParameter("goalGrade", goalGrade),
                    new SQLiteParameter("hash", activeHash)
                )) {
                while (r.Read())
                {
                    peers.Add(r.GetValue(0).ToString());
                }
            }
            return peers;
        }

        public int CreateUserSubmission(
            int courseID,
            int entryID,
            string userID,
            double grade,
            string submitted,
            string hash = null)
        {
            string activeHash = hash ?? this.GetCurrentHash(courseID);
            return activeHash == null
                ? -1
                : IDNonQuery(DatabaseQueries.REGISTER_USER_SUBMISSION,
                    new SQLiteParameter("entryID", entryID),
                    new SQLiteParameter("userID", userID),
                    new SQLiteParameter("grade", grade),
                    new SQLiteParameter("submitted", submitted),
                    new SQLiteParameter("hash", activeHash)
                );
        }

        public int CreateSubmissionMeta(
            int submissionID,
            string key,
            string value,
            int courseID,
            string hash=null)
        {
            string activeHash = hash ?? this.GetCurrentHash(courseID);
            return IDNonQuery(DatabaseQueries.REGISTER_SUBMISSION_META,
                new SQLiteParameter("submissionID", submissionID),
                new SQLiteParameter("key", key),
                new SQLiteParameter("value", value),
                new SQLiteParameter("hash", activeHash)
            );
        }

        public List<TileEntrySubmission> GetTileEntrySubmissions(
            int courseID,
            int entryID,
            string hash = null)
        {
            string activeHash = hash ?? this.GetCurrentHash(courseID);
            if (activeHash == null) return new List<TileEntrySubmission>() { };

            List<TileEntrySubmission> submissions = new();

            using(SQLiteDataReader r = Query(DatabaseQueries.QUERY_SUBMISSIONS_FOR_ENTRY,
                    new SQLiteParameter("entryID", entryID),
                    new SQLiteParameter("hash", activeHash)
                )) {
                while (r.Read())
                {
                    TileEntrySubmission submission = new(
                        r.GetInt32(0),
                        r.GetInt32(1),
                        r.GetValue(2).ToString(),
                        r.GetValue(3).ToString(),
                        r.GetValue(4).ToString(),
                        hash: activeHash
                    );
                    submissions.Add(submission);
                }
            }

            return submissions;
        }

        public List<TileEntrySubmission> GetCourseSubmissions(
            int courseID,
            string hash = null)
        {
            string activeHash = hash ?? this.GetCurrentHash(courseID);
            if (activeHash == null) return new List<TileEntrySubmission>() { };

            List<TileEntrySubmission> submissions = new();

            using(SQLiteDataReader r = Query(DatabaseQueries.QUERY_COURSE_SUBMISSIONS,
                    new SQLiteParameter("courseID", courseID),
                    new SQLiteParameter("hash", activeHash)
                )) {
                while (r.Read())
                {
                    try {
                        TileEntrySubmission submission = new(
                            r.GetInt32(0),
                            r.GetInt32(1),
                            r.GetValue(2).ToString(),
                            r.GetValue(3).ToString(),
                            r.GetValue(4).ToString(),
                            autoLoadMeta: false,
                            hash: activeHash
                        );
                        submissions.Add(submission);
                    }
                    catch (Exception e) {
                        PrintQueryError("GetCourseSubmissions", 4, r, e);
                    }
                }
            }

            return submissions;
        }

        public List<TileEntrySubmission> GetCourseSubmissionsForStudent(
            int courseID,
            string userID,
            string hash = null)
        {
            string activeHash = hash ?? this.GetCurrentHash(courseID);
            if (activeHash == null) return new List<TileEntrySubmission>() { };

            List<TileEntrySubmission> submissions = new();

            using(SQLiteDataReader r = Query(DatabaseQueries.QUERY_COURSE_SUBMISSIONS_FOR_STUDENT,
                    new SQLiteParameter("courseID", courseID),
                    new SQLiteParameter("userID", userID),
                    new SQLiteParameter("hash", activeHash)
                )) {
                while (r.Read())
                {
                    TileEntrySubmission submission = new(
                        r.GetInt32(0),
                        r.GetInt32(1),
                        r.GetValue(2).ToString(),
                        r.GetValue(3).ToString(),
                        r.GetValue(4).ToString(),
                        hash: activeHash
                    );
                    submissions.Add(submission);
                }
            }

            return submissions;
        }


        public List<TileEntrySubmission> GetTileEntrySubmissionsForUser(
            int courseID,
            int entryID,
            string userID,
            string hash = null)
        {
            string activeHash = hash ?? this.GetCurrentHash(courseID);
            if (activeHash == null) return new List<TileEntrySubmission>() { };

            List<TileEntrySubmission> submissions = new();

            using(SQLiteDataReader r = Query(DatabaseQueries.QUERY_USER_SUBMISSIONS_FOR_ENTRY_FOR_USER,
                    new SQLiteParameter("entryID", entryID),
                    new SQLiteParameter("userID", userID),
                    new SQLiteParameter("hash", activeHash)
                )) {
                while (r.Read())
                {
                    TileEntrySubmission submission = new(
                        r.GetInt32(0),
                        r.GetInt32(1),
                        r.GetValue(2).ToString(),
                        r.GetValue(3).ToString(),
                        r.GetValue(4).ToString(),
                        hash: activeHash
                    );
                    submissions.Add(submission);
                }
            }
            return submissions;
        }

        public List<TileEntrySubmission> GetTileSubmissions( int courseID, int tileID, string hash = null) {
            string activeHash = hash ?? this.GetCurrentHash(courseID);
            if (activeHash == null) return new List<TileEntrySubmission>() { };

            List<TileEntrySubmission> submissions = new();

            using(SQLiteDataReader r = Query(DatabaseQueries.QUERY_USER_SUBMISSIONS_FOR_TILE,
                    new SQLiteParameter("tileID", tileID),
                    new SQLiteParameter("hash", activeHash)
                )) {
                while (r.Read())
                {
                    TileEntrySubmission submission = new(
                        r.GetInt32(0),
                        r.GetInt32(1),
                        r.GetValue(2).ToString(),
                        r.GetValue(3).ToString(),
                        r.GetValue(4).ToString(),
                        hash: activeHash
                    );
                    submissions.Add(submission);
                }
            }

            return submissions;
        }


        public List<TileEntrySubmission> GetTileSubmissionsForUser(
            int courseID,
            int tileID,
            string userID,
            string hash = null)
        {
            string activeHash = hash ?? this.GetCurrentHash(courseID);
            if (activeHash == null) return new List<TileEntrySubmission>() { };

            List<TileEntrySubmission> submissions = new();

            using(SQLiteDataReader r = Query(DatabaseQueries.QUERY_USER_SUBMISSIONS_FOR_TILE_FOR_USER,
                    new SQLiteParameter("tileID", tileID),
                    new SQLiteParameter("userID", userID),
                    new SQLiteParameter("hash", activeHash)
                )) {
                while (r.Read())
                {
                    TileEntrySubmission submission = new(
                        r.GetInt32(0),
                        r.GetInt32(1),
                        r.GetValue(2).ToString(),
                        r.GetValue(3).ToString(),
                        r.GetValue(4).ToString(),
                        hash: activeHash
                    );
                    submissions.Add(submission);
                }
            }

            return submissions;
        }

        public PeerGroup GetPeerGroup(int courseID)
        {
            PeerGroup group = null;

            using(SQLiteDataReader r = Query(DatabaseQueries.QUERY_PEER_GROUP_FOR_COURSE,
                    new SQLiteParameter("courseID", courseID)
                )) {
                if (r.Read())
                {
                    group = new PeerGroup(
                        r.GetInt32(0),
                        r.GetBoolean(1)
                    );
                }
            }

            return group;
        }

        public PublicInformedConsent GetPublicInformedConsent(
            int courseID)
        {
            PublicInformedConsent consent = null;

            using(SQLiteDataReader r = Query(DatabaseQueries.QUERY_CONSENT_FOR_COURSE,
                    new SQLiteParameter("courseID", courseID)
                )) {
                if (r.Read())
                {
                    consent = new PublicInformedConsent(
                        r.GetValue(0).ToString(),
                        r.GetBoolean(1),
                        r.GetValue(2).ToString(),
                        r.GetBoolean(3)
                    );
                }
            }

            return consent;
        }

        public void UpdateInformedConsent(
            int courseID,
            bool requireConsent,
            string text)
        {
            NonQuery(DatabaseQueries.UPDATE_CONSENT_FOR_COURSE,
                new SQLiteParameter("courseID", courseID),
                new SQLiteParameter("requireConsent", requireConsent),
                new SQLiteParameter("text", text)
            );
        }

        public void UpdateNotificationDates(
            int courseID,
            string notificationDates)
        {
            NonQuery(DatabaseQueries.UPDATE_NOTIFICATION_DATES_FOR_COURSE,
                new SQLiteParameter("courseID", courseID),
                new SQLiteParameter("notificationDates", notificationDates)
            );
        }

        public void RecycleExternalData(int courseID, string hash)
        {
            NonQuery(DatabaseQueries.RECYCLE_EXTERNAL_DATA,
                new SQLiteParameter("courseID", courseID),
                new SQLiteParameter("hash", hash)
            );
        }

        public void UpdateCoursePeerGroups(
            int courseID,
            int groupSize,
            bool personalizedPeers)
        {
            NonQuery(DatabaseQueries.UPDATE_PEER_GROUP_FOR_COURSE,
                new SQLiteParameter("courseID", courseID),
                new SQLiteParameter("groupSize", groupSize),
                new SQLiteParameter("personalizedPeers", personalizedPeers)
            );
        }

    public Dictionary<int,List<float>> GetUserGrades(
            int courseID,
            string userID,
            string hash = null)
        {
            string activeHash = hash ?? this.GetCurrentHash(courseID);
            if (activeHash == null)
                return new Dictionary<int, List<float>>();

            Dictionary<int,List<float>> grades = new();

            using(SQLiteDataReader r = Query(DatabaseQueries.QUERY_USER_RESULTS2,
                    new SQLiteParameter("courseID", courseID),
                    new SQLiteParameter("userID", userID),
                    new SQLiteParameter("hash", activeHash)
                )) {
                while (r.Read()) {
                    try {
                        // We save all the retrieved grades in a dictionary with
                        // the tile.id as key and a list of grades as value
                        if (!grades.TryGetValue(r.GetInt32(0), out List<float> value))
                        {
                            grades[r.GetInt32(0)] = new List<float>();
                        }
                        grades[r.GetInt32(0)].Add(r.GetFloat(2));
                    } catch (Exception e) {
                        PrintQueryError("GetUserPeerComparison2", 3, r, e);
                    }
                }
            }

            using(SQLiteDataReader r2 = Query(DatabaseQueries.QUERY_USER_DISCUSSION_COUNTER,
                    new SQLiteParameter("courseID", courseID),
                    new SQLiteParameter("userID", userID),
                    new SQLiteParameter("hash", activeHash)
                )) {
                while (r2.Read()) {
                    try {
                        // We save the sum of discussion entriess and replies in a dictionary with
                        // the discussion.id as key and the total of their entries/replies as value
                        if (!r2.IsDBNull(0))
                        {
                            int discID = r2.GetInt32(0);
                            grades[discID] = new List<float> { r2.GetInt32(1) };
                        }

                    } catch (Exception e) {
                        PrintQueryError("GetUserGrades", 3, r2, e);
                    }
                }
            }

            return grades;
        }


        public PeerComparisonData[] GetUserPeerComparison(
            int courseID,
            string loginID,
            string hash = null)
        {
            string activeHash = hash ?? this.GetCurrentHash(courseID);
            if (activeHash == null)
                return new PeerComparisonData[] {
                    PeerComparisonData.FromGrades(0, Array.Empty<float>())
                };

            List<PeerComparisonData> submissions = new();

            // First we need to find the user's goal grade to find their peer-group
            int goalGrade = GetUserGoalGrade(courseID,loginID);

            using(SQLiteDataReader r = Query(DatabaseQueries.QUERY_PEER_GROUP_RESULTS,
                    new SQLiteParameter("courseID", courseID),
                    new SQLiteParameter("goalGrade", goalGrade),
                    new SQLiteParameter("hash", activeHash)
                )) {
                while (r.Read()) {
                    try {
                        PeerComparisonData submission = new(
                            r.GetInt32(0),
                            r.GetFloat(1),
                            r.GetFloat(2),
                            r.GetFloat(3)
                        );
                        submissions.Add(submission);

                    } catch (Exception e) {
                        PrintQueryError("GetUserPeerComparison2", 3, r, e);
                    }
                }
            }
            return submissions.ToArray();
        }

        public List<PredictedGrade> GetPredictedGrades(int courseID, string userID)
        {
            List<PredictedGrade> predictions = new();

            using(SQLiteDataReader r = Query(DatabaseQueries.QUERY_PREDICTED_GRADES_FOR_USER,
                    new SQLiteParameter("courseID", courseID),
                    new SQLiteParameter("userID", userID)
                )) {
                while (r.Read())
                {
                    PredictedGrade prediction = new(
                        r.GetValue(0).ToString(),
                        r.GetValue(1).ToString(),
                        r.GetFloat(2)
                    );
                    predictions.Add(prediction);
                }
            }

            return predictions;
        }

        public PeerComparisonData[] GetUserResults(
            int courseID,
            string userID,
            string hash = null)
        {
            string activeHash = hash ?? this.GetCurrentHash(courseID);
            if (activeHash == null)
                return new PeerComparisonData[] {
                    PeerComparisonData.FromGrades(0, Array.Empty<float>())
                };

            List<PeerComparisonData> submissions = new();

            using(SQLiteDataReader r1 = Query(DatabaseQueries.QUERY_USER_RESULTS,
                    new SQLiteParameter("courseID", courseID),
                    new SQLiteParameter("userID", userID),
                    new SQLiteParameter("hash", activeHash)
                )) {
                while (r1.Read()) {
                    PeerComparisonData submission = new(
                        r1.GetInt32(0),
                        r1.GetFloat(1),
                        r1.GetFloat(2),
                        r1.GetFloat(3)
                    );
                    submissions.Add(submission);
                }
            }

            return submissions.ToArray();
        }


        public List<TileEntrySubmission> GetTileSubmissionsForUser(
            int courseID,
            string userID,
            string hash = null)
        {
            string activeHash = hash ?? this.GetCurrentHash(courseID);
            if (activeHash == null) return new List<TileEntrySubmission>() { };

            List<TileEntrySubmission> submissions = new();

            using(SQLiteDataReader r1 = Query(DatabaseQueries.QUERY_USER_SUBMISSIONS_FOR_USER,
                    new SQLiteParameter("userID", userID),
                    new SQLiteParameter("hash", activeHash)
                )) {
                while (r1.Read())
                {
                    TileEntrySubmission submission = new(
                        r1.GetInt32(0),
                        r1.GetInt32(1),
                        r1.GetValue(2).ToString(),
                        r1.GetValue(3).ToString(),
                        r1.GetValue(4).ToString(),
                        hash: activeHash
                    );
                    submissions.Add(submission);
                }
            }

            return submissions;
        }



        public Dictionary <int,List<List<object>>> GetHistoricComparison(
            int courseID,
            string userID,
            string hash = null)
        {
            string activeHash = hash ?? this.GetCurrentHash(courseID);
            if (activeHash == null) return new Dictionary<int, List<List<object>>>();

            Dictionary<int, List<List<object>>> comparisson_history = new();

            using(SQLiteDataReader r1 = Query(DatabaseQueries.QUERY_GRADE_COMPARISSON_HISTORY,
                    new SQLiteParameter("courseID", courseID),
                    new SQLiteParameter("grade", GetUserGoalGrade(courseID,userID)),
                    new SQLiteParameter("userID", userID)
                )) {
                try
                {
                    // Initialize last elements
                    float last_user_avg = -1;  //user
                    float last_peer_avg = -1;  //avg
                    float last_peer_max = -1;  //max
                    float last_peer_min = -1;  //min

                    while (r1.Read())
                    {
                        // Initialize varaibles with the values to be put inside the lists
                        int tile_id = r1.GetInt32(0);  //tile
                        float user_avg = r1.GetFloat(1);  //user
                        float peer_avg = r1.GetFloat(2);  //avg
                        float peer_max = r1.GetFloat(3);  //max
                        float peer_min = r1.GetFloat(4);  //min
                        string label = r1.GetString(5); //sync_hash

                        // If this entry is different than the last, we add it
                        if (last_user_avg != user_avg || last_peer_avg != peer_avg
                            || last_peer_max != peer_max || last_peer_min != peer_min) {

                            // If we have gone in a new tile, we create new pair
                            if (!comparisson_history.ContainsKey(tile_id)) {
                                // Use tile id as key and create new list to add the values
                                comparisson_history[tile_id] = new List<List<object>>
                                {
                                    new List<object> { label },
                                    new List<object> { user_avg },
                                    new List<object> { peer_avg },
                                    new List<object> { peer_max },
                                    new List<object> { peer_min }
                                };
                            }
                            else {
                                comparisson_history[tile_id][0].Add(label);
                                comparisson_history[tile_id][1].Add(user_avg);
                                comparisson_history[tile_id][2].Add(peer_avg);
                                comparisson_history[tile_id][3].Add(peer_max);
                                comparisson_history[tile_id][4].Add(peer_min);
                            }

                            // Update last values
                            last_user_avg = user_avg;
                            last_peer_avg = peer_avg;
                            last_peer_max = peer_max;
                            last_peer_min = peer_min;
                        }
                    }
                }
                catch (Exception e) {
                    PrintQueryError("GetHistoricComparison", 3, r1, e);
                }
            }
            return comparisson_history;
        }

        public List<LearningGoal> GetGoals(int courseID)
        {
            List<LearningGoal> goals = new();

            using(SQLiteDataReader r = Query(DatabaseQueries.QUERY_LEARNING_GOALS,
                    new SQLiteParameter("courseID", courseID)
                )) {
                while (r.Read())
                {
                    try {
                        goals.Add(new LearningGoal(
                            r.GetInt32(0),
                            r.GetInt32(1),
                            r.GetValue(2).ToString()
                        ));
                    } catch (Exception e) {
                        PrintQueryError("GetGoals", 2, r, e);
                    }
                }
            }

            return goals;
        }

        public List<LearningGoal> GetGoals(int courseID, int tileID)
        {
            List<LearningGoal> goals = new();
            using(SQLiteDataReader r = Query(DatabaseQueries.QUERY_TILE_LEARNING_GOALS,
                    new SQLiteParameter("courseID", courseID),
                    new SQLiteParameter("tileID", tileID)
                )){
                while (r.Read()){
                    try {
                        goals.Add(new LearningGoal(r.GetInt32(0), tileID, r.GetValue(1).ToString()));
                    } catch (Exception e) {
                        PrintQueryError("GetGoals", 1, r, e);
                    }
                }
            }
            return goals;
        }

        public LearningGoal GetGoal(int courseID, int id)
        {
            LearningGoal goal = null;
            using(SQLiteDataReader r = Query(DatabaseQueries.QUERY_LEARNING_GOAL,
                    new SQLiteParameter("courseID", courseID),
                    new SQLiteParameter("id", id)
                )){
                if (r.Read()){
                    try {
                        goal = new LearningGoal(id, r.GetInt32(0), r.GetValue(1).ToString());
                    } catch (Exception e) {
                        PrintQueryError("GetGoals", 1, r, e);
                    }
                }
            }
            return goal;
        }

        public LearningGoal CreateGoal(int courseID, int tileID, string title)
        {
            return new LearningGoal(
                IDNonQuery(DatabaseQueries.REGISTER_LEARNING_GOAL,
                    new SQLiteParameter("courseID", courseID),
                    new SQLiteParameter("tileID", tileID),
                    new SQLiteParameter("title", title)
                ),
                tileID,
                title
            );

        }

        public LearningGoal UpdateGoal(int courseID, LearningGoal goal)
        {
            NonQuery(DatabaseQueries.UPDATE_LEARNING_GOAL,
                    new SQLiteParameter("courseID", courseID),
                    new SQLiteParameter("id", goal.ID),
                    new SQLiteParameter("tileID", goal.TileID),
                    new SQLiteParameter("title", goal.Title)
                );

            return GetGoal(courseID, goal.ID);
        }

        public void DeleteGoal(int courseID, LearningGoal goal) {
            goal.FetchRequirements();
            goal.DeleteGoalRequirements();

            NonQuery(DatabaseQueries.DELETE_LEARNING_GOAL,
                new SQLiteParameter("courseID", courseID),
                new SQLiteParameter("id", goal.ID)
            );
        }

        public void DeleteGoal(int courseID, int id)
        {
            LearningGoal goal = GetGoal(courseID, id);
            if (goal == null) return;

            DeleteGoal(courseID, goal);

        }

        public void DeleteGoals(int courseID, int tileID)
        {
            List<LearningGoal> goals = GetGoals(courseID, tileID);
            foreach (LearningGoal goal in goals) {
                DeleteGoal(courseID, goal);
            }
        }

        public void CreateGoalRequirement(
            int goalID,
            int tileID,
            int entryID,
            string metaKey,
            float value,
            string expresson)
        {
            NonQuery(DatabaseQueries.REGISTER_GOAL_REQUIREMENT,
                new SQLiteParameter("goalID", goalID),
                new SQLiteParameter("tileID", tileID),
                new SQLiteParameter("entryID", entryID),
                new SQLiteParameter("metaKey", metaKey),
                new SQLiteParameter("value", value),
                new SQLiteParameter("expresson", expresson)
            );
        }

        public void UpdateGoalRequirement(GoalRequirement requirement)
        {
            NonQuery(DatabaseQueries.UPDATE_LEARNING_GOAL_REQUIREMENT,
                new SQLiteParameter("id", requirement.ID),
                new SQLiteParameter("goalID", requirement.GoalID),
                new SQLiteParameter("tileID", requirement.TileID),
                new SQLiteParameter("entryID", requirement.EntryID),
                new SQLiteParameter("metaKey", requirement.MetaKey),
                new SQLiteParameter("value", requirement.Value),
                new SQLiteParameter("expression", requirement.Expression)
            );
        }
        public void DeleteGoalRequirements(int goalID)
        {
            NonQuery(DatabaseQueries.DELETE_GOAL_REQUIREMENTS,
                new SQLiteParameter("goalID", goalID)
            );
        }

        public void DeleteGoalRequirement(int goalID, int id)
        {
            NonQuery(DatabaseQueries.DELETE_GOAL_REQUIREMENT,
                new SQLiteParameter("goalID", goalID),
                new SQLiteParameter("id", id)
            );
        }
        public List<GoalRequirement> GetGoalRequirements(int goalID)
        {
            List<GoalRequirement> requirements = new();

            using(SQLiteDataReader r = Query(DatabaseQueries.QUERY_GOAL_REQUIREMENTS,
                    new SQLiteParameter("goalID", goalID)
                )) {
                while (r.Read())
                {
                    requirements.Add(new GoalRequirement(
                        r.GetInt32(0),
                        0,
                        r.GetInt32(1),
                        r.GetInt32(2),
                        r.GetInt32(3),
                        r.GetValue(4).ToString(),
                        r.GetFloat(5),
                        r.GetValue(6).ToString()
                    ));
                }
            }

            return requirements;
        }

        public void RegisterNotification(
            int courseID,
            string userID,
            int tileID,
            int status,
            string hash = null)
        {
            string activeHash = hash ?? this.GetCurrentHash(courseID);

            NonQuery(DatabaseQueries.REGISTER_USER_NOTIFICATIONS,
                new SQLiteParameter("courseID", courseID),
                new SQLiteParameter("userID", userID),
                new SQLiteParameter("tileID", tileID),
                new SQLiteParameter("status", status),
                new SQLiteParameter("hash", activeHash)
            );
        }

        public List<Notification> GetAllNotifications(
            int courseID)
        {
            string activeHash = String.Join("', '", this.GetRecentHashes(courseID, 2));

            // TODO: not sure how to write this as sqliteparameters
            string query = String.Format(
                DatabaseQueries.QUERY_ALL_NOTIFICATIONS,
                courseID,
                activeHash);

            List<Notification> notifications = new();

            using (SQLiteDataReader r = Query(query)) {
                while (r.Read())
                {
                    try {
                        notifications.Add(new Notification(
                            r.GetValue(0).ToString(),
                            r.GetInt32(1),
                            r.GetInt32(2),
                            r.GetBoolean(3)
                        ));
                    } catch (Exception e) {
                        PrintQueryError("GetAllNotifications", 3, r, e);
                    }
                }
            }

            return notifications;
        }

        public List<Notification> GetAllUserNotifications(
            int courseID,
            string userID,
            string hash = null)
        {
            string activeHash = hash ?? this.GetCurrentHash(courseID);

            List<Notification> notifications = new();

            using (SQLiteDataReader r = Query(DatabaseQueries.QUERY_ALL_USER_NOTIFICATIONS,
                    new SQLiteParameter("courseID", courseID),
                    new SQLiteParameter("userID", userID),
                    new SQLiteParameter("hash", activeHash)
                )) {
                while (r.Read())
                {
                    notifications.Add(new Notification(
                        userID,
                        r.GetInt32(0),
                        r.GetInt32(1),
                        r.GetBoolean(2)
                    ));
                }
            }

            return notifications;
        }

        public List<Notification> GetPendingNotifications(
            int courseID,
            string userID,
            string hash = null)
        {
            string activeHash = hash ?? this.GetCurrentHash(courseID);

            List<Notification> notifications = new();

            using (SQLiteDataReader r = Query(DatabaseQueries.QUERY_PENDING_USER_NOTIFICATIONS,
                    new SQLiteParameter("courseID", courseID),
                    new SQLiteParameter("userID", userID),
                    new SQLiteParameter("hash", activeHash)
                )){
                while (r.Read())
                {
                    notifications.Add(new Notification(
                        userID,
                        r.GetInt32(0),
                        r.GetInt32(1),
                        false
                    ));
                }
            }

            return notifications;
        }

        public void MarkNotificationsSent(int courseID, string userID, string hash = null)
        {
            string activeHash = hash ?? this.GetCurrentHash(courseID);

            NonQuery(DatabaseQueries.QUERY_MARK_NOTIFICATIONS_SENT,
                new SQLiteParameter("courseID", courseID),
                new SQLiteParameter("userID", userID),
                new SQLiteParameter("hash", activeHash)
            );
        }

        public List<TileEntry> GetEntries(int courseID)
        {
            List<TileEntry> entries = new();

            using(SQLiteDataReader r = Query(DatabaseQueries.QUERY_ENTRIES,
                    new SQLiteParameter("courseID", courseID)
                )) {
                while (r.Read())
                {
                    try {
                        entries.Add(new TileEntry(
                        r.GetInt32(0),
                        0,
                        r.GetInt32(1),
                        r.GetValue(2).ToString(),
                        r.GetValue(3).ToString()
                    ));
                    } catch (Exception e) {
                        PrintQueryError("GetEntries", 3, r, e);
                    }
                }
            }

            return entries;
        }

        public int CreateTileEntry(TileEntry entry)
        {
            return IDNonQuery(DatabaseQueries.REGISTER_TILE_ENTRY,
                new SQLiteParameter("tileID", entry.TileID),
                new SQLiteParameter("title", entry.Title),
                new SQLiteParameter("type", entry.Type),
                new SQLiteParameter("wildcard", entry.Wildcard)
            );
        }

        public void DeleteTileEntry(int entryID)
        {
            NonQuery(DatabaseQueries.DELETE_TILE_ENTRY,
                new SQLiteParameter("entryID", entryID)
            );
        }

        public void RegisterAcceptedStudent(
            int courseID,
            string studentID,
            bool accepted)
        {
            NonQuery(DatabaseQueries.REGISTER_ACCEPTED_STUDENT,
                new SQLiteParameter("courseID", courseID),
                new SQLiteParameter("studentID", studentID),
                new SQLiteParameter("accepted", accepted)
            );
        }

        public void ResetAcceptList(int courseID)
        {
            NonQuery(DatabaseQueries.RESET_ACCEPT_LIST,
                new SQLiteParameter("courseID", courseID)
            );
        }

        public void SetAcceptListRequired(int courseID, bool enabled)
        {
            NonQuery(DatabaseQueries.REQUIRE_ACCEPT_LIST,
                new SQLiteParameter("courseID", courseID),
                new SQLiteParameter("enabled", enabled)
            );
        }

        public List<AcceptList> GetAcceptList(int courseID)
        {
            List<AcceptList> keys = new();

            using (SQLiteDataReader r = Query(DatabaseQueries.QUERY_ACCEPT_LIST,
                    new SQLiteParameter("courseID", courseID)
                )) {
                while (r.Read())
                {
                    keys.Add(
                        new AcceptList(
                            r.GetValue(0).ToString(),
                            r.GetBoolean(1)
                        ));
                }
            }

            return keys;
        }

        public List<string> GetEntryMetaKeys(int entryID)
        {
            List<string> keys = new();

            using(SQLiteDataReader r = Query(DatabaseQueries.QUERY_TILE_ENTRY_META_KEYS,
                    new SQLiteParameter("entryID", entryID)
                )) {
                while (r.Read())
                {
                    keys.Add(r.GetValue(0).ToString());
                }
            }
            return keys;
        }

        public Dictionary<string, string> GetEntryMeta(int entryID, string synchash)
        {
            Dictionary<string, string> meta = new();

            using(SQLiteDataReader r = Query(DatabaseQueries.QUERY_TILE_ENTRY_SUBMISSION_META,
                    new SQLiteParameter("entryID", entryID),
                    new SQLiteParameter("hash", synchash)
                )) {
                while (r.Read())
                {
                    try {
                        meta.Add(r.GetValue(0).ToString(), r.GetValue(1).ToString());
                    } catch (Exception e) {
                        PrintQueryError("GetEntryMeta", 1, r, e);
                    }
                }
            }
            return meta;
        }

        public void UpdateTile(int courseID, Tile tile)
        {
            // TODO: check courseID

            NonQuery(DatabaseQueries.UPDATE_TILE,
                new SQLiteParameter("id", tile.ID),
                new SQLiteParameter("groupID", tile.GroupID),
                new SQLiteParameter("title", tile.Title),
                new SQLiteParameter("position", tile.Position),
                new SQLiteParameter("contentType", tile.ContentType),
                new SQLiteParameter("tileType", tile.TileType),
                new SQLiteParameter("visible", tile.Visible),
                new SQLiteParameter("notifications", tile.Notifications),
                new SQLiteParameter("graphView", tile.GraphView),
                new SQLiteParameter("wildcard", tile.Wildcard)
            );
        }

        public List<Tile> GetTiles(int courseID, bool autoLoadEntries = false)
        {
            List<Tile> tiles = new();

            using(SQLiteDataReader r = Query(DatabaseQueries.QUERY_TILES,
                    new SQLiteParameter("courseID", courseID)
                )) {
                while (r.Read())
                {
                    try {
                        Tile row = new(
                            r.GetInt32(0),
                            r.GetInt32(1),
                            r.GetValue(2).ToString(),
                            r.GetInt32(3),
                            r.GetValue(4).ToString(),
                            r.GetValue(5).ToString(),
                            r.GetBoolean(6),
                            r.GetBoolean(7),
                            r.GetBoolean(8),
                            r.GetBoolean(9),
                            autoLoadEntries
                        );
                        tiles.Add(row);
                    }
                    catch (Exception e) {
                        PrintQueryError("GetTiles", 9, r, e);
                    }
                }
            }

            return tiles;
        }

        public void CreateLayoutTileGroup(
            int courseID,
            string title,
            int position)
        {
            List<LayoutColumn> cols = this.GetLayoutColumns(courseID);

            if (cols.Count < 1) return;

            NonQuery(DatabaseQueries.REGISTER_TILE_GROUP,
                new SQLiteParameter("courseID", courseID),
                new SQLiteParameter("columnID", cols[0].ID),
                new SQLiteParameter("title", title),
                new SQLiteParameter("position", position)
            );
        }

        public LayoutTileGroup UpdateTileGroup(
            int courseID,
            int tileGroupID,
            int columnID,
            string title,
            int position)
        {
            NonQuery(DatabaseQueries.UPDATE_TILE_GROUP,
                new SQLiteParameter("id", tileGroupID),
                new SQLiteParameter("columnID", columnID),
                new SQLiteParameter("title", title),
                new SQLiteParameter("position", position)
            );

            return GetLayoutTileGroup(courseID, tileGroupID);
        }

        public void DeleteLayoutTileGroup(int id)
        {
            NonQuery(DatabaseQueries.DELETE_TILE_GROUP,
                new SQLiteParameter("id", id)
            );
        }

        public LayoutTileGroup GetLayoutTileGroup(int courseID, int groupID)
        {
            using (SQLiteDataReader r = Query(DatabaseQueries.QUERY_TILE_GROUP,
                    new SQLiteParameter("courseID", courseID),
                    new SQLiteParameter("id", groupID)
                )) {
                if (r.Read())
                    return new LayoutTileGroup(
                        r.GetInt32(0),
                        courseID,
                        r.GetValue(1).ToString(),
                        r.GetInt32(2),
                        r.GetInt32(3)
                    );
            }
            return null;
        }

        public List<LayoutTileGroup> GetLayoutTileGroups(int courseID)
        {

            List<LayoutTileGroup> tileGroups = new();

            using(SQLiteDataReader r = Query(DatabaseQueries.QUERY_TILE_GROUPS,
                    new SQLiteParameter("courseID", courseID)
                )) {
                while (r.Read())
                {
                    try {
                        LayoutTileGroup row = new(
                        r.GetInt32(0),
                        courseID,
                        r.GetValue(1).ToString(),
                        r.GetInt32(2),
                        r.GetInt32(3)
                    );
                    tileGroups.Add(row);
                    } catch (Exception e) {
                        PrintQueryError("GetLayoutTileGroups", 3, r, e);
                    }
                }
            }

            return tileGroups;
        }

        public List<AppAssignment> GetAssignments(int courseID, string hash = null)
        {
            string activeHash = hash ?? this.GetCurrentHash(courseID);
            if (activeHash == null) return new List<AppAssignment>() { };

            List<AppAssignment> assignments = new();

            using(SQLiteDataReader r = Query(DatabaseQueries.QUERY_COURSE_ASSIGNMENTS,
                    new SQLiteParameter("courseID", courseID),
                    new SQLiteParameter("hash", activeHash)
                )) {
                while (r.Read())
                {
                    try {
                        AppAssignment row = new(
                            r.GetInt32(0),
                            r.GetValue(1).ToString(),
                            r.GetInt32(2),
                            r.GetValue(3).ToString(),
                            r.GetBoolean(4),
                            r.GetBoolean(5),
                            r.GetValue(6).ToString(),
                            r.GetFloat(7),
                            r.GetInt32(8),
                            r.GetValue(9).ToString()
                        );
                        assignments.Add(row);
                    } catch (Exception e)
                    {
                        PrintQueryError("GetAssignments", 9, r, e);
                    }
                }
            }

            return assignments;
        }

        public List<AppDiscussion> GetDiscussions(int courseID, string hash = null)
        {
            string activeHash = hash ?? this.GetCurrentHash(courseID);
            if (activeHash == null) return new List<AppDiscussion>() { };

            List<AppDiscussion> discussions = new();

            using(SQLiteDataReader r = Query(DatabaseQueries.QUERY_COURSE_DISCUSSIONS,
                    new SQLiteParameter("courseID", courseID),
                    new SQLiteParameter("hash", activeHash)
                )) {
                while (r.Read())
                {
                    AppDiscussion row = new(
                        r.GetInt32(0),
                        Discussion_type.topic,
                        r.GetInt32(1),
                        r.GetInt32(2),
                        r.GetInt32(3),
                        r.GetValue(4).ToString(),
                        r.GetValue(5).ToString(),
                        r.GetValue(6).ToString(),
                        r.GetValue(7).ToString()
                    );
                    discussions.Add(row);
                }
            }

            return discussions;
        }

        public List<AppDiscussion> GetDiscussionsForTile(
            int courseID,
            int tileID,
            string hash = null)
        {
            string activeHash = hash ?? this.GetCurrentHash(courseID);
            if (activeHash == null) return new List<AppDiscussion>() { };

            List<AppDiscussion> discussions = new();

            using(SQLiteDataReader r = Query(DatabaseQueries.QUERY_TILE_DISCUSSIONS,
                    new SQLiteParameter("id", tileID),
                    new SQLiteParameter("hash", activeHash)
                )) {
                while (r.Read())
                {
                    AppDiscussion row = new(
                        r.GetInt32(0),
                        Discussion_type.topic,
                        r.GetInt32(1),
                        tileID,
                        r.GetInt32(2),
                        r.GetValue(3).ToString(),
                        r.GetValue(4).ToString(),
                        r.GetValue(5).ToString(),
                        r.GetValue(6).ToString()
                    );
                    discussions.Add(row);
                }
            }

            return discussions;
        }

        public List<AppDiscussion> GetDiscussionEntries(int course_id, int discussion_id, string hash = null) {
            string activeHash = hash ?? this.GetCurrentHash(course_id);
            if (activeHash == null) return new List<AppDiscussion>() { };

            List<AppDiscussion> entries = new();
            using(SQLiteDataReader r = Query(DatabaseQueries.QUERY_DISCUSSION_ENTRIES,
                    new SQLiteParameter("courseID", course_id),
                    new SQLiteParameter("discussionID", discussion_id),
                    new SQLiteParameter("hash", activeHash)
                )) {
                while (r.Read()) {
                    AppDiscussion row = new(
                        r.GetInt32(0),
                        Discussion_type.entry,
                        discussion_id,
                        discussion_id,
                        course_id,
                        r.GetValue(4).ToString(),
                        r.GetValue(1).ToString(),
                        r.GetValue(2).ToString(),
                        r.GetValue(3).ToString()
                    );
                    entries.Add(row);
                }
            }
            return entries;
        }

        public List<AppDiscussion> GetDiscussionEntries(int course_id, int discussion_id, string user_id, string hash = null) {
            string activeHash = hash ?? this.GetCurrentHash(course_id);
            if (activeHash == null) return new List<AppDiscussion>() { };

            List<AppDiscussion> entries = new();
            using(SQLiteDataReader r = Query(DatabaseQueries.QUERY_DISCUSSION_ENTRIES_FOR_USER,
                    new SQLiteParameter("courseID", course_id),
                    new SQLiteParameter("discussionID", discussion_id),
                    new SQLiteParameter("hash", activeHash),
                    new SQLiteParameter("userID", user_id)
                )) {
                while (r.Read()) {
                    AppDiscussion row = new(
                        r.GetInt32(0),
                        Discussion_type.entry,
                        discussion_id,
                        discussion_id,
                        course_id,
                        r.GetValue(4).ToString(),
                        r.GetValue(1).ToString(),
                        r.GetValue(2).ToString(),
                        r.GetValue(3).ToString()
                    );
                    entries.Add(row);
                }
            }
            return entries;
        }


        public List<AppDiscussion> GetDiscussionReplies(int course_id, int discussion_id, string hash = null) {
            string activeHash = hash ?? this.GetCurrentHash(course_id);
            if (activeHash == null) return new List<AppDiscussion>() { };

            List<AppDiscussion> entries = new();
            using(SQLiteDataReader r = Query(DatabaseQueries.QUERY_DISCUSSION_REPLIES,
                    new SQLiteParameter("courseID", course_id),
                    new SQLiteParameter("discussionID", discussion_id),
                    new SQLiteParameter("hash", activeHash)
                )) {
                while (r.Read()) {
                    AppDiscussion row = new(
                        r.GetInt32(0),
                        Discussion_type.reply,
                        discussion_id,
                        r.GetInt32(1),
                        course_id,
                        r.GetValue(5).ToString(),
                        r.GetValue(2).ToString(),
                        r.GetValue(3).ToString(),
                        r.GetValue(4).ToString()
                    );
                    entries.Add(row);
                }
            }
            return entries;
        }

        public List<AppDiscussion> GetDiscussionReplies(int course_id, int discussion_id, string user_id, string hash = null) {
            string activeHash = hash ?? this.GetCurrentHash(course_id);
            if (activeHash == null) return new List<AppDiscussion>() { };

            List<AppDiscussion> entries = new();
            using(SQLiteDataReader r = Query(DatabaseQueries.QUERY_DISCUSSION_REPLIES_FOR_USER,
                    new SQLiteParameter("courseID", course_id),
                    new SQLiteParameter("discussionID", discussion_id),
                    new SQLiteParameter("hash", activeHash),
                    new SQLiteParameter("userID", user_id)
                )) {
                while (r.Read()) {
                    AppDiscussion row = new(
                        r.GetInt32(0),
                        Discussion_type.reply,
                        discussion_id,
                        r.GetInt32(1),
                        course_id,
                        r.GetValue(5).ToString(),
                        r.GetValue(2).ToString(),
                        r.GetValue(3).ToString(),
                        r.GetValue(4).ToString()
                    );
                    entries.Add(row);
                }
            }
            return entries;
        }

        public LayoutColumn CreateLayoutColumn(int courseID, string containerWidth, int position)
        {
            int id = IDNonQuery(DatabaseQueries.REGISTER_LAYOUT_COLUMN,
                new SQLiteParameter("courseID", courseID),
                new SQLiteParameter("containerWidth", containerWidth),
                new SQLiteParameter("position", position)
            );
            return GetLayoutColumn(courseID, id);
        }

        public LayoutColumn GetLayoutColumn(int courseID, int columnID)
        {
            using (SQLiteDataReader r = Query(DatabaseQueries.QUERY_LAYOUT_COLUMN,
                new SQLiteParameter("courseID", courseID),
                new SQLiteParameter("columnID", columnID)
                )) {
                if (r.Read()) {
                    try {
                        return new LayoutColumn(
                            r.GetInt32(0),
                            courseID,
                            r.GetValue(1).ToString(),
                            r.GetInt32(2)
                        );
                    } catch (Exception e) {
                        PrintQueryError("GetLayoutColumn", 2, r, e);
                    }

                }
            }
            return null;

        }

        public List<LayoutColumn> GetLayoutColumns(int courseID)
        {
            List<LayoutColumn> columns = new();

            using(SQLiteDataReader r = Query(DatabaseQueries.QUERY_LAYOUT_COLUMNS,
                    new SQLiteParameter("courseID", courseID)
                )) {
                while (r.Read())
                {
                    try {
                        LayoutColumn row = new(
                            r.GetInt32(0),
                            courseID,
                            r.GetValue(1).ToString(),
                            r.GetInt32(2)
                        );
                        columns.Add(row);
                    } catch (Exception e) {
                        PrintQueryError("GetLayoutColumns", 2, r, e);
                    }
                }
            }

            return columns;
        }

        public LayoutColumn UpdateLayoutColumn(
            int courseID,
            int columnID,
            string containerWidth,
            int position)
        {
            NonQuery(DatabaseQueries.UPDATE_LAYOUT_COLUMN,
                new SQLiteParameter("courseID", courseID),
                new SQLiteParameter("id", columnID),
                new SQLiteParameter("containerWidth", containerWidth),
                new SQLiteParameter("position", position)
            );

            return GetLayoutColumn(courseID, columnID);
        }

        public void DeleteLayoutColumn(
            int courseID,
            int columnID
        ) {
            NonQuery(DatabaseQueries.DELETE_LAYOUT_COLUMN,
                new SQLiteParameter("courseID", courseID),
                new SQLiteParameter("id", columnID)
            );
            NonQuery(DatabaseQueries.RELEASE_TILE_GROUPS_FROM_COLUMN,
                new SQLiteParameter("courseID", courseID),
                new SQLiteParameter("id", columnID)
            );
        }

        public Tile GetTile(int courseID, int tileID)
        {
            using(SQLiteDataReader r = Query(DatabaseQueries.QUERY_TILE,
                    new SQLiteParameter("courseID", courseID),
                    new SQLiteParameter("id", tileID)
                )) {
                if (r.Read())
                    return new Tile(
                        r.GetInt32(0),
                        r.GetInt32(1),
                        r.GetValue(2).ToString(),
                        r.GetInt32(3),
                        r.GetValue(4).ToString(),
                        r.GetValue(5).ToString(),
                        r.GetBoolean(6),
                        r.GetBoolean(7),
                        r.GetBoolean(8),
                        r.GetBoolean(9)
                    );
            }

            return null;
        }

        public Tile CreateTile(
            int courseID,
            int groupID,
            string title,
            int position,
            string contentType,
            string tileType,
            bool visible,
            bool notifications,
            bool graph_view,
            bool wildcard)
        {
            int id = IDNonQuery(DatabaseQueries.REGISTER_TILE,
                new SQLiteParameter("groupID", groupID),
                new SQLiteParameter("title", title),
                new SQLiteParameter("position", position),
                new SQLiteParameter("contentType", contentType),
                new SQLiteParameter("tileType", tileType),
                new SQLiteParameter("visible", visible),
                new SQLiteParameter("notifications", notifications),
                new SQLiteParameter("graph_view", graph_view),
                new SQLiteParameter("wildcard", wildcard)
            );
            return GetTile(courseID, id);
        }

        public List<TileEntry> GetTileEntries(int tileID)
        {

            List<TileEntry> entries = new();

            using(SQLiteDataReader r = Query(DatabaseQueries.QUERY_TILE_ENTRIES,
                    new SQLiteParameter("tileID", tileID)
                )) {
                while (r.Read())
                {
                    entries.Add(new TileEntry(
                        r.GetInt32(0),
                        0,
                        r.GetInt32(1),
                        r.GetValue(2).ToString(),
                        r.GetValue(3).ToString()
                    ));
                }
            }

            return entries;
        }

        public void DeleteTile(int courseID, int tileID)
        {
            DeleteGoals(courseID, tileID);
            NonQuery(@"DELETE FROM `tile` WHERE `id` = @tileID;",
                new SQLiteParameter("tileID", tileID)
            );
        }

        public void SetConsent(ConsentData data)
        {
             NonQuery(DatabaseQueries.SET_USER_CONSENT,
                new SQLiteParameter("courseID", data.CourseID),
                new SQLiteParameter("userID", data.UserID),
                new SQLiteParameter("name", data.UserName),
                new SQLiteParameter("consent", data.Granted)
            );

            if (data.Granted == -1)
                UpdateUserGoalGrade(data.CourseID, data.UserID, -1);
        }

        public int GetConsent(int courseID, string userID)
        {
            using(SQLiteDataReader r = Query(DatabaseQueries.QUERY_USER_CONSENT,
                    new SQLiteParameter("courseID", courseID),
                    new SQLiteParameter("userID", userID)
                )){
                if (r.Read())
                    return Convert.ToInt32(r["consent"]);
            }
            return -1;
        }

        public ConsentData[] GetGrantedConsents(int courseID)
        {

            List<ConsentData> consents = new();

            using(SQLiteDataReader r = Query(DatabaseQueries.QUERY_GRANTED_CONSENTS,
                    new SQLiteParameter("courseID", courseID)
                )) {
                while (r.Read())
                {
                    consents.Add(new ConsentData(courseID, r.GetValue(0).ToString(), r.GetValue(1).ToString(), 1));
                }
            }

            return consents.ToArray();


        }
        public ConsentData[] GetConsents(int courseID)
        {
            List<ConsentData> consents = new();

            using(SQLiteDataReader r = Query(DatabaseQueries.QUERY_CONSENTS,
                    new SQLiteParameter("courseID", courseID)
                )) {
                while (r.Read())
                {
                    try {
                        consents.Add(new ConsentData(courseID, r.GetValue(0).ToString(), r.GetValue(1).ToString(), r.GetInt32(2)));
                    } catch ( Exception e) {
                        PrintQueryError("GetConsents", 3, r, e);
                    }
                }
            }

            return consents.ToArray();
        }

        public void AddExternalData(int courseID, ExternalData[] entries)
        {
            foreach (ExternalData entry in entries)
            {
                NonQuery(DatabaseQueries.REGISTER_EXTERNALDATA,
                    new SQLiteParameter("courseID", courseID),
                    new SQLiteParameter("tileID", entry.TileID),
                    new SQLiteParameter("title", entry.Title),
                    new SQLiteParameter("grade", entry.Grade),
                    new SQLiteParameter("userID", entry.UserID)
                );
            }
        }

        public ExternalData[] GetExternalData(int courseID, int tileID, string userID)
        {
            // string query = tileID == -1
            //     ? String.Format(
            //             "SELECT `user_id`, `title`, `grade` from `external_data` WHERE `course_id`={0} AND `user_id`='{1}'",
            //             courseID, userID
            //         )
            //     : userID != null ?
            //         String.Format(
            //             "SELECT `user_id`, `title`, `grade` from `external_data` WHERE `course_id`={0} AND `tile_id`={1} AND `user_id`='{2}'",
            //             courseID, tileID, userID
            //         ) : String.Format(
            //             "SELECT `user_id`, `title`, `grade` from `external_data` WHERE `course_id`={0} AND `tile_id`={1}",
            //             courseID, tileID
            //         );
            List<ExternalData> submissions = new();

            using(SQLiteDataReader r = Query(DatabaseQueries.QUERY_EXTERNALDATA,
                    new SQLiteParameter("courseID", courseID),
                    new SQLiteParameter("tileID", tileID == -1 ? '*' : tileID),
                    new SQLiteParameter("userID", userID == null ? '*' : userID)
                )) {
                while (r.Read())
                {
                    ExternalData submission = new(courseID, r.GetValue(0).ToString(), tileID, r.GetValue(1).ToString(), r.GetValue(2).ToString());
                    submissions.Add(submission);
                }
            }

            return submissions.ToArray();
        }

        public void TrackUserAction(
            string userID,
            string action
        ) {
            NonQuery(DatabaseQueries.INSERT_USER_ACTION,
                new SQLiteParameter("userID", userID),
                new SQLiteParameter("action", action)
            );
        }

    }
}
