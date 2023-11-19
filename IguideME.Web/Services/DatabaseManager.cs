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
using StackExchange.Redis;
using static IguideME.Web.Models.Tile;

namespace IguideME.Web.Services
{

    public sealed class DatabaseManager
    {
        private static DatabaseManager s_instance;
        private readonly string _connection_string;
        private readonly ILogger _logger;

        private DatabaseManager(bool isDev = false)
        {
            DatabaseManager.s_instance = this;
            _connection_string = isDev ? "Data Source=db.sqlite;Version=3;New=False;Compress=True;"
                                      : "Data Source=/data/IguideME.db;Version=3;New=False;Compress=True;";

            DatabaseManager.s_instance.RunMigrations();
            DatabaseManager.s_instance.CreateTables();
            ILoggerFactory factory = LoggerFactory.Create(builder => builder.AddConsole());
            _logger = factory.CreateLogger("DatabaseManager");
        }

        public static DatabaseManager GetInstance(bool isDev = false)
        {

            s_instance ??= new DatabaseManager(isDev);

            return s_instance;
        }

        private SQLiteConnection GetConnection() => new(_connection_string);

        private void NonQuery(string query, params SQLiteParameter[] parameters)
        {
            SQLiteConnection connection = GetConnection();
            try
            {
                connection.Open();
                using (SQLiteCommand command = connection.CreateCommand())
                {
                    command.CommandText = query;
                    foreach (SQLiteParameter param in parameters)
                    {
                        command.Parameters.Add(param);
                    }
                    command.ExecuteNonQuery();
                }
                connection.Close();
            }
            catch
            {
                // Close connection before rethrowing
                connection.Close();
                throw;
            }
        }

        private int IDNonQuery(string query, params SQLiteParameter[] parameters)
        {
            int id = 0;
            SQLiteConnection connection = GetConnection();
            try
            {
                connection.Open();
                using (SQLiteCommand command = connection.CreateCommand())
                {
                    command.CommandText = query;
                    foreach (SQLiteParameter param in parameters)
                    {
                        command.Parameters.Add(param);
                    }
                    command.ExecuteNonQuery();
                }

                using (SQLiteCommand command = connection.CreateCommand())
                {
                    command.CommandText = "SELECT last_insert_rowid()";
                    id = int.Parse(command.ExecuteScalar().ToString());
                }
                connection.Close();
            }
            catch
            {
                // Close connection before rethrowing
                connection.Close();
                throw;
            }

            return id;
        }

        private SQLiteDataReader Query(string query, params SQLiteParameter[] parameters)
        {
            SQLiteConnection connection = GetConnection();
            try
            {
                connection.Open();
                using (SQLiteCommand command = connection.CreateCommand())
                {
                    command.CommandText = query;
                    foreach (SQLiteParameter param in parameters)
                    {
                        command.Parameters.Add(param);
                    }
                    return command.ExecuteReader(CommandBehavior.CloseConnection);
                }
            }
            catch (Exception e)
            {
                // Close connection before rethrowing
                _logger.LogError("Exception encountered while creating query: {message}", e.Message);
                connection.Close();
                throw;
            }
        }

        private void PrintQueryError(string title, int rows, SQLiteDataReader r, Exception e)
        {
            string error = $"{title}\nRequested:\nColumn | Data Type | Value | Type\n";

            try
            {
                for (int i = 0; i <= rows; i++)
                    error += $"{r.GetName(i)} {r.GetDataTypeName(i)} {r.GetValue(i)} {r.GetValue(i).GetType()}\n";

                _logger.LogError("Error reading from the query: {error} \n\n {message} \n {trace}", error, e.Message, e.StackTrace);
            }
            catch (Exception ex)
            {
                _logger.LogError("Error in printquerryerror: {message} {trace}\n\nOriginal error:\n{original} {originaltrace}", ex.Message, ex.StackTrace, e.Message, e.StackTrace);
            }
        }

        public void LogTable(string name)
        {
            _logger.LogDebug("Logging table {name}", name);

            string table = "";
            using (SQLiteDataReader r = Query("select * from @name", new SQLiteParameter("name", name)))
            {
                for (int i = 0; i < r.FieldCount; i++)
                {
                    table += r.GetName(i) + "\t";
                }
                table += "\n\n";
                while (r.Read())
                {
                    for (int i = 0; i < r.FieldCount; i++)
                    {
                        table += r.GetValue(i).ToString() + "\t";
                    }
                    table += "\n";
                }
            }

            _logger.LogDebug("contents:\n {table}", table);

        }

        private void CreateTables()
        {
            // collection of all table creation queries
            string[] queries =
            {
                DatabaseQueries.CREATE_TABLE_USERS,
                DatabaseQueries.CREATE_TABLE_COURSE_SETTINGS,

                DatabaseQueries.CREATE_TABLE_SYNC_HISTORY,

                DatabaseQueries.CREATE_TABLE_STUDENT_SETTINGS,
                DatabaseQueries.CREATE_TABLE_USER_TRACKER,

                DatabaseQueries.CREATE_TABLE_LAYOUT_COLUMNS,
                DatabaseQueries.CREATE_TABLE_LAYOUT_TILE_GROUPS,
                DatabaseQueries.CREATE_TABLE_TILES,

                DatabaseQueries.CREATE_TABLE_ASSIGNMENTS,
                DatabaseQueries.CREATE_TABLE_LEARNING_GOALS,
                DatabaseQueries.CREATE_TABLE_GOAL_REQUREMENTS,
                DatabaseQueries.CREATE_TABLE_DISCUSSIONS,
                DatabaseQueries.CREATE_TABLE_DISCUSSION_REPLIES,

                DatabaseQueries.CREATE_TABLE_TILE_ENTRIES,
                DatabaseQueries.CREATE_TABLE_SUBMISSIONS,
                DatabaseQueries.CREATE_TABLE_SUBMISSIONS_META,

                DatabaseQueries.CREATE_TABLE_GRADE_PREDICTION_MODEL,
                DatabaseQueries.CREATE_TABLE_GRADE_PREDICTION_MODEL_PARAMETER,

                DatabaseQueries.CREATE_TABLE_PEER_GROUPS,
                DatabaseQueries.CREATE_TABLE_NOTIFICATIONS,

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

                Console.WriteLine($"Migration {migration_id} not yet applied, proceeding to apply...");

                string migration_sql = entry.Value;
                NonQuery(migration_sql);
                NonQuery(DatabaseQueries.REGISTER_MIGRATION, new SQLiteParameter("id", migration_id));
            }
        }

        private long GetCurrentSyncID(int courseID)
        {
            /**
             * Retrieve latest complete synchronization for course. If no
             * historic synchronization was found then null is returned.
             */
            using (SQLiteDataReader r = Query(DatabaseQueries.QUERY_LATEST_SYNCS_FOR_COURSE,
                                              new SQLiteParameter("courseID", courseID),
                                              new SQLiteParameter("limit", 1)))
                if (r.Read())
                    return long.Parse(r.GetValue(0).ToString());

            return 0;
        }

        private List<long> GetRecentSyncs(int courseID, int number_of_syncs)
        {
            /**
             * Retrieve latest n complete synchronizations for course. If no
             * historic synchronization was found then null is returned.
             */

            List<long> syncIDs = new();

            using (SQLiteDataReader r = Query(DatabaseQueries.QUERY_LATEST_SYNCS_FOR_COURSE,
                                              new SQLiteParameter("courseID", courseID),
                                              new SQLiteParameter("limit", number_of_syncs)))
                while (r.Read())
                {
                    syncIDs.Add(long.Parse(r.GetValue(0).ToString()));
                }

            return syncIDs;
        }

        public void CleanupSync(int courseID)
        {
            RemoveSyncsWithNoEndTimestamp(courseID);

            List<long> syncIDs = new();

            using (SQLiteDataReader r = Query(DatabaseQueries.QUERY_OLD_HASHES_FOR_COURSE,
                                              new SQLiteParameter("courseID", courseID),
                                              new SQLiteParameter("offset", 15)))
            {
                while (r.Read())
                {
                    try
                    {
                        syncIDs.Add(long.Parse(r.GetValue(0).ToString()));
                    }
                    catch (Exception e)
                    {
                        _logger.LogError("Unable to get old sync: {sync}\nError: {message}\n{trace}", r.GetValue(0), e.Message, e.StackTrace);
                    }
                }
            }
            foreach (long syncID in syncIDs)
            {
                NonQuery(DatabaseQueries.DELETE_OLD_SYNCS_FOR_COURSE, new SQLiteParameter("courseID", courseID), new SQLiteParameter("syncID", syncID));
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
            using (SQLiteDataReader r = Query(DatabaseQueries.QUERY_COURSE_IDS))
            {
                try
                {
                    while (r.Read())
                    {
                        course_ids.Add(r.GetInt32(0));
                    }

                }
                catch (Exception e)
                {
                    PrintQueryError("GetCourseIds", 0, r, e);
                }
            }
            return course_ids;
        }


        public void RemoveSyncsWithNoEndTimestamp(int courseID)
        {
            _logger.LogInformation("Starting cleanup of sync hystory ");
            try
            {
                NonQuery(
                    DatabaseQueries.DELETE_INCOMPLETE_SYNCS,
                    new SQLiteParameter("courseID", courseID)
                );
            }
            catch (Exception e)
            {
                _logger.LogError("Error removing syncs: {message}\n{trace}", e.Message, e.StackTrace);
            }
        }

        public void RegisterSync(
            int courseID,
            long syncID)
        {
            /**
             * Create a new synchronization record.
             */
            NonQuery(
                DatabaseQueries.REGISTER_NEW_SYNC,
                new SQLiteParameter("courseID", courseID),
                new SQLiteParameter("startTimestamp", syncID)
            );
        }

        /**
         * Update synchronization record state to completed.
         */
        public void CompleteSync(long syncID)
        {

            long currentTimestamp = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds();

            NonQuery(
                DatabaseQueries.COMPLETE_NEW_SYNC,
                new SQLiteParameter("currentTimestamp", currentTimestamp),
                new SQLiteParameter("startTimestamp", syncID)
            );
        }

        public List<DataSynchronization> GetSyncHashes(int courseID)
        {
            /**
             * Return all synchronization records for a course.
             */
            List<DataSynchronization> hashes = new();

            using (SQLiteDataReader r = Query(DatabaseQueries.QUERY_SYNC_HASHES_FOR_COURSE, new SQLiteParameter("courseID", courseID)))
            {
                while (r.Read())
                {
                    try
                    {
                        string status;
                        long? endTime = null;

                        if (r.GetValue(2).GetType() != typeof(DBNull))
                        {
                            endTime = long.Parse(r.GetValue(2).ToString()); //.ToLocalTime()
                            status = "COMPLETE";
                        }
                        else
                        {
                            status = "INCOMPLETE";
                        }

                        hashes.Add(new DataSynchronization(
                            r.GetInt32(0),
                            long.Parse(r.GetValue(1).ToString()),
                            endTime,
                            status
                            )
                        );
                    }
                    catch (Exception e)
                    {
                        PrintQueryError("GetsyncIDes", 5, r, e);
                    }
                }
            }

            return hashes;
        }

        public int GetMinimumPeerGroupSize(int courseID)
        {

            using (SQLiteDataReader r = Query(DatabaseQueries.QUERY_PEER_GROUP_FOR_COURSE, new SQLiteParameter("courseID", courseID)))
            {
                if (r.Read())
                    return r.GetInt32(0);
            }

            return 1;
        }


        public List<string> GetNotificationDates(int courseID)
        {
            List<string> dates = new();
            using (SQLiteDataReader r = Query(DatabaseQueries.QUERY_NOTIFICATION_DATES_FOR_COURSE, new SQLiteParameter("courseID", courseID)))
                if (r.Read())
                    return r.GetValue(0).ToString().Split(',').ToList();

            return dates;
        }

        public void RegisterUser(
            int? studentnumber,
            string userID,
            string name,
            string sortableName,
            int role)
        {
            NonQuery(DatabaseQueries.REGISTER_USER_FOR_COURSE,
                    new SQLiteParameter("studentnumber", studentnumber),
                    new SQLiteParameter("userID", userID),
                    new SQLiteParameter("name", name),
                    new SQLiteParameter("sortableName", sortableName),
                    new SQLiteParameter("role", role)
                    );
        }

        public void RegisterAssignment(
            int? assignmentID,
            int courseID,
            string title,
            bool published,
            bool muted,
            int dueDate,
            double? maxGrade,
            int gradingType)
        {
            NonQuery(
                DatabaseQueries.REGISTER_ASSIGNMENT,
                new SQLiteParameter("assignmentID", assignmentID.ToString()),
                new SQLiteParameter("courseID", courseID),
                new SQLiteParameter("title", title),
                new SQLiteParameter("published", published),
                new SQLiteParameter("muted", muted),
                new SQLiteParameter("dueDate", dueDate),
                new SQLiteParameter("maxGrade", maxGrade),
                new SQLiteParameter("gradingType", gradingType)
            );
        }

        public void RegisterDiscussion(Discussion discussion, long syncID)
        {
            NonQuery(
                DatabaseQueries.REGISTER_DISCUSSION,
                new SQLiteParameter("discussionID", discussion.ID),
                new SQLiteParameter("courseID", discussion.CourseID),
                new SQLiteParameter("title", discussion.Title),
                new SQLiteParameter("authorName", discussion.UserName),
                new SQLiteParameter("date", discussion.PostedAt.HasValue ? (int)((DateTimeOffset)discussion.PostedAt.Value).ToUnixTimeSeconds() : 0),
                new SQLiteParameter("message", discussion.Message)
            );
        }

        public void UpdateDiscussion(Discussion discussion, int tileID, long syncID)
        {
            // I think that this is only to tie the discussion to the tile.
            // If that's so, then this is the wrong query, we just have to create a tile entry with this discussion id
            NonQuery(
                DatabaseQueries.REGISTER_DISCUSSION,
                new SQLiteParameter("discussionID", discussion.ID),
                new SQLiteParameter("courseID", discussion.CourseID),
                new SQLiteParameter("title", discussion.Title),
                new SQLiteParameter("authorName", discussion.UserName),
                new SQLiteParameter("date", discussion.PostedAt),
                new SQLiteParameter("message", discussion.Message)
                // new SQLiteParameter("message", discussion.Message.Replace("'", "''")),
                // new SQLiteParameter("tileID", tileID)
                );
        }

        public int RegisterDiscussionEntry(DiscussionEntry entry, string userID)
        {
            return IDNonQuery(
                    DatabaseQueries.REGISTER_DISCUSSION_REPLY,
                    new SQLiteParameter("entryID", entry.TopicID),
                    new SQLiteParameter("userID", userID),
                    new SQLiteParameter("date", entry.CreatedAt),
                    new SQLiteParameter("message", entry.Message)
            // new SQLiteParameter("message", entry.Message.Replace("'", "''")),

            );
        }

        public void RegisterDiscussionReply(DiscussionReply reply, int discussionID, string userID)
        {
            if (discussionID == -1)
            {
                return;
            }

            NonQuery(
                DatabaseQueries.REGISTER_DISCUSSION_REPLY,
                new SQLiteParameter("entryID", discussionID),
                new SQLiteParameter("userID", userID),
                new SQLiteParameter("date", reply.CreatedAt),
                new SQLiteParameter("message", reply.Message)
            );
        }

        public List<User> GetUsers(int courseID, UserRoles role = UserRoles.student, long syncID = 0)
        {
            long activeSync = syncID == 0 ? this.GetCurrentSyncID(courseID) : syncID;
            if (activeSync == 0)
            {
                _logger.LogWarning("Hash is null, returning empty user list.");
                return new List<User>() { };
            }
            List<User> users = new();

            using (SQLiteDataReader r = Query(DatabaseQueries.QUERY_USERS_WITH_ROLE_FOR_COURSE,
                    new SQLiteParameter("courseID", courseID),
                    new SQLiteParameter("role", (int)role),
                    new SQLiteParameter("syncID", activeSync)
                ))
            {
                // collect all users
                while (r.Read())
                {
                    User user = new(
                        r.GetValue(0).ToString(),
                        courseID,
                        r.GetInt32(1),
                        r.GetValue(2).ToString(),
                        r.GetValue(3).ToString(),
                        r.GetInt32(4),
                        role == UserRoles.student ? r.GetInt32(5) : 1
                    );
                    users.Add(user);
                }
            }

            return users;
        }


        public List<User> GetUsersWithGrantedConsent(int courseID, UserRoles role = UserRoles.student, long syncID = 0)
        {
            long activeSync = syncID == 0 ? this.GetCurrentSyncID(courseID) : syncID;
            if (activeSync == 0)
            {
                _logger.LogWarning("Hash is null, returning empty user list.");
                return new List<User>() { };
            }

            List<User> users = new();

            using (SQLiteDataReader r = Query(DatabaseQueries.QUERY_CONSENTED_STUDENTS_FOR_COURSE,
                    new SQLiteParameter("courseID", courseID),
                    new SQLiteParameter("syncID", activeSync)
                ))
            {
                while (r.Read())
                {
                    User user = new(
                        r.GetValue(0).ToString(),
                        courseID,
                        r.GetInt32(1),
                        r.GetValue(2).ToString(),
                        r.GetValue(3).ToString(),
                        r.GetInt32(4),
                        role == UserRoles.student ? r.GetInt32(5) : 1
                    );
                    users.Add(user);
                }
            }

            return users;
        }

        public string GetUserID(int studentNumber)
        {
            using (SQLiteDataReader r = Query(DatabaseQueries.QUERY_USER_ID,
                    new SQLiteParameter("studentNumber", studentNumber)
                ))
            {
                if (r.Read())
                {
                    return r.GetValue(0).ToString();
                }
            }
            return null;
        }


        public string GetConsentedStudentID(int courseID, int studentNumber)
        {

            using (SQLiteDataReader r = Query(DatabaseQueries.QUERY_CONSENTED_USER_ID_FROM_STUDENT_NUMBER,
                    new SQLiteParameter("courseID", courseID),
                    new SQLiteParameter("studentNumber", studentNumber)
                ))
            {
                if (r.Read())
                    return r.GetValue(0).ToString();
            }
            return null;
        }

        public User GetCurrentUser(int courseID, string userID)
        {
            User user = null;
            using (SQLiteDataReader r = Query(DatabaseQueries.QUERY_USER_DATA_FOR_COURSE,
                    new SQLiteParameter("courseID", courseID),
                    new SQLiteParameter("userID", userID)
                ))
            {
                if (r.Read())
                {
                    user = new User(
                        r.GetValue(0).ToString(),
                        courseID,
                        r.GetInt32(1),
                        r.GetValue(2).ToString(),
                        r.GetValue(3).ToString(),
                        r.GetInt32(4)
                    );
                }
            }

            if (user is null)
            {
                _logger.LogWarning("User {u} not found for course {c}", userID, courseID);
            }

            if (user?.Role == UserRoles.student)
            {
                using (SQLiteDataReader r2 = Query(DatabaseQueries.QUERY_GOAL_GRADE_FOR_USER,
                    new SQLiteParameter("courseID", courseID),
                    new SQLiteParameter("userID", userID)
                ))
                {
                    if (r2.Read())
                    {
                        user.GoalGrade = r2.GetInt32(0);
                    }
                }
            }

            return user;
        }

        public User GetUser(int courseID, string userID)
        {
            User user = null;
            using (SQLiteDataReader r = Query(DatabaseQueries.QUERY_CONSENTED_USER_DATA_FOR_COURSE,
                    new SQLiteParameter("courseID", courseID),
                    new SQLiteParameter("userID", userID)
                ))
            {
                if (r.Read())
                {
                    user = new User(
                        r.GetValue(0).ToString(),
                        courseID,
                        r.GetInt32(1),
                        r.GetValue(2).ToString(),
                        r.GetValue(3).ToString(),
                        r.GetInt32(4),
                        r.GetValue(5) != null ? r.GetInt32(5) : 1
                    );
                }
            }

            return user;
        }

        public List<User> GetUsersWithGoalGrade(
            int courseID,
            int goalGrade,
            long syncID = 0)
        {
            long activeSync = syncID == 0 ? this.GetCurrentSyncID(courseID) : syncID;
            if (activeSync == 0) return new List<User> { };

            List<User> users = new();

            using (SQLiteDataReader r = Query(DatabaseQueries.QUERY_STUDENTS_WITH_GOAL_GRADE,
                    new SQLiteParameter("courseID", courseID),
                    new SQLiteParameter("goalGrade", goalGrade)
                ))
            {
                // collect all users
                while (r.Read())
                {
                    User user = new(
                        r.GetValue(0).ToString(),
                        courseID,
                        r.GetInt32(1),
                        r.GetValue(2).ToString(),
                        r.GetValue(3).ToString(),
                        r.GetInt32(4),
                        goalGrade
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

            using (SQLiteDataReader r = Query(DatabaseQueries.QUERY_GRADE_PREDICTION_MODELS_FOR_COURSE,
                    new SQLiteParameter("courseID", courseID)
                ))
            {
                while (r.Read())
                {
                    try
                    {
                        model = new GradePredictionModel(r.GetInt32(0),
                                                    courseID,
                                                    r.GetBoolean(2),
                                                    r.GetFloat(1));
                        // model.getParameters();
                        models.Add(model);
                    }
                    catch (Exception e)
                    {
                        PrintQueryError("GetGrade{redictionModels", 2, r, e);
                    }
                }
            }

            models.ForEach((GradePredictionModel model) => model.Parameters = GetGradePredictionModelParameters(model.ID));

            return models;
        }

        public GradePredictionModel GetGradePredictionModel(int courseID)
        {

            GradePredictionModel model = null;

            using (SQLiteDataReader r = Query(DatabaseQueries.QUERY_GRADE_PREDICTION_MODEL_FOR_COURSE,
                new SQLiteParameter("courseID", courseID)
                ))
            {
                if (r.Read())
                {
                    model = new GradePredictionModel(
                            r.GetInt32(0),
                            courseID,
                            true,
                            r.GetFloat(1));
                }
            }

            if (model != null)
                model.Parameters = GetGradePredictionModelParameters(model.ID);
            return model;
        }


        public List<GradePredictionModelParameter> GetGradePredictionModelParameters(int modelID)
        {

            List<GradePredictionModelParameter> parameters = new();

            using (SQLiteDataReader r = Query(DatabaseQueries.QUERY_GRADE_PREDICTION_MODEL_PARAMETERS_FOR_MODEL,
                new SQLiteParameter("modelID", modelID)
            ))
            {
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
            double grade,
            long syncID = 0)
        {
            long activeSync = syncID == 0 ? this.GetCurrentSyncID(courseID) : syncID;

            try
            {
                using (SQLiteDataReader r = Query(DatabaseQueries.QUERY_LAST_STUDENT_SETTINGS,
                        new SQLiteParameter("courseID", courseID),
                        new SQLiteParameter("userID", userID)
                    ))
                {
                    while (r.Read())
                    {
                        NonQuery(DatabaseQueries.REGISTER_STUDENT_SETTINGS,
                            new SQLiteParameter("courseID", courseID),
                            new SQLiteParameter("userID", userID),
                            new SQLiteParameter("PredictedGrade", grade),
                            new SQLiteParameter("GoalGrade", r.GetInt32(1)),
                            new SQLiteParameter("Consent", r.GetBoolean(2)),
                            new SQLiteParameter("Notifications", r.GetBoolean(3)),
                            new SQLiteParameter("syncID", activeSync)
                        );
                    }
                }
            }
            catch (Exception e)
            {
                _logger.LogError("Error storing predicted grade: {message}\n{trace}", e.Message, e.StackTrace);
            }
        }

        public void InitializeUserSettings(int courseID, string userID, long syncID)
        {
            long activeSync = syncID == 0 ? this.GetCurrentSyncID(courseID) : syncID;
            long old_sync = 0;

            using (SQLiteDataReader r = Query(DatabaseQueries.QUERY_LAST_STUDENT_SETTINGS,
                    new SQLiteParameter("courseID", courseID),
                    new SQLiteParameter("userID", userID)
                ))
            {
                if (r.Read())
                    old_sync = long.Parse(r.GetValue(4).ToString());
            }

            if (old_sync != 0)
                NonQuery(DatabaseQueries.QUERY_UPDATE_STUDENT_SETTINGS,
                    new SQLiteParameter("courseID", courseID),
                    new SQLiteParameter("userID", userID),
                    new SQLiteParameter("oldSyncID", old_sync),
                    new SQLiteParameter("syncID", activeSync));
            else
                NonQuery(DatabaseQueries.INITIALIZE_STUDENT_SETTINGS,
                            new SQLiteParameter("courseID", courseID),
                            new SQLiteParameter("userID", userID),
                            new SQLiteParameter("syncID", activeSync));
        }

        public bool GetTileNotificationState(int tileID)
        {
            bool result = false;
            using (SQLiteDataReader r = Query(DatabaseQueries.QUERY_TILE_NOTIFICATIONS_STATE,
                    new SQLiteParameter("tileID", tileID)
                ))
            {
                if (r.Read())
                {
                    try
                    {
                        result = r.GetBoolean(0);
                    }
                    catch (Exception e)
                    {
                        PrintQueryError("GetUserGoalGrade", 0, r, e);
                    }
                }
                return result;
            }
        }

        public void UpdateNotificationEnable(int courseID, string userID, bool enable, long syncID)
        {
            long activeSync = syncID == 0 ? this.GetCurrentSyncID(courseID) : syncID;
            using (SQLiteDataReader r = Query(DatabaseQueries.QUERY_LAST_STUDENT_SETTINGS,
                    new SQLiteParameter("courseID", courseID),
                    new SQLiteParameter("userID", userID)
                ))
            {
                while (r.Read())
                {
                    NonQuery(DatabaseQueries.REGISTER_STUDENT_SETTINGS,
                        new SQLiteParameter("courseID", courseID),
                        new SQLiteParameter("userID", userID),
                        new SQLiteParameter("PredictedGrade", long.Parse(r.GetValue(0).ToString())),
                        new SQLiteParameter("GoalGrade", r.GetInt32(1)),
                        new SQLiteParameter("Consent", r.GetBoolean(2)),
                        new SQLiteParameter("Notifications", enable),
                        new SQLiteParameter("syncID", activeSync)
                    );
                }
            }
        }

        public bool GetNotificationEnable(int courseID, string userID, long syncID)
        {

            bool result = true;
            using (SQLiteDataReader r = Query(DatabaseQueries.QUERY_NOTIFICATIONS_ENABLE,
                    new SQLiteParameter("courseID", courseID),
                    new SQLiteParameter("userID", userID)
                ))
            {
                if (r.Read())
                {
                    try
                    {
                        result = r.GetBoolean(0);
                    }
                    catch (Exception e)
                    {
                        PrintQueryError("GetUserGoalGrade", 0, r, e);
                    }
                }
                return result;
            }
        }

        public void UpdateUserGoalGrade(int courseID, string userID, int grade, long syncID)
        {
            long activeSync = syncID == 0 ? this.GetCurrentSyncID(courseID) : syncID;
            using (SQLiteDataReader r = Query(DatabaseQueries.QUERY_LAST_STUDENT_SETTINGS,
                    new SQLiteParameter("courseID", courseID),
                    new SQLiteParameter("userID", userID)
                ))
            {
                while (r.Read())
                {
                    NonQuery(DatabaseQueries.REGISTER_STUDENT_SETTINGS,
                        new SQLiteParameter("courseID", courseID),
                        new SQLiteParameter("userID", userID),
                        new SQLiteParameter("PredictedGrade", long.Parse(r.GetValue(0).ToString())),
                        new SQLiteParameter("GoalGrade", grade),
                        new SQLiteParameter("Consent", r.GetBoolean(2)),
                        new SQLiteParameter("Notifications", r.GetBoolean(3)),
                        new SQLiteParameter("syncID", activeSync)
                    );
                }
            }
        }

        public int GetUserGoalGrade(int courseID, string userID, long syncID)
        {
            int result = -1;
            using (SQLiteDataReader r = Query(DatabaseQueries.QUERY_GOAL_GRADE_FOR_USER,
                    new SQLiteParameter("courseID", courseID),
                    new SQLiteParameter("userID", userID)
                ))
            {
                if (r.Read())
                {
                    try
                    {
                        result = Convert.ToInt32(r.GetValue(0).ToString());
                    }
                    catch (Exception e)
                    {
                        PrintQueryError("GetUserGoalGrade", 0, r, e);
                    }
                }
                return result;
            }
        }

        // public GoalData[] GetGoalGrades(int courseID, long syncID)
        // {
        //     List<GoalData> goals = new();

        //     using(SQLiteDataReader r = Query(DatabaseQueries.QUERY_GOAL_GRADES,
        //             new SQLiteParameter("courseID", courseID),
        //             new SQLiteParameter("syncID", syncID)
        //         )) {
        //         while (r.Read())
        //         {
        //             try
        //             {
        //                 int grade = r.GetValue(0).GetType() != typeof(DBNull) ? (r.GetInt32(0)) : 0;
        //                 goals.Add(new GoalData(courseID, grade, r.GetValue(1).ToString()));
        //             } catch (Exception e)
        //             {
        //                 PrintQueryError("GetGoalGrades", 0, r, e);
        //             }
        //         }
        //     }
        //     return goals.ToArray();
        // }


        public void CreateUserPeer(
            int goalGrade,
            List<string> userIDs,
            int tileID,
            float avgGrade,
            float minGrade,
            float maxGrade,
            int entityType,
            long syncID)
        {
            string combinedIDs = string.Join(",", userIDs);
            NonQuery(DatabaseQueries.REGISTER_USER_PEER,
                new SQLiteParameter("goalGrade", goalGrade),
                new SQLiteParameter("combinedIDs", combinedIDs),
                new SQLiteParameter("tileID", tileID),
                new SQLiteParameter("avgGrade", avgGrade),
                new SQLiteParameter("minGrade", minGrade),
                new SQLiteParameter("maxGrade", maxGrade),
                new SQLiteParameter("entityType", entityType),
                new SQLiteParameter("syncID", syncID)
            );
        }


        public List<String> GetPeersFromGroup(
            int courseID,
            int goalGrade,
            long syncID = 0)
        {
            long activeSync = syncID == 0 ? this.GetCurrentSyncID(courseID) : syncID;
            if (activeSync == 0) return new List<string> { };

            List<String> peers = new();

            using (SQLiteDataReader r = Query(DatabaseQueries.QUERY_GROUP_PEERS,
                    new SQLiteParameter("courseID", courseID),
                    new SQLiteParameter("goalGrade", goalGrade),
                    new SQLiteParameter("syncID", activeSync)
                ))
            {
                while (r.Read())
                {
                    peers.Add(r.GetValue(0).ToString());
                }
            }
            return peers;
        }

        public int GetInternalAssignmentID(
            int externalID,
            int courseID)
        {
            return IDNonQuery(DatabaseQueries.QUERY_ASSIGNMENT_ID_FROM_EXTERNAL,
                    new SQLiteParameter("externalID", externalID),
                    new SQLiteParameter("courseID", courseID)
                );
        }

        public int CreateUserSubmission(
            int assignmentID,
            string userID,
            double grade,
            long date)
        {
            return IDNonQuery(DatabaseQueries.REGISTER_USER_SUBMISSION,
                    new SQLiteParameter("assignmentID", assignmentID),
                    new SQLiteParameter("userID", userID),
                    new SQLiteParameter("grade", grade),
                    new SQLiteParameter("date", date)
                );
        }

        public void CreateSubmissionMeta(
            int submissionID,
            string key,
            string value)
        {
            NonQuery(DatabaseQueries.REGISTER_SUBMISSION_META,
                new SQLiteParameter("submissionID", submissionID),
                new SQLiteParameter("key", key),
                new SQLiteParameter("value", value)
            );
        }

        public List<AssignmentSubmission> GetAssignmentSubmissions(
            int courseID,
            int entryID)
        {
            List<AssignmentSubmission> submissions = new();

            using (SQLiteDataReader r = Query(DatabaseQueries.QUERY_SUBMISSIONS_FOR_ENTRY,
                    new SQLiteParameter("entryID", entryID)
                ))
            {
                while (r.Read())
                {
                    AssignmentSubmission submission = new(
                        r.GetInt32(0),
                        r.GetInt32(1),
                        r.GetValue(2).ToString(),
                        r.GetFloat(3),
                        r.GetInt64(4)
                    );
                    submissions.Add(submission);
                }
            }

            foreach (AssignmentSubmission sub in submissions)
            {
                sub.Meta = GetEntryMeta(sub.ID);
            }

            return submissions;
        }

        public List<AssignmentSubmission> GetCourseSubmissions(
            int courseID,
            long syncID = 0)
        {
            long activeSync = syncID == 0 ? this.GetCurrentSyncID(courseID) : syncID;
            if (activeSync == 0) return new List<AssignmentSubmission>() { };

            List<AssignmentSubmission> submissions = new();

            using (SQLiteDataReader r = Query(DatabaseQueries.QUERY_COURSE_SUBMISSIONS,
                    new SQLiteParameter("courseID", courseID),
                    new SQLiteParameter("syncID", activeSync)
                ))
            {
                while (r.Read())
                {
                    try
                    {
                        AssignmentSubmission submission = new(
                            r.GetInt32(0),
                            r.GetInt32(1),
                            r.GetValue(2).ToString(),
                            r.GetInt32(3),
                            r.GetInt32(4)
                        );
                        submissions.Add(submission);
                    }
                    catch (Exception e)
                    {
                        PrintQueryError("GetCourseSubmissions", 4, r, e);
                    }
                }
            }

            foreach (AssignmentSubmission sub in submissions)
            {
                sub.Meta = GetEntryMeta(sub.ID);
            }

            return submissions;
        }

        public List<AssignmentSubmission> GetCourseSubmissionsForStudent(
            int courseID,
            string userID,
            long syncID = 0)
        {
            long activeSync = syncID == 0 ? this.GetCurrentSyncID(courseID) : syncID;
            if (activeSync == 0) return new List<AssignmentSubmission>() { };

            List<AssignmentSubmission> submissions = new();

            using (SQLiteDataReader r = Query(DatabaseQueries.QUERY_COURSE_SUBMISSIONS_FOR_STUDENT,
                    new SQLiteParameter("courseID", courseID),
                    new SQLiteParameter("userID", userID)
                ))
            {
                while (r.Read())
                {
                    AssignmentSubmission submission = new(
                        r.GetInt32(0),
                        r.GetInt32(1),
                        r.GetValue(2).ToString(),
                        r.GetInt32(3),
                        r.GetInt32(4)
                    );
                    submissions.Add(submission);
                }
            }

            foreach (AssignmentSubmission sub in submissions)
            {
                sub.Meta = GetEntryMeta(sub.ID);
            }

            return submissions;
        }


        public List<AssignmentSubmission> GetAssignmentSubmissionsForUser(
            int courseID,
            int entryID,
            string userID)
        {
            List<AssignmentSubmission> submissions = new();

            using (SQLiteDataReader r = Query(DatabaseQueries.QUERY_USER_SUBMISSIONS_FOR_ENTRY_FOR_USER,
                    new SQLiteParameter("entryID", entryID),
                    new SQLiteParameter("userID", userID)
                ))
            {
                while (r.Read())
                {
                    AssignmentSubmission submission = new(
                        r.GetInt32(0),
                        r.GetInt32(1),
                        r.GetValue(2).ToString(),
                        r.GetFloat(3),
                        r.GetInt64(4)
                    );
                    submissions.Add(submission);
                }
            }

            foreach (AssignmentSubmission sub in submissions)
            {
                sub.Meta = GetEntryMeta(sub.ID);
            }

            return submissions;
        }

        public List<AssignmentSubmission> GetTileSubmissions(int courseID, int tileID, long syncID = 0)
        {
            long activeSync = syncID == 0 ? this.GetCurrentSyncID(courseID) : syncID;
            if (activeSync == 0) return new List<AssignmentSubmission>() { };

            List<AssignmentSubmission> submissions = new();

            using (SQLiteDataReader r = Query(DatabaseQueries.QUERY_ALL_USER_SUBMISSIONS_FOR_TILE,
                    new SQLiteParameter("tileID", tileID)
                ))
            {
                while (r.Read())
                {
                    AssignmentSubmission submission = new(
                        r.GetInt32(0),
                        r.GetInt32(1),
                        r.GetValue(2).ToString(),
                        r.GetInt32(3),
                        r.GetInt32(4)
                    );
                    submissions.Add(submission);
                }
            }

            foreach (AssignmentSubmission sub in submissions)
            {
                sub.Meta = GetEntryMeta(sub.ID);
            }

            return submissions;
        }


        public List<AssignmentSubmission> GetTileSubmissionsForUser(
            int courseID,
            int tileID,
            string userID,
            long syncID = 0)
        {
            long activeSync = syncID == 0 ? this.GetCurrentSyncID(courseID) : syncID;
            if (activeSync == 0) return new List<AssignmentSubmission>() { };

            List<AssignmentSubmission> submissions = new();

            using (SQLiteDataReader r = Query(DatabaseQueries.QUERY_SUBMISSIONS_FOR_TILE_FOR_USER,
                    new SQLiteParameter("tileID", tileID),
                    new SQLiteParameter("userID", userID)
                ))
            {
                while (r.Read())
                {
                    AssignmentSubmission submission = new(
                        r.GetInt32(0),
                        r.GetInt32(1),
                        r.GetValue(2).ToString(),
                        r.GetInt32(3),
                        r.GetInt32(4)
                    );
                    submissions.Add(submission);
                }
            }

            foreach (AssignmentSubmission sub in submissions)
            {
                sub.Meta = GetEntryMeta(sub.ID);
            }

            return submissions;
        }

        public PeerGroup GetPeerGroup(int courseID)
        {
            PeerGroup group = null;

            using (SQLiteDataReader r = Query(DatabaseQueries.QUERY_PEER_GROUP_FOR_COURSE,
                    new SQLiteParameter("courseID", courseID)
                ))
            {
                if (r.Read())
                {
                    group = new PeerGroup(
                        r.GetInt32(0)
                    );
                }
            }

            return group;
        }

        public PublicInformedConsent GetPublicInformedConsent(
            int courseID)
        {
            PublicInformedConsent consent = null;

            using (SQLiteDataReader r = Query(DatabaseQueries.QUERY_CONSENT_FOR_COURSE,
                    new SQLiteParameter("courseID", courseID)
                ))
            {
                if (r.Read())
                {
                    consent = new PublicInformedConsent(
                        r.GetValue(0).ToString(),
                        r.GetValue(1).ToString()
                    );
                }
            }

            return consent;
        }

        public void UpdateInformedConsent(
            int courseID,
            string text,
            long syncID)
        {
            NonQuery(DatabaseQueries.UPDATE_CONSENT_FOR_COURSE,
                new SQLiteParameter("courseID", courseID),
                new SQLiteParameter("text", text)
            );

            // Then we remove consent from all students

            // First we find all their ids and save them in a list
            List<int> consentedStudentIds = new List<int>();
            using (SQLiteDataReader r = Query(DatabaseQueries.QUERY_CONSENTED_STUDENTS_FOR_COURSE,
                    new SQLiteParameter("courseID", courseID),
                    new SQLiteParameter("syncID", syncID)
                ))
            {
                while (r.Read())
                {
                    try
                    {
                        // add the id of every consented student to the list
                        consentedStudentIds.Add(r.GetInt32(0));
                    }
                    catch (Exception e)
                    {
                        PrintQueryError("UpdateInformedConsent", 0, r, e);
                    }
                }
            }
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

        // public void RecycleExternalData(int courseID, long syncID)
        // {
        //     NonQuery(DatabaseQueries.RECYCLE_EXTERNAL_DATA,
        //         new SQLiteParameter("courseID", courseID),
        //         new SQLiteParameter("syncID", syncID)
        //     );
        // }

        public void UpdateCoursePeerGroups(
            int courseID,
            int groupSize)
        {
            NonQuery(DatabaseQueries.UPDATE_PEER_GROUP_FOR_COURSE,
                new SQLiteParameter("courseID", courseID),
                new SQLiteParameter("groupSize", groupSize)
            );
        }

        public Dictionary<int, float> GetUserAssignmentGrades(
                int courseID,
                string userID)
        {
            Dictionary<int, float> grades = new();

            using (SQLiteDataReader r = Query(DatabaseQueries.QUERY_COURSE_SUBMISSIONS_FOR_STUDENT,
                    new SQLiteParameter("courseID", courseID),
                    new SQLiteParameter("userID", userID)
                ))
            {
                while (r.Read())
                {
                    try
                    {
                        // We save all the retrieved grades in a dictionary with
                        // the assignment.id as key and a list of grades as value
                        if (!grades.TryGetValue(r.GetInt32(1), out float value))
                        {
                            grades[r.GetInt32(1)] = 0f;
                        }
                        grades[r.GetInt32(1)] = r.GetFloat(3);
                    }
                    catch (Exception e)
                    {
                        PrintQueryError("GetUserAssignmentGrades", 3, r, e);
                    }
                }
            }
            return grades;
        }

        public Dictionary<int, float> GetUserDiscussionCounters(
                int courseID,
                string userID)
        {
            Dictionary<int, float> discussionCounters = new();

            using (SQLiteDataReader r = Query(DatabaseQueries.QUERY_DISCUSSION_COUNTER_FOR_USER,
                    new SQLiteParameter("courseID", courseID),
                    new SQLiteParameter("userID", userID)
                ))
            {
                while (r.Read())
                {
                    try
                    {
                        // We save the sum of discussion entries and replies in a dictionary with
                        // the root discussion_id as key and the total of their entries/replies as value
                        if (!r.IsDBNull(0))
                        {
                            int discID = r.GetInt32(0);
                            discussionCounters[discID] = r.GetInt32(1);
                        }

                    }
                    catch (Exception e)
                    {
                        PrintQueryError("GetUserDiscussionCounters", 3, r, e);
                    }
                }
            }
            return discussionCounters;
        }


        public PeerComparisonData[] GetUserPeerComparison(
            int courseID,
            string loginID,
            int entityType,
            long syncID = 0)
        {
            long activeSync = syncID == 0 ? this.GetCurrentSyncID(courseID) : syncID;
            if (activeSync == 0)
                return new PeerComparisonData[] {
                    PeerComparisonData.FromGrades(0, Array.Empty<float>())
                };

            List<PeerComparisonData> submissions = new();

            // First we need to find the user's goal grade to find their peer-group
            int goalGrade = GetUserGoalGrade(courseID, loginID, syncID);

            using (SQLiteDataReader r = Query(DatabaseQueries.QUERY_PEER_GROUP_RESULTS,
                    new SQLiteParameter("courseID", courseID),
                    new SQLiteParameter("goalGrade", goalGrade),
                    new SQLiteParameter("entityType", entityType),
                    new SQLiteParameter("syncID", activeSync)
                ))
            {
                while (r.Read())
                {
                    try
                    {
                        PeerComparisonData submission = new(
                            r.GetInt32(0),
                            r.GetFloat(1),
                            r.GetFloat(2),
                            r.GetFloat(3)
                        );
                        submissions.Add(submission);

                    }
                    catch (Exception e)
                    {
                        PrintQueryError("GetUserPeerComparison2", 3, r, e);
                    }
                }
            }
            return submissions.ToArray();
        }

        public List<PredictedGrade> GetPredictedGrades(int courseID, string userID)
        {
            List<PredictedGrade> predictions = new();

            using (SQLiteDataReader r = Query(DatabaseQueries.QUERY_PREDICTED_GRADES_FOR_USER,
                    new SQLiteParameter("courseID", courseID),
                    new SQLiteParameter("userID", userID)
                ))
            {
                while (r.Read())
                {
                    PredictedGrade prediction = new(
                        userID,
                        r.GetFloat(1),
                        r.GetFloat(0)
                    );
                    predictions.Add(prediction);
                }
            }

            return predictions;
        }

        public PeerComparisonData[] GetUserResults(
            int courseID,
            string userID)
        {

            List<PeerComparisonData> submissions = new();

            using (SQLiteDataReader r1 = Query(DatabaseQueries.QUERY_USER_RESULTS,
                    new SQLiteParameter("courseID", courseID),
                    new SQLiteParameter("userID", userID)
                ))
            {
                while (r1.Read())
                {
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


        public List<AssignmentSubmission> GetTileSubmissionsForUser(
            int courseID,
            string userID,
            long syncID = 0)
        {

            List<AssignmentSubmission> submissions = new();

            using (SQLiteDataReader r1 = Query(DatabaseQueries.QUERY_COURSE_SUBMISSIONS_FOR_STUDENT,
                    new SQLiteParameter("userID", userID),
                    new SQLiteParameter("courseID", courseID)
                ))
            {
                while (r1.Read())
                {
                    AssignmentSubmission submission = new(
                        r1.GetInt32(0),
                        r1.GetInt32(1),
                        r1.GetValue(2).ToString(),
                        r1.GetInt32(3),
                        r1.GetInt32(4)
                    );
                    submissions.Add(submission);
                }
            }

            foreach (AssignmentSubmission sub in submissions)
            {
                sub.Meta = GetEntryMeta(sub.ID);
            }

            return submissions;
        }



        public Dictionary<int, List<List<object>>> GetHistoricComparison(
            int courseID,
            string userID,
            long syncID = 0)
        {
            long activeSync = syncID == 0 ? this.GetCurrentSyncID(courseID) : syncID;
            if (activeSync == 0) return new Dictionary<int, List<List<object>>>();

            Dictionary<int, List<List<object>>> comparisson_history = new();

            using (SQLiteDataReader r1 = Query(DatabaseQueries.QUERY_GRADE_COMPARISSON_HISTORY,
                    new SQLiteParameter("courseID", courseID),
                    new SQLiteParameter("grade", GetUserGoalGrade(courseID, userID, syncID)),
                    new SQLiteParameter("userID", userID)
                ))
            {
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

                        DateTime labelDate = new DateTime(1970, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc);
                        labelDate = labelDate.AddMilliseconds(long.Parse(r1.GetValue(5).ToString()));
                        string label = String.Format("{0:dd/MM/yyyy}", labelDate); //sync_hash

                        // If this entry is different than the last, we add it
                        if (last_user_avg != user_avg || last_peer_avg != peer_avg
                            || last_peer_max != peer_max || last_peer_min != peer_min)
                        {

                            // If we have gone in a new tile, we create new pair
                            if (!comparisson_history.ContainsKey(tile_id))
                            {
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
                            else
                            {
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
                catch (Exception e)
                {
                    PrintQueryError("GetHistoricComparison", 3, r1, e);
                }
            }
            return comparisson_history;
        }

        public List<LearningGoal> GetGoals(int courseID)
        {
            List<LearningGoal> goals = new();

            using (SQLiteDataReader r = Query(DatabaseQueries.QUERY_LEARNING_GOALS,
                    new SQLiteParameter("courseID", courseID)
                ))
            {
                while (r.Read())
                {
                    try
                    {
                        goals.Add(new LearningGoal(
                            r.GetInt32(0),
                            r.GetInt32(1),
                            r.GetValue(2).ToString()
                        ));
                    }
                    catch (Exception e)
                    {
                        PrintQueryError("GetGoals", 2, r, e);
                    }
                }
            }

            return goals;
        }

        public List<LearningGoal> GetGoals(int courseID, int tileID)
        {
            List<LearningGoal> goals = new();
            using (SQLiteDataReader r = Query(DatabaseQueries.QUERY_TILE_LEARNING_GOALS,
                    new SQLiteParameter("tileID", tileID)
                ))
            {
                while (r.Read())
                {
                    try
                    {
                        goals.Add(new LearningGoal(r.GetInt32(0), tileID, r.GetValue(1).ToString()));
                    }
                    catch (Exception e)
                    {
                        PrintQueryError("GetGoals", 1, r, e);
                    }
                }
            }
            return goals;
        }

        public LearningGoal GetGoal(int courseID, int id)
        {
            LearningGoal goal = null;
            using (SQLiteDataReader r = Query(DatabaseQueries.QUERY_LEARNING_GOAL,
                    new SQLiteParameter("goalID", id)
                ))
            {
                if (r.Read())
                {
                    try
                    {
                        goal = new LearningGoal(id, r.GetInt32(0), r.GetValue(1).ToString());
                    }
                    catch (Exception e)
                    {
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
                    new SQLiteParameter("goalID", goal.ID),
                    new SQLiteParameter("tileID", goal.TileID),
                    new SQLiteParameter("title", goal.Title)
                );

            return GetGoal(courseID, goal.ID);
        }

        public void DeleteGoal(int courseID, LearningGoal goal)
        {

            goal.Requirements = GetGoalRequirements(goal.ID);

            DeleteGoalRequirements(goal.ID);
            goal.Requirements.Clear();

            NonQuery(DatabaseQueries.DELETE_LEARNING_GOAL,
                new SQLiteParameter("goalID", goal.ID)
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
            foreach (LearningGoal goal in goals)
            {
                DeleteGoal(courseID, goal);
            }
        }

        public void CreateGoalRequirement(
            int goalID,
            int assignmentID,
            int expresson,
            float value)
        {
            NonQuery(DatabaseQueries.REGISTER_GOAL_REQUIREMENT,
                new SQLiteParameter("goalID", goalID),
                new SQLiteParameter("assignmentID", assignmentID),
                new SQLiteParameter("expresson", expresson),
                new SQLiteParameter("value", value)
            );
        }

        public void UpdateGoalRequirement(GoalRequirement requirement)
        {
            NonQuery(DatabaseQueries.UPDATE_LEARNING_GOAL_REQUIREMENT,
                new SQLiteParameter("requirementID", requirement.ID),
                new SQLiteParameter("assignmentID", requirement.AssignmentID),
                new SQLiteParameter("expression", requirement.Expression),
                new SQLiteParameter("value", requirement.Value)
            );
        }
        public void DeleteGoalRequirements(int goalID)
        {
            NonQuery(DatabaseQueries.DELETE_GOAL_REQUIREMENTS,
                new SQLiteParameter("goalID", goalID)
            );
        }

        public void DeleteGoalRequirement(int requirementID)
        {
            NonQuery(DatabaseQueries.DELETE_GOAL_REQUIREMENT,
                new SQLiteParameter("requirementID", requirementID)
            );
        }
        public List<GoalRequirement> GetGoalRequirements(int goalID)
        {
            List<GoalRequirement> requirements = new();

            using (SQLiteDataReader r = Query(DatabaseQueries.QUERY_GOAL_REQUIREMENTS,
                    new SQLiteParameter("goalID", goalID)
                ))
            {
                while (r.Read())
                {
                    requirements.Add(new GoalRequirement(
                        r.GetInt32(0),
                        0,
                        r.GetInt32(1),
                        r.GetInt32(2),
                        r.GetInt32(3),
                        r.GetFloat(4)
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
            long syncID = 0)
        {
            long activeSync = syncID == 0 ? this.GetCurrentSyncID(courseID) : syncID;

            NonQuery(DatabaseQueries.REGISTER_USER_NOTIFICATIONS,
                new SQLiteParameter("userID", userID),
                new SQLiteParameter("tileID", tileID),
                new SQLiteParameter("status", status),
                new SQLiteParameter("syncID", activeSync)
            );
        }

        public List<Notification> GetAllNotifications(
            int courseID)
        {
            string activeSync = String.Join("', '", this.GetRecentSyncs(courseID, 2));

            // TODO: not sure how to write this as sqliteparameters
            string query = String.Format(
                DatabaseQueries.QUERY_ALL_NOTIFICATIONS,
                activeSync);

            List<Notification> notifications = new();

            using (SQLiteDataReader r = Query(query))
            {
                while (r.Read())
                {
                    try
                    {
                        notifications.Add(new Notification(
                            r.GetValue(0).ToString(),
                            r.GetInt32(1),
                            r.GetInt32(2),
                            r.GetBoolean(3)
                        ));
                    }
                    catch (Exception e)
                    {
                        PrintQueryError("GetAllNotifications", 3, r, e);
                    }
                }
            }

            return notifications;
        }

        public List<Notification> GetAllUserNotifications(
            int courseID,
            string userID,
            long syncID = 0)
        {
            long activeSync = syncID == 0 ? this.GetCurrentSyncID(courseID) : syncID;

            List<Notification> notifications = new();

            using (SQLiteDataReader r = Query(DatabaseQueries.QUERY_ALL_USER_NOTIFICATIONS,
                    new SQLiteParameter("courseID", courseID),
                    new SQLiteParameter("userID", userID),
                    new SQLiteParameter("syncID", activeSync)
                ))
            {
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
            long syncID = 0)
        {
            long activeSync = syncID == 0 ? this.GetCurrentSyncID(courseID) : syncID;

            List<Notification> notifications = new();

            using (SQLiteDataReader r = Query(DatabaseQueries.QUERY_PENDING_USER_NOTIFICATIONS,
                    new SQLiteParameter("courseID", courseID),
                    new SQLiteParameter("userID", userID),
                    new SQLiteParameter("syncID", activeSync)
                ))
            {
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

        public void MarkNotificationsSent(int courseID, string userID, long syncID = 0)
        {
            long activeSync = syncID == 0 ? this.GetCurrentSyncID(courseID) : syncID;

            NonQuery(DatabaseQueries.QUERY_MARK_NOTIFICATIONS_SENT,
                new SQLiteParameter("courseID", courseID),
                new SQLiteParameter("userID", userID),
                new SQLiteParameter("syncID", activeSync)
            );
        }

        public List<TileEntry> GetEntries(int courseID)
        {
            List<TileEntry> entries = new();

            using (SQLiteDataReader r = Query(DatabaseQueries.QUERY_ALL_TILE_ENTRIES,
                    new SQLiteParameter("courseID", courseID)
                ))
            {
                while (r.Read())
                {
                    try
                    {
                        entries.Add(new TileEntry(
                        0,
                        r.GetInt32(0),
                        r.GetInt32(1),
                        "This is another title",
                        r.GetFloat(2)
                    ));
                    }
                    catch (Exception e)
                    {
                        PrintQueryError("GetEntries", 3, r, e);
                    }
                }
            }

            return entries;
        }

        public void CreateTileEntry(TileEntry entry)
        {
            NonQuery(DatabaseQueries.REGISTER_TILE_ENTRY,
                new SQLiteParameter("tileID", entry.TileID),
                new SQLiteParameter("content_id", entry.ContentID),
                new SQLiteParameter("weight", entry.Weight)
            );
        }

        public void DeleteTileEntry(int entryID)
        {
            NonQuery(DatabaseQueries.DELETE_TILE_ENTRY,
                new SQLiteParameter("entryID", entryID)
            );
        }

        /////////////////////////////////////////////////////////////////////////////////
        //////////////////////////         ACCEPT LIST         //////////////////////////
        /////////////////////////////////////////////////////////////////////////////////


        // public void RegisterAcceptedStudent(
        //     int courseID,
        //     string studentID,
        //     bool accepted)
        // {
        //     NonQuery(DatabaseQueries.REGISTER_ACCEPTED_STUDENT,
        //         new SQLiteParameter("courseID", courseID),
        //         new SQLiteParameter("studentID", studentID),
        //         new SQLiteParameter("accepted", accepted)
        //     );
        // }

        // public void ResetAcceptList(int courseID)
        // {
        //     NonQuery(DatabaseQueries.RESET_ACCEPT_LIST,
        //         new SQLiteParameter("courseID", courseID)
        //     );
        // }

        // public void SetAcceptListRequired(int courseID, bool enabled)
        // {
        //     NonQuery(DatabaseQueries.REQUIRE_ACCEPT_LIST,
        //         new SQLiteParameter("courseID", courseID),
        //         new SQLiteParameter("enabled", enabled)
        //     );
        // }

        // public List<AcceptList> GetAcceptList(int courseID)
        // {
        //     List<AcceptList> keys = new();

        //     using (SQLiteDataReader r = Query(DatabaseQueries.QUERY_ACCEPT_LIST,
        //             new SQLiteParameter("courseID", courseID)
        //         )) {
        //         while (r.Read())
        //         {
        //             keys.Add(
        //                 new AcceptList(
        //                     r.GetValue(0).ToString(),
        //                     r.GetBoolean(1)
        //                 ));
        //         }
        //     }

        //     return keys;
        // }

        /////////////////////////////////////////////////////////////////////////////////
        //////////////////////////         END OF LIST         //////////////////////////
        /////////////////////////////////////////////////////////////////////////////////

        public List<string> GetEntryMetaKeys(int submissionID)
        {
            List<string> keys = new();

            using (SQLiteDataReader r = Query(DatabaseQueries.QUERY_TILE_ENTRY_META_KEYS,
                    new SQLiteParameter("submissionID", submissionID)
                ))
            {
                while (r.Read())
                {
                    keys.Add(r.GetValue(0).ToString());
                }
            }
            return keys;
        }

        public Dictionary<string, string> GetEntryMeta(int submissionID)
        {
            Dictionary<string, string> meta = new();

            using (SQLiteDataReader r = Query(DatabaseQueries.QUERY_TILE_ENTRY_SUBMISSION_META,
                    new SQLiteParameter("submissionID", submissionID)
                ))
            {
                while (r.Read())
                {
                    try
                    {
                        meta.Add(r.GetValue(0).ToString(), r.GetValue(1).ToString());
                    }
                    catch (Exception e)
                    {
                        PrintQueryError("GetSubmissionMeta", 1, r, e);
                    }
                }
            }
            return meta;
        }

        public void UpdateTile(Tile tile)
        {

            NonQuery(DatabaseQueries.UPDATE_TILE,
                new SQLiteParameter("tileID", tile.ID),
                new SQLiteParameter("groupID", tile.GroupID),
                new SQLiteParameter("title", tile.Title),
                new SQLiteParameter("order", tile.Order),
                new SQLiteParameter("type", (int)tile.Type),
                new SQLiteParameter("weight", tile.Weight),
                new SQLiteParameter("gradingType", (int)tile.GradingType),
                new SQLiteParameter("visible", tile.Visible),
                new SQLiteParameter("notifications", tile.Notifications)
            );
        }

        public void UpdateTileOrder(
            int[] tileIDs)
        {

            for (int i = 0; i < tileIDs.Length; i++)
            {
                NonQuery(DatabaseQueries.UPDATE_TILE_ORDER,
                    new SQLiteParameter("tileID", tileIDs[i]),
                    new SQLiteParameter("order", i)
                );
            }
        }

        public List<Tile> GetTiles(int courseID, bool autoLoadEntries = false)
        {
            List<Tile> tiles = new();

            using (SQLiteDataReader r = Query(DatabaseQueries.QUERY_TILES,
                    new SQLiteParameter("courseID", courseID)
                ))
            {
                while (r.Read())
                {
                    try
                    {
                        Tile row = new(
                            r.GetInt32(0),
                            r.GetInt32(1),
                            r.GetValue(2).ToString(),
                            r.GetInt32(3),
                            (Tile.Tile_type)r.GetInt32(4),
                            r.GetFloat(5),
                            (UvA.DataNose.Connectors.Canvas.GradingType)r.GetInt32(6),
                            r.GetBoolean(7),
                            r.GetBoolean(8)
                        );
                        tiles.Add(row);
                    }
                    catch (Exception e)
                    {
                        PrintQueryError("GetTiles", 9, r, e);
                    }
                }
            }

            foreach (Tile t in tiles)
            {
                if (autoLoadEntries)
                    t.Entries = GetTileEntries(t.ID);
            }

            return tiles;
        }

        // public Tile FillTileContent(Tile tile)
        // {
        //     switch(tile.Type)
        //     {
        //         case Tile_type.assignments:
        //             using (SQLiteDataReader r = Query(DatabaseQueries.QUERY_COURSE_ASSIGNMENTS,
        //                 new SQLiteParameter("tileID", courseID)))
        //             {
        //                 while (r.Read())
        //                 {
        //                     try
        //                     {

        //                     }
        //                     catch (Exception e)
        //                     {
        //                         PrintQueryError("FillTileContent", 9, r, e);
        //                     }
        //                 }
        //             }
        //         break;
        //         case Tile_type.discussions:
        //         break;
        //         case Tile_type.learning_outcomes:
        //         break;
        //     }

        //     return tile;
        // }

        public void CreateLayoutTileGroup(
            int courseID,
            string title,
            int position)
        {
            // List<LayoutColumn> cols = this.GetLayoutColumns(courseID);
            // if (cols.Count < 1) return;

            NonQuery(DatabaseQueries.REGISTER_TILE_GROUP,
                // new SQLiteParameter("columnID", cols[0].ID),
                new SQLiteParameter("title", title),
                new SQLiteParameter("order", position),
                new SQLiteParameter("courseID", courseID)

            );
        }

        public LayoutTileGroup UpdateTileGroup(
            int courseID,
            int tileGroupID,
            int columnID,
            string title,
            int order)
        {
            NonQuery(DatabaseQueries.UPDATE_TILE_GROUP,
                new SQLiteParameter("columnID", columnID),
                new SQLiteParameter("title", title),
                new SQLiteParameter("order", order),
                new SQLiteParameter("groupID", tileGroupID)
            );

            return GetLayoutTileGroup(courseID, tileGroupID);
        }

        public void UpdateTileGroupOrder(
            int[] tileGroupIDs)
        {
            for (int i = 0; i < tileGroupIDs.Length; i++)
            {
                NonQuery(DatabaseQueries.UPDATE_TILE_GROUP_ORDER,
                    new SQLiteParameter("groupID", tileGroupIDs[i]),
                    new SQLiteParameter("order", i)
                );
            }
        }

        public void DeleteLayoutTileGroup(int groupID)
        {
            NonQuery(DatabaseQueries.DELETE_TILE_GROUP,
                new SQLiteParameter("groupID", groupID)
            );
        }

        public LayoutTileGroup GetLayoutTileGroup(int courseID, int groupID)
        {
            using (SQLiteDataReader r = Query(DatabaseQueries.QUERY_TILE_GROUP,
                    new SQLiteParameter("courseID", courseID),
                    new SQLiteParameter("groupID", groupID)
                ))
            {
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

            using (SQLiteDataReader r = Query(DatabaseQueries.QUERY_TILE_GROUPS,
                    new SQLiteParameter("courseID", courseID)
                ))
            {
                while (r.Read())
                {
                    try
                    {
                        LayoutTileGroup row = new(
                        r.GetInt32(0),
                        courseID,
                        r.GetValue(1).ToString(),
                        r.GetInt32(2),
                        r.GetInt32(3)
                    );
                        tileGroups.Add(row);
                    }
                    catch (Exception e)
                    {
                        PrintQueryError("GetLayoutTileGroups", 3, r, e);
                    }
                }
            }

            return tileGroups;
        }

        public Dictionary<int, AppAssignment> GetAssignmentsMap(int courseID)
        {

            Dictionary<int, AppAssignment> assignments = new();

            using (SQLiteDataReader r = Query(DatabaseQueries.QUERY_COURSE_ASSIGNMENTS,
                    new SQLiteParameter("courseID", courseID)
                ))
            {
                while (r.Read())
                {
                    try
                    {
                        AppAssignment row = new(
                            r.GetInt32(0),
                            r.GetInt32(1),
                            r.GetValue(2).ToString(),
                            r.GetBoolean(3),
                            r.GetBoolean(4),
                            r.GetInt32(5),
                            r.GetFloat(6),
                            r.GetInt32(7)
                        );
                        assignments.Add(r.GetInt32(0), row);
                    }
                    catch (Exception e)
                    {
                        PrintQueryError("GetAssignments", 9, r, e);
                    }
                }
            }

            return assignments;
        }

        public List<AppDiscussion> GetDiscussions(int courseID)
        {
            List<AppDiscussion> discussions = new();


            using (SQLiteDataReader r = Query(DatabaseQueries.QUERY_COURSE_DISCUSSIONS,
                    new SQLiteParameter("courseID", courseID)
                ))
            {
                while (r.Read())
                {
                    AppDiscussion row = new(
                        Discussion_type.Topic,
                        r.GetInt32(0),
                        -1,
                        courseID,
                        r.GetValue(1).ToString(),
                        r.GetValue(2).ToString(),
                        r.GetInt32(3),
                        r.GetValue(4).ToString()
                    );
                    discussions.Add(row);
                }
            }

            return discussions;
        }

        public List<AppDiscussion> GetDiscussionsForTile(
            int tileID)
        {

            List<AppDiscussion> discussions = new();

            using (SQLiteDataReader r = Query(DatabaseQueries.QUERY_TILE_DISCUSSIONS,
                    new SQLiteParameter("tileID", tileID)
                ))
            {
                while (r.Read())
                {
                    AppDiscussion row = new(
                        Discussion_type.Topic,
                        r.GetInt32(0),
                        tileID,
                        r.GetInt32(1),
                        r.GetValue(2).ToString(),
                        r.GetValue(3).ToString(),
                        r.GetInt32(4),
                        r.GetValue(5).ToString()
                    );
                    discussions.Add(row);
                }
            }

            return discussions;
        }

        public List<AppDiscussion> GetDiscussionEntries(int discussionID)
        {

            List<AppDiscussion> entries = new();
            using (SQLiteDataReader r = Query(DatabaseQueries.QUERY_DISCUSSION_ENTRIES,
                    new SQLiteParameter("discussionID", discussionID)
                ))
            {
                while (r.Read())
                {
                    AppDiscussion row = new(
                        Discussion_type.Entry,
                        r.GetInt32(0),
                        discussionID,
                        r.GetInt32(5),
                        r.GetValue(4).ToString(),
                        r.GetValue(1).ToString(),
                        r.GetInt32(2),
                        r.GetValue(3).ToString()
                    );
                    entries.Add(row);
                }
            }
            return entries;
        }

        public List<AppDiscussion> GetDiscussionEntries(int discussion_id, string user_id)
        {

            List<AppDiscussion> entries = new();
            using (SQLiteDataReader r = Query(DatabaseQueries.QUERY_DISCUSSION_ENTRIES_FOR_USER,
                    new SQLiteParameter("discussionID", discussion_id),
                    new SQLiteParameter("userID", user_id)
                ))
            {
                while (r.Read())
                {
                    AppDiscussion row = new(
                        Discussion_type.Entry,
                        r.GetInt32(0),
                        discussion_id,
                        r.GetInt32(5),
                        r.GetValue(4).ToString(),
                        r.GetValue(1).ToString(),
                        r.GetInt32(2),
                        r.GetValue(3).ToString()
                    );
                    entries.Add(row);
                }
            }
            return entries;
        }


        public List<AppDiscussion> GetDiscussionReplies(int discussion_id)
        {

            List<AppDiscussion> entries = new();
            using (SQLiteDataReader r = Query(DatabaseQueries.QUERY_DISCUSSION_REPLIES,
                    new SQLiteParameter("discussionID", discussion_id)
                ))
            {
                while (r.Read())
                {
                    AppDiscussion row = new(
                        Discussion_type.Reply,
                        r.GetInt32(0),
                        discussion_id,
                        r.GetInt32(5),
                        r.GetValue(4).ToString(),
                        r.GetValue(1).ToString(),
                        r.GetInt32(2),
                        r.GetValue(3).ToString()
                    );
                    entries.Add(row);
                }
            }
            return entries;
        }

        public List<AppDiscussion> GetDiscussionReplies(int discussion_id, string user_id)
        {
            List<AppDiscussion> entries = new();
            using (SQLiteDataReader r = Query(DatabaseQueries.QUERY_DISCUSSION_REPLIES_FOR_USER,
                    new SQLiteParameter("discussionID", discussion_id),
                    new SQLiteParameter("userID", user_id)
                ))
            {
                while (r.Read())
                {
                    AppDiscussion row = new(
                        Discussion_type.Reply,
                        r.GetInt32(0),
                        discussion_id,
                        r.GetInt32(5),
                        r.GetValue(4).ToString(),
                        r.GetValue(1).ToString(),
                        r.GetInt32(2),
                        r.GetValue(3).ToString()
                    );
                    entries.Add(row);
                }
            }
            return entries;
        }


        public List<LayoutColumn> GetLayoutColumns(int courseID)
        {
            List<LayoutColumn> layoutList = new List<LayoutColumn>();

            using (SQLiteDataReader r2 = Query(DatabaseQueries.QUERY_LAYOUT_COLUMNS,
                new SQLiteParameter("courseID", courseID)
                ))
            {
                while (r2.Read())
                {
                    try
                    {
                        layoutList.Add(new LayoutColumn(
                            r2.GetInt32(0),
                            r2.GetInt32(1),
                            r2.GetInt32(2),
                            new List<int>()
                        ));
                    }
                    catch (Exception e)
                    {
                        PrintQueryError("GetLayoutColumn", 2, r2, e);
                    }
                }
            }

            foreach (LayoutColumn lcolumn in layoutList)
                using (SQLiteDataReader r = Query(DatabaseQueries.QUERY_ALL_TILE_GROUPS_IN_LAYOUT_COLUMN,
                    new SQLiteParameter("columnID", lcolumn.ID)
                    ))
                {
                    while (r.Read())
                    {
                        try
                        {
                            lcolumn.TileGroups.Add(r.GetInt32(0));
                        }
                        catch (Exception e)
                        {
                            PrintQueryError("GetLayoutColumn", 2, r, e);
                        }

                    }
                }
            return layoutList;

        }


        public void DeleteAllLayoutColumns(
            int courseID
        )
        {
            NonQuery(DatabaseQueries.RELEASE_ALL_COURSE_TILE_GROUPS_FROM_COLUMNS,
                new SQLiteParameter("courseID", courseID)
            );
            NonQuery(DatabaseQueries.DELETE_ALL_LAYOUT_COLUMNS,
                new SQLiteParameter("courseID", courseID)
            );
        }


        public void CreateLayoutColumns(List<LayoutColumn> layoutColumns, int courseID)
        {
            foreach (LayoutColumn column in layoutColumns)
            {
                int id = IDNonQuery(DatabaseQueries.REGISTER_LAYOUT_COLUMN,
                    new SQLiteParameter("courseID", courseID),
                    new SQLiteParameter("size", column.Width),
                    new SQLiteParameter("order", column.Position));

                if (column.TileGroups != null)
                    foreach (int groupID in column.TileGroups)
                    {
                        NonQuery(DatabaseQueries.TIE_TILE_GROUP_TO_COLUMN,
                        new SQLiteParameter("columnID", id),
                        new SQLiteParameter("groupID", groupID));
                    }
            }
        }

        public Tile GetTile(int courseID, int tileID)
        {
            using (SQLiteDataReader r = Query(DatabaseQueries.QUERY_TILE,
                    new SQLiteParameter("courseID", courseID),
                    new SQLiteParameter("tileID", tileID)
                ))
            {
                if (r.Read())
                    return new Tile(
                        r.GetInt32(0),
                        r.GetInt32(1),
                        r.GetValue(2).ToString(),
                        r.GetInt32(3),
                        (Tile.Tile_type)r.GetInt32(4),
                        r.GetFloat(5),
                        (UvA.DataNose.Connectors.Canvas.GradingType)r.GetInt32(6),
                        r.GetBoolean(7),
                        r.GetBoolean(8)
                    );
            }

            return null;
        }

        public void CreateTile(
            int courseID,
            int groupID,
            string title,
            int order,
            int type,
            float weight,
            int gradingType,
            bool visible,
            bool notifications)
        {
            int id = IDNonQuery(DatabaseQueries.REGISTER_TILE,
                new SQLiteParameter("groupID", groupID),
                new SQLiteParameter("title", title),
                new SQLiteParameter("order", order),
                new SQLiteParameter("type", type),
                new SQLiteParameter("weight", weight),
                new SQLiteParameter("gradingType", gradingType),
                new SQLiteParameter("visible", visible),
                new SQLiteParameter("notifications", notifications)
            );
        }

        public List<TileEntry> GetTileEntries(int tileID)
        {

            List<TileEntry> entries = new();

            using (SQLiteDataReader r = Query(DatabaseQueries.QUERY_ENTRIES_FOR_TILE,
                    new SQLiteParameter("tileID", tileID)
                ))
            {
                while (r.Read())
                {
                    entries.Add(new TileEntry(
                        0,
                        r.GetInt32(0),
                        r.GetInt32(1),
                        r.GetValue(2).ToString(),
                        r.GetFloat(3)
                    ));
                }
            }

            return entries;
        }

        public void DeleteTile(int courseID, int tileID)
        {
            DeleteGoals(courseID, tileID);
            NonQuery(DatabaseQueries.DELETE_TILE,
                new SQLiteParameter("tileID", tileID)
            );
        }

        public void SetUserConsent(ConsentData data, long syncID)
        {
            switch (data.Granted)
            {
                case 0: //denied
                        //TODO: delete everything???



                    break;


                case -1: //unspecified
                case 1: // or granted
                    using (SQLiteDataReader r = Query(DatabaseQueries.QUERY_LAST_STUDENT_SETTINGS,
                        new SQLiteParameter("courseID", data.CourseID),
                        new SQLiteParameter("userID", data.UserID)))
                        while (r.Read())
                            NonQuery(DatabaseQueries.REGISTER_STUDENT_SETTINGS,
                                new SQLiteParameter("courseID", data.CourseID),
                                new SQLiteParameter("userID", data.UserID),
                                new SQLiteParameter("PredictedGrade", long.Parse(r.GetValue(0).ToString())),
                                new SQLiteParameter("GoalGrade", r.GetInt32(1)),
                                new SQLiteParameter("Consent", data.Granted), ///TODOOOOOOOOO: make boolean
                                new SQLiteParameter("Notifications", r.GetBoolean(3)),
                                new SQLiteParameter("syncID", syncID)
                            );
                    break;
            }
        }

        public bool GetUserConsent(int courseID, string userID)
        {
            using (SQLiteDataReader r = Query(DatabaseQueries.QUERY_CONSENT_FOR_USER,
                    new SQLiteParameter("courseID", courseID),
                    new SQLiteParameter("userID", userID)
                ))
            {
                if (r.Read())
                    return r.GetInt32(0) == 1;
            }
            return false;
        }

        // public ConsentData[] GetGrantedConsents(int courseID, long syncID)
        // {
        //     List<ConsentData> consents = new();
        //     using(SQLiteDataReader r = Query(DatabaseQueries.QUERY_GRANTED_CONSENTS,
        //             new SQLiteParameter("courseID", courseID),
        //             new SQLiteParameter("syncID", syncID)
        //         )) {
        //         while (r.Read())
        //         {
        //             consents.Add(new ConsentData(courseID, r.GetValue(0).ToString(), 1));
        //         }
        //     }
        //     return consents.ToArray();
        // }

        // public ConsentData[] GetConsents(int courseID, long syncID)
        // {
        //     List<ConsentData> consents = new();

        //     using(SQLiteDataReader r = Query(DatabaseQueries.QUERY_CONSENTS,
        //             new SQLiteParameter("courseID", courseID),
        //             new SQLiteParameter("syncID", syncID)
        //         )) {
        //         while (r.Read())
        //         {
        //             try {
        //                 consents.Add(new ConsentData(courseID, r.GetValue(0).ToString(), r.GetInt32(1)));
        //             } catch ( Exception e) {
        //                 PrintQueryError("GetConsents", 3, r, e);
        //             }
        //         }
        //     }

        //     return consents.ToArray();
        // }

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

            using (SQLiteDataReader r = Query(DatabaseQueries.QUERY_EXTERNALDATA,
                    new SQLiteParameter("courseID", courseID),
                    new SQLiteParameter("tileID", tileID == -1 ? '*' : tileID),
                    new SQLiteParameter("userID", userID == null ? '*' : userID)
                ))
            {
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
        )
        {
            NonQuery(DatabaseQueries.INSERT_USER_ACTION,
                new SQLiteParameter("userID", userID),
                new SQLiteParameter("action", action)
            );
        }

    }
}
