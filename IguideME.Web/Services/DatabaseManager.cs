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

namespace IguideME.Web.Services
{
    public sealed class DatabaseManager
    {
        private static DatabaseManager instance;
        private readonly string _connection_string;
        private readonly ILogger _logger;

        DatabaseManager(bool isDev = false) {
            DatabaseManager.instance = this;
            _connection_string = isDev ? "Data Source=db.sqlite;Version=3;New=False;Compress=True;"
                                      : "Data Source=/data/IguideME.db;Version=3;New=False;Compress=True;";

            DatabaseManager.instance.CreateTables();
            DatabaseManager.instance.RunMigrations();
            ILoggerFactory factory = LoggerFactory.Create(builder => builder.AddConsole());
            _logger = factory.CreateLogger("DatabaseManager");
        }

        public static void Initialize(bool isDev = false)
        {
            new DatabaseManager(isDev);
        }

        public static DatabaseManager Instance
        {
            get { return instance; }
        }

        private SQLiteConnection GetConnection() => new SQLiteConnection(_connection_string);

        private void NonQuery(string query)
        {
            SQLiteConnection connection = GetConnection();
            try {
                connection.Open();
                using(SQLiteCommand command = connection.CreateCommand())
                {
                    command.CommandText = query;
                    command.ExecuteNonQuery();
                }
                connection.Close();
            } catch {
                // Close connection before rethrowing
                connection.Close();
                throw;
            }
        }

        private int IDNonQuery(string query)
        {
            int id = 0;
            SQLiteConnection connection = GetConnection();
            try {
                connection.Open();
                using(SQLiteCommand command = connection.CreateCommand())
                {
                    command.CommandText = query;
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

        private SQLiteDataReader Query(string query)
        {
            SQLiteConnection connection = GetConnection();
            try {
                connection.Open();
                using(SQLiteCommand command = connection.CreateCommand())
                {
                    command.CommandText = query;
                    return command.ExecuteReader(CommandBehavior.CloseConnection);
                }
            } catch (Exception e) {
                // Close connection before rethrowing
                _logger.LogError(e.Message + e.StackTrace);
                connection.Close();
                throw;
            }
        }

        private void PrintQueryError(string title, int rows, SQLiteDataReader r, Exception e) {
            string error = $"{title}\nRequested:\nColumn | Data Type | Value | Type\n";

            try {
                for (int i = 0; i <= rows; i++)
                    error += $"{r.GetName(i)} {r.GetDataTypeName(i)} {r.GetValue(i)} {r.GetValue(i).GetType()}\n";

                _logger.LogError( error + e.Message + e.StackTrace);
            } catch (Exception ex) {
                _logger.LogError($"{ex.Message} {ex.StackTrace}\n\nOriginal error:\n{e.Message} {e.StackTrace}");
            }
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
                DatabaseQueries.CREATE_TABLE_PEER_GROUP2,
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
                using (SQLiteDataReader r = Query(String.Format(DatabaseQueries.QUERY_MIGRATIONS, migration_id)))
                    if (r.HasRows)
                        continue;

                Console.WriteLine("Migration " + migration_id + " not yet applied, proceeding to apply...");

                string migration_sql = entry.Value;
                NonQuery(migration_sql);
                NonQuery(String.Format(DatabaseQueries.REGISTER_MIGRATION, migration_id));
            }
        }

        private string GetCurrentHash(int courseID)
        {
            /**
             * Retrieve latest complete synchronization for course. If no
             * historic synchronization was found then null is returned.
             */
            string query = String.Format(DatabaseQueries.QUERY_LATEST_SYNCS_FOR_COURSE, courseID, 1);
            string result = null;
            using (SQLiteDataReader r = Query(query))
                if (r.Read())
                    result = r.GetValue(0).ToString();

            return result;
        }

        private List<string> GetRecentHashes(int courseID, int number_of_hashes)
        {
            /**
             * Retrieve latest n complete synchronizations for course. If no
             * historic synchronization was found then null is returned.
             */

            string query = String.Format(DatabaseQueries.QUERY_LATEST_SYNCS_FOR_COURSE, courseID, number_of_hashes);
            List<string> hashes = new List<string>();

            using (SQLiteDataReader r = Query(query))
                while (r.Read()) {
                    hashes.Add(r.GetValue(0).ToString());
                }

            return hashes;
        }

        public void CleanupSync(int courseID) {
            RemoveSyncsWithStatus(courseID, "BUSY");

            string query = String.Format(DatabaseQueries.QUERY_OLD_HASHES_FOR_COURSE, courseID, 15);
            string query2;
            List<string> hashes = new List<string>();

            using (SQLiteDataReader r = Query(query)) {
                while (r.Read()) {
                    try {
                        hashes.Add(r.GetValue(0).ToString());
                    } catch (Exception e) {
                        _logger.LogError($"Unable to get old sync: {r.GetValue(0)}\n" + e.Message + e.StackTrace);
                    }
                }
            }
            foreach (string hash in hashes) {
                query2 = String.Format(DatabaseQueries.DELETE_OLD_SYNCS_FOR_COURSE, courseID, hash);
                NonQuery(query2);
            }
        }

        public bool IsCourseRegistered(int courseID)
        {
            bool result;
            using (SQLiteDataReader r = Query(
                String.Format(
                    DatabaseQueries.QUERY_DOES_COURSE_EXIST, courseID)))
                result = (bool)r.Read();

            return result;
        }

        public void RegisterCourse(int courseID, string courseName)
        {
            /**
             * Create a new course.
             */
            NonQuery(String.Format(DatabaseQueries.REGISTER_COURSE,
                courseID,
                courseName));
        }

        public List<int> GetCourseIds()
        {
            List<int> course_ids = new List<int>();
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
                    String.Format(
                        DatabaseQueries.DELETE_INCOMPLETE_SYNCS, courseID, status
                    )
                );
            } catch (Exception e) {
                _logger.LogError(e.ToString() + "\n" + e.StackTrace);
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
                String.Format(
                    DatabaseQueries.REGISTER_NEW_SYNC, courseID, hashCode));
        }

        public void CompleteSync(string hashCode)
        {
            /**
             * Update synchronization record state to completed.
             */
            NonQuery(
                String.Format(
                    DatabaseQueries.COMPLETE_NEW_SYNC, hashCode));
        }

        public List<DataSynchronization> GetSyncHashes(int courseID)
        {
            /**
             * Return all synchronization records for a course.
             */
            List<DataSynchronization> hashes = new List<DataSynchronization>();

            using (SQLiteDataReader r = Query(String.Format(
                    DatabaseQueries.QUERY_SYNC_HASHES_FOR_COURSE, courseID))) {
                while (r.Read()) {
                    try {
                        DateTime endtime = r.GetValue(3).GetType() != typeof(DBNull) ? (r.GetDateTime(3)) : new DateTime();

                        hashes.Add(new DataSynchronization(
                            r.GetInt32(0),
                            r.GetInt32(1),
                            r.GetDateTime(2),
                            endtime,
                            r.GetValue(4).ToString(),
                            r.GetValue(5).ToString()));
                    } catch (Exception e) {
                        PrintQueryError("GetSyncHashes", 5, r, e);
                    }
                }
            }

            return hashes;
        }

        public int GetMinimumPeerGroupSize(int courseID)
        {
            // TODO: what's the plan here?
            return 1;
        }

        public bool HasPersonalizedPeers(int courseID)
        {
            // TODO: what's the plan here?
            return true;
        }

        public void RegisterUser(
            int courseID,
            int? id,
            string loginID,
            string sisID,
            string name,
            string sortableName,
            string role,
            string syncHash)
        {
            NonQuery(
                String.Format(
                    DatabaseQueries.REGISTER_USER_FOR_COURSE,
                    courseID, id, loginID, sisID, name, sortableName, role, syncHash
                    ));
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
                String.Format(
                    DatabaseQueries.REGISTER_CANVAS_ASSIGNMENT,
                    assignmentID.ToString(),
                    courseID,
                    name,
                    published,
                    muted,
                    dueDate,
                    pointsPossible,
                    position,
                    gradingType,
                    submissionType,
                    syncHash));
        }

        public void RegisterDiscussion(Discussion discussion, string syncHash)
        {
            IDNonQuery(
                String.Format(
                    DatabaseQueries.REGISTER_CANVAS_DISCUSSION,
                    discussion.ID,
                    discussion.CourseID,
                    discussion.Title,
                    discussion.UserName,
                    discussion.PostedAt,
                    discussion.Message.Replace("'", "''"),
                    syncHash));
        }

        public void UpdateDiscussion(Discussion discussion, int tileID, string hash) {
            NonQuery(
                String.Format(
                    DatabaseQueries.UPDATE_CANVAS_DISCUSSION,
                    discussion.ID,
                    discussion.CourseID,
                    discussion.Title,
                    discussion.UserName,
                    discussion.PostedAt,
                    discussion.Message.Replace("'", "''"),
                    tileID,
                    hash
                )
            );
        }

        public int RegisterDiscussionEntry(DiscussionEntry entry, string syncHash)
        {
            NonQuery(
                String.Format(
                    DatabaseQueries.REGISTER_CANVAS_DISCUSSION_ENTRY,
                    entry.CourseID,
                    entry.TopicID,
                    entry.UserID,
    				entry.CreatedAt,
                    entry.Message.Replace("'", "''")));

            using (SQLiteDataReader r = Query($@"SELECT `id` FROM `canvas_discussion_entry`
                        WHERE  `course_id`={entry.CourseID}
                        AND    `discussion_id`={entry.TopicID}
                        AND    `posted_by`='{entry.UserID}'
                        AND    `posted_at`='{entry.CreatedAt}';")) {
                if (r.Read()) {
                    return r.GetInt32(0);
                } else {
                    return -1;
                }
            }
        }

        public void RegisterDiscussionReply(DiscussionReply reply, int entry_id, string syncHash)
        {
            if (entry_id == -1) {
                return;
            }

            NonQuery(
                String.Format(
                    DatabaseQueries.REGISTER_CANVAS_DISCUSSION_REPLY,
                    entry_id,
                    reply.UserID,
    				reply.CreatedAt,
                    reply.Message.Replace("'", "''")));
        }

        public List<User> GetUsers(int courseID, string role = null, string hash = null)
        {
            string activeHash = hash ?? this.GetCurrentHash(courseID);
            if (activeHash == null)
            {
                Console.WriteLine("Hash is null, returning empty user list.");
                return new List<User>() { };
            }

            string query = role == null ?
                String.Format(DatabaseQueries.QUERY_USERS_FOR_COURSE,
                    courseID,
                    activeHash) :
                String.Format(DatabaseQueries.QUERY_USERS_WITH_ROLE_FOR_COURSE,
                    courseID,
                    role,
                    activeHash);

            List<User> users = new List<User>();

            using (SQLiteDataReader r = Query(query)) {
                // collect all users
                while (r.Read())
                {
                    User user = new User(
                        r.GetInt32(0),
                        courseID,
                        r.GetInt32(1),
                        r.GetValue(2).ToString(),
                        r.GetValue(3).ToString(),
                        r.GetValue(4).ToString(),
                        r.GetValue(5).ToString(),
                        r.GetValue(6).ToString()
                    );
                    users.Add(user);
                }
            }

            return users;
        }

        public User GetUser(int courseID, string userLoginID, string hash = null)
        {
            string activeHash = hash ?? this.GetCurrentHash(courseID);
            if (activeHash == null) return null;

            string query = String.Format(
                DatabaseQueries.QUERY_USER_FOR_COURSE,
                courseID,
                userLoginID,
                activeHash);

            User user = null;
            using (SQLiteDataReader r = Query(query)) {
                if (r.Read())
                {
                    user = new User(
                        r.GetInt32(0),
                        courseID,
                        r.GetInt32(1),
                        r.GetValue(2).ToString(),
                        r.GetValue(3).ToString(),
                        r.GetValue(4).ToString(),
                        r.GetValue(5).ToString(),
                        r.GetValue(6).ToString()
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
            if (activeHash == null) new List<User> { };

            string query = String.Format(
                DatabaseQueries.QUERY_USERS_WITH_GOAL_GRADE,
                courseID,
                activeHash,
                goalGrade);

            List<User> users = new List<User>();

            using(SQLiteDataReader r = Query(query)) {
                // collect all users
                while (r.Read())
                {
                    User user = new User(
                        r.GetInt32(0),
                        courseID,
                        r.GetInt32(1),
                        r.GetValue(2).ToString(),
                        r.GetValue(3).ToString(),
                        r.GetValue(4).ToString(),
                        r.GetValue(5).ToString(),
                        r.GetValue(6).ToString()
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
                String.Format(
                    DatabaseQueries.REGISTER_GRADE_PREDICTION_MODEL,
                    courseID,
                    intercept
                ));
        }

        public int CreateGradePredictionModelParameter(int modelID, int parameterID, float weight)
        {
            return IDNonQuery(
                String.Format(
                    DatabaseQueries.REGISTER_GRADE_PREDICTION_MODEL_PARAMETER,
                    modelID,
                    parameterID,
                    weight
                ));
        }

        public List<GradePredictionModel> GetGradePredictionModels(int courseID)
        {

            string query = String.Format(
                                   DatabaseQueries.QUERY_GRADE_PREDICTION_MODELS_FOR_COURSE,
                                   courseID);

            List<GradePredictionModel> models = new List<GradePredictionModel>();
            GradePredictionModel model;

            using(SQLiteDataReader r = Query(query)) {
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
            string query = String.Format(
                                   DatabaseQueries.QUERY_GRADE_PREDICTION_MODEL_FOR_COURSE,
                                   courseID);

            GradePredictionModel model = null;

            using(SQLiteDataReader r = Query(query)) {
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
            string query = String.Format(
                                   DatabaseQueries.QUERY_GRADE_PREDICTION_MODEL_PARAMETERS_FOR_MODEL,
                                   modelID);

            List<GradePredictionModelParameter> parameters = new List<GradePredictionModelParameter>();

            using(SQLiteDataReader r = Query(query)) {
                while (r.Read())
                {
                    GradePredictionModelParameter parameter = new GradePredictionModelParameter(
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
            string userLoginID,
            float grade)
        {
            try {
                NonQuery(
                    String.Format(
                        DatabaseQueries.REGISTER_PREDICTED_GRADE,
                        courseID,
                        userLoginID,
                        grade
                    ));
            } catch (Exception e) {
                _logger.LogError(e.Message + e.StackTrace);
            }
        }

        public void RegisterUserSettings(ConsentData data)
        {
             NonQuery(String.Format(
                DatabaseQueries.REGISTER_USER_SETTINGS,
                data.CourseID, data.UserID, data.UserLoginID, data.UserName.Replace("'", ""), data.Granted
            ));
        }

        public void UpdateNotificationEnable(int courseID, string loginID, bool enable)
        {
            NonQuery(
                String.Format(
                    DatabaseQueries.UPDATE_NOTIFICATION_ENABLE,
                    enable,
                    courseID,
                    loginID));
        }

        public bool GetNotificationEnable(int courseID, string loginID)
        {
            string query = String.Format(
                DatabaseQueries.QUERY_NOTIFICATIONS_ENABLE,
                courseID,
                loginID);

            bool result = true;
            using(SQLiteDataReader r = Query(query)) {
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

        public void UpdateUserGoalGrade(int courseID, string loginID, int grade)
        {
            NonQuery(
                String.Format(
                    DatabaseQueries.UPDATE_USER_GOAL_GRADE,
                    grade,
                    courseID,
                    loginID));
        }

        public int GetUserGoalGrade(int courseID, string loginID)
        {
            string query = String.Format(
                DatabaseQueries.QUERY_USER_GOAL_GRADE,
                courseID,
                loginID);

            int result = -1;
            using(SQLiteDataReader r = Query(query)) {
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
            string query = String.Format(
                "SELECT `goal_grade`, `user_login_id` from `user_settings` WHERE `course_id`={0}",
                courseID);

            List<GoalData> goals = new List<GoalData>();

            using(SQLiteDataReader r = Query(query)) {
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
            string userLoginID,
            string targetLoginID,
            string syncHash)
        {
            NonQuery(
                String.Format(
                    DatabaseQueries.REGISTER_USER_PEER,
                    courseID,
                    userLoginID,
                    targetLoginID,
                    syncHash
                )
            );
        }

        public void CreateUserPeer2(
            int courseID,
            int GoalGrade,
            string userLoginID,
            string syncHash)
        {
            NonQuery(
                String.Format(
                    DatabaseQueries.REGISTER_USER_PEER2,
                    courseID,
                    GoalGrade,
                    userLoginID,
                    syncHash
                )
            );
        }


        public List<String> GetPeersFromGroup(
            int courseID,
            int goalGrade,
            string hash = null)
        {
            string activeHash = hash ?? this.GetCurrentHash(courseID);
            if (activeHash == null) new List<String> { };

            List<String> peers = new List<String>();
            string query = String.Format(
                DatabaseQueries.QUERY_GROUP_PEERS,
                courseID,
                goalGrade,
                activeHash
            );

            using(SQLiteDataReader r = Query(query)) {
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
            string userLoginID,
            float grade,
            string submitted,
            string hash = null)
        {
            string activeHash = hash ?? this.GetCurrentHash(courseID);
            if (activeHash == null) new List<User> { };

            return IDNonQuery(
                String.Format(
                    DatabaseQueries.REGISTER_USER_SUBMISSION,
                    entryID,
                    userLoginID,
                    grade,
                    submitted,
                    activeHash));
        }

        public int CreateSubmissionMeta(
            int submissionID,
            string key,
            string value,
            int courseID,
            string hash=null)
        {
            string activeHash = hash ?? this.GetCurrentHash(courseID);
            return IDNonQuery(
                String.Format(
                    DatabaseQueries.REGISTER_SUBMISSION_META,
                    submissionID,
                    key,
                    value,
                    hash));
        }

        public List<TileEntrySubmission> GetTileEntrySubmissions(
            int courseID,
            int entryID,
            string hash = null)
        {
            string activeHash = hash ?? this.GetCurrentHash(courseID);
            if (activeHash == null) return new List<TileEntrySubmission>() { };

            string query = String.Format(
                DatabaseQueries.QUERY_SUBMISSIONS_FOR_ENTRY,
                entryID,
                activeHash);

            List<TileEntrySubmission> submissions = new List<TileEntrySubmission>();

            using(SQLiteDataReader r = Query(query)) {
                while (r.Read())
                {
                    TileEntrySubmission submission = new TileEntrySubmission(
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

            string query = String.Format(
                DatabaseQueries.QUERY_COURSE_SUBMISSIONS,
                courseID,
                activeHash);

            List<TileEntrySubmission> submissions = new List<TileEntrySubmission>();

            using(SQLiteDataReader r = Query(query)) {
                while (r.Read())
                {
                    try {
                        TileEntrySubmission submission = new TileEntrySubmission(
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
            string userLoginID,
            string hash = null)
        {
            string activeHash = hash ?? this.GetCurrentHash(courseID);
            if (activeHash == null) return new List<TileEntrySubmission>() { };

            string query = String.Format(
                DatabaseQueries.QUERY_COURSE_SUBMISSIONS_FOR_STUDENT,
                courseID,
                userLoginID,
                activeHash);

            List<TileEntrySubmission> submissions = new List<TileEntrySubmission>();

            using(SQLiteDataReader r = Query(query)) {
                while (r.Read())
                {
                    TileEntrySubmission submission = new TileEntrySubmission(
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
            string userLoginID,
            string hash = null)
        {
            string activeHash = hash ?? this.GetCurrentHash(courseID);
            if (activeHash == null) return new List<TileEntrySubmission>() { };

            string query = String.Format(
                DatabaseQueries.QUERY_USER_SUBMISSIONS_FOR_ENTRY_FOR_USER,
                entryID,
                userLoginID,
                activeHash);

            List<TileEntrySubmission> submissions = new List<TileEntrySubmission>();

            using(SQLiteDataReader r = Query(query)) {
                while (r.Read())
                {
                    TileEntrySubmission submission = new TileEntrySubmission(
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

            string query = String.Format(
                DatabaseQueries.QUERY_USER_SUBMISSIONS_FOR_TILE,
                tileID,
                activeHash);

            List<TileEntrySubmission> submissions = new List<TileEntrySubmission>();

            using(SQLiteDataReader r = Query(query)) {
                while (r.Read())
                {
                    TileEntrySubmission submission = new TileEntrySubmission(
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
            string userLoginID,
            string hash = null)
        {
            string activeHash = hash ?? this.GetCurrentHash(courseID);
            if (activeHash == null) return new List<TileEntrySubmission>() { };

            string query = String.Format(
                DatabaseQueries.QUERY_USER_SUBMISSIONS_FOR_TILE_FOR_USER,
                tileID,
                userLoginID,
                activeHash);

            List<TileEntrySubmission> submissions = new List<TileEntrySubmission>();

            using(SQLiteDataReader r = Query(query)) {
                while (r.Read())
                {
                    TileEntrySubmission submission = new TileEntrySubmission(
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
            string query = String.Format(
                DatabaseQueries.QUERY_PEER_GROUP_FOR_COURSE, courseID);

            PeerGroup group = null;

            using(SQLiteDataReader r = Query(query)) {
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
            string query = String.Format(
                DatabaseQueries.QUERY_CONSENT_FOR_COURSE, courseID);

            PublicInformedConsent consent = null;

            using(SQLiteDataReader r = Query(query)) {
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
            NonQuery(
                String.Format(
                    DatabaseQueries.UPDATE_CONSENT_FOR_COURSE,
                    courseID,
                    requireConsent,
                    text));
        }

        public void RecycleExternalData(int courseID, string hash)
        {
            NonQuery(String.Format(
                DatabaseQueries.RECYCLE_EXTERNAL_DATA, courseID, hash));
        }

        public void UpdateCoursePeerGroups(
            int courseID,
            int groupSize,
            bool personalizedPeers)
        {
            NonQuery(
                String.Format(
                    DatabaseQueries.UPDATE_PEER_GROUP_FOR_COURSE,
                    courseID,
                    groupSize,
                    personalizedPeers));
        }

        public PeerComparisonData[] GetUserPeerComparison(
            int courseID,
            string userLoginID,
            string hash = null)
        {
            string activeHash = hash ?? this.GetCurrentHash(courseID);
            if (activeHash == null)
                return new PeerComparisonData[] {
                    PeerComparisonData.FromGrades(0, new float[] { })
                };

            string query1 = String.Format(
                DatabaseQueries.QUERY_USER_PEER_GRADES,
                courseID,
                userLoginID,
                activeHash);

            // string query2 = String.Format(
            //     DatabaseQueries.QUERY_PREDICTED_GRADES,
            //     courseID,
            //     activeHash);


            List<PeerComparisonData> submissions = new List<PeerComparisonData>();

            using(SQLiteDataReader r1 = Query(query1)) {
                while (r1.Read()) {
                    try {

                        PeerComparisonData submission = new PeerComparisonData(
                            r1.GetInt32(0),
                            r1.GetFloat(1),
                            r1.GetFloat(2),
                            r1.GetFloat(3)
                        );

                        submissions.Add(submission);
                    } catch (Exception e) {
                        _logger.LogInformation(activeHash);
                        PrintQueryError("GetUserPeerComparison", 3, r1, e);
                    }
                }
            }

            // List<float> predictedGrades = new List<float>();
            // int tileID = -1;

            // using(SQLiteDataReader r2 = Query(query2)) {
            //     while (r2.Read())
            //     {
            //         try
            //         {
            //             if (tileID < 0)
            //             {
            //                 tileID = r2.GetInt32(1);
            //             }
            //             predictedGrades.Add(r2.GetFloat(2));
            //         } catch (Exception e) {
            //             PrintQueryError("GetUserPeerComparison", 2, r2, e);
            //         }
            //     }
            // }

            // if (tileID > 0)
            // {
            //     PeerComparisonData predictedGrade = new PeerComparisonData(
            //         tileID,
            //         predictedGrades.Average(),
            //         predictedGrades.Min(),
            //         predictedGrades.Max()
            //     );

            //     submissions.Add(predictedGrade);
            // }

            // var tiles = GetTiles(courseID);
            // var tile = tiles.Find(t => t.ContentType == Tile.CONTENT_TYPE_LEARNING_OUTCOMES);

            return submissions.ToArray();
        }

        public PeerComparisonData[] GetUserPeerComparison2(
            int courseID,
            int goalGrade,
            string hash = null)
        {
            string activeHash = hash ?? this.GetCurrentHash(courseID);
            if (activeHash == null)
                return new PeerComparisonData[] {
                    PeerComparisonData.FromGrades(0, new float[] { })
                };

            string query1 = String.Format(
                DatabaseQueries.QUERY_USER_PEER_GRADES2,
                courseID,
                goalGrade,
                activeHash);

            List<PeerComparisonData> submissions = new List<PeerComparisonData>();

            using(SQLiteDataReader r1 = Query(query1)) {
                while (r1.Read()) {
                    try {

                        PeerComparisonData submission = new PeerComparisonData(
                            r1.GetInt32(0),
                            r1.GetFloat(1),
                            r1.GetFloat(2),
                            r1.GetFloat(3)
                        );

                        submissions.Add(submission);
                    } catch (Exception e) {
                        _logger.LogInformation(activeHash);
                        PrintQueryError("GetUserPeerComparison2", 3, r1, e);
                    }
                }
            }
            return submissions.ToArray();
        }

        public List<PredictedGrade> GetPredictedGrades(int courseID, string userLoginID)
        {

            string query = String.Format(
                DatabaseQueries.QUERY_PREDICTED_GRADES_FOR_USER,
                courseID,
                userLoginID);

            List<PredictedGrade> predictions = new List<PredictedGrade>();

            using(SQLiteDataReader r = Query(query)) {
                while (r.Read())
                {
                    PredictedGrade prediction = new PredictedGrade(
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
            string userLoginID,
            string hash = null)
        {
            string activeHash = hash ?? this.GetCurrentHash(courseID);
            if (activeHash == null)
                return new PeerComparisonData[] {
                    PeerComparisonData.FromGrades(0, new float[] { })
                };

            string query1 = String.Format(
                DatabaseQueries.QUERY_USER_RESULTS,
                courseID,
                userLoginID,
                activeHash);

            // string query2 = String.Format(
            //     DatabaseQueries.QUERY_PREDICTED_GRADES,
            //     courseID, activeHash);

            List<PeerComparisonData> submissions = new List<PeerComparisonData>();

            using(SQLiteDataReader r1 = Query(query1)) {
                while (r1.Read()) {
                    PeerComparisonData submission = new PeerComparisonData(
                        r1.GetInt32(0),
                        r1.GetFloat(1),
                        r1.GetFloat(2),
                        r1.GetFloat(3)
                    );
                    submissions.Add(submission);
                }
            }

            // using(SQLiteDataReader r2 = Query(query2)) {
            //     while (r2.Read()) {
            //         if (r2.GetValue(0).ToString() != userLoginID) continue;

            //         PeerComparisonData submission = new PeerComparisonData(
            //             r2.GetInt32(1),
            //             r2.GetFloat(2),
            //             null,
            //             null
            //         );
            //         submissions.Add(submission);
            //     }
            // }

            return submissions.ToArray();
        }

        public List<TileEntrySubmission> GetTileSubmissionsForUserPeers(
            int courseID,
            int tileID,
            string userLoginID,
            string hash = null)
        {
            string activeHash = hash ?? this.GetCurrentHash(courseID);
            if (activeHash == null) return new List<TileEntrySubmission>() { };

            string query1 = String.Format(
                DatabaseQueries.QUERY_USER_SUBMISSIONS_FOR_TILE_FOR_USER_PEERS,
                tileID,
                userLoginID,
                activeHash);

            List<TileEntrySubmission> submissions = new List<TileEntrySubmission>();

            using(SQLiteDataReader r1 = Query(query1)) {
                while (r1.Read())
                {
                    TileEntrySubmission submission = new TileEntrySubmission(
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

        public List<TileEntrySubmission> GetTileSubmissionsForUser(
            int courseID,
            string userLoginID,
            string hash = null)
        {
            string activeHash = hash ?? this.GetCurrentHash(courseID);
            if (activeHash == null) return new List<TileEntrySubmission>() { };

            string query1 = String.Format(
                DatabaseQueries.QUERY_USER_SUBMISSIONS_FOR_USER,
                userLoginID,
                activeHash);

            List<TileEntrySubmission> submissions = new List<TileEntrySubmission>();

            using(SQLiteDataReader r1 = Query(query1)) {
                while (r1.Read())
                {
                    TileEntrySubmission submission = new TileEntrySubmission(
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

        public List<LearningGoal> GetGoals(int courseID)
        {
            string query = String.Format(
                DatabaseQueries.QUERY_LEARNING_GOALS,
                courseID
            );

            List<LearningGoal> goals = new List<LearningGoal>();

            using(SQLiteDataReader r = Query(query)) {
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
            string query = String.Format(
                DatabaseQueries.QUERY_TILE_LEARNING_GOALS,
                courseID, tileID
            );

            List<LearningGoal> goals = new List<LearningGoal>();
            using(SQLiteDataReader r = Query(query)){
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
            string query = String.Format(
                DatabaseQueries.QUERY_LEARNING_GOAL,
                courseID, id
            );

            LearningGoal goal = null;
            using(SQLiteDataReader r = Query(query)){
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
            string query = String.Format(
                DatabaseQueries.REGISTER_LEARNING_GOAL,
                courseID, tileID, title
            );

            return new LearningGoal(IDNonQuery(query), tileID, title);

        }

        public LearningGoal UpdateGoal(int courseID, LearningGoal goal)
        {
            string query = String.Format(
                DatabaseQueries.UPDATE_LEARNING_GOAL,
                courseID, goal.ID, goal.TileID, goal.Title
            );
            NonQuery(query);

            return GetGoal(courseID, goal.ID);
        }

        public void DeleteGoal(int courseID, LearningGoal goal) {
            goal.FetchRequirements();
            goal.DeleteGoalRequirements();

            string query = String.Format(
                DatabaseQueries.DELETE_LEARNING_GOAL, courseID, goal.ID
            );
            NonQuery(query);
        }

        public void DeleteGoal(int courseID, int id)
        {
            LearningGoal goal = GetGoal(courseID, id);
            if (goal == null) {
                return;
            }
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
            string query = String.Format(
                DatabaseQueries.REGISTER_GOAL_REQUIREMENT,
                goalID, tileID, entryID, metaKey, value, expresson
            );

            NonQuery(query);
        }

        public void UpdateGoalRequirement(GoalRequirement requirement)
        {
            string query = String.Format(
                DatabaseQueries.UPDATE_LEARNING_GOAL_REQUIREMENT,
                requirement.ID, requirement.GoalID, requirement.TileID, requirement.EntryID, requirement.MetaKey, requirement.Value, requirement.Expression
            );
            NonQuery(query);
        }
        public void DeleteGoalRequirements(int goalID)
        {
            string query = String.Format(
                DatabaseQueries.DELETE_GOAL_REQUIREMENTS,
                goalID
            );

            NonQuery(query);
        }

        public void DeleteGoalRequirement(int goalID, int id)
        {
            string query = String.Format(
                DatabaseQueries.DELETE_GOAL_REQUIREMENT,
                goalID, id
            );

            NonQuery(query);
        }
        public List<GoalRequirement> GetGoalRequirements(int goalID)
        {
            string query = String.Format(
                DatabaseQueries.QUERY_GOAL_REQUIREMENTS,
                goalID
            );

            List<GoalRequirement> requirements = new List<GoalRequirement>();

            using(SQLiteDataReader r = Query(query)) {
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
            string userLoginID,
            int tileID,
            string status,
            string hash = null)
        {
            Console.WriteLine("Registering notification to " + userLoginID + ": " + status);

            string activeHash = hash ?? this.GetCurrentHash(courseID);

            string query = String.Format(
                DatabaseQueries.REGISTER_USER_NOTIFICATIONS,
                courseID,
                userLoginID,
                tileID,
                status,
                activeHash);

            NonQuery(query);
        }

        public List<Notification> GetAllNotifications(
            int courseID)
        {
            string activeHash = String.Join("', '", this.GetRecentHashes(courseID, 2));

            string query = String.Format(
                DatabaseQueries.QUERY_ALL_NOTIFICATIONS,
                courseID,
                activeHash);

            List<Notification> notifications = new List<Notification>();

            using (SQLiteDataReader r = Query(query)) {
                while (r.Read())
                {
                    try {
                        notifications.Add(new Notification(
                            r.GetValue(0).ToString(),
                            r.GetInt32(1),
                            r.GetValue(2).ToString(),
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
            string userLoginID,
            string hash = null)
        {
            string activeHash = hash ?? this.GetCurrentHash(courseID);

            string query = String.Format(
                DatabaseQueries.QUERY_ALL_USER_NOTIFICATIONS,
                courseID,
                userLoginID,
                activeHash);

            List<Notification> notifications = new List<Notification>();

            using (SQLiteDataReader r = Query(query)) {
                while (r.Read())
                {
                    notifications.Add(new Notification(
                        userLoginID,
                        r.GetInt32(0),
                        r.GetValue(1).ToString(),
                        r.GetBoolean(2)
                    ));
                }
            }

            return notifications;
        }

        public List<Notification> GetPendingNotifications(
            int courseID,
            string userLoginID,
            string hash = null)
        {
            string activeHash = hash ?? this.GetCurrentHash(courseID);

            string query = String.Format(
                DatabaseQueries.QUERY_PENDING_USER_NOTIFICATIONS,
                courseID,
                userLoginID,
                activeHash);

            List<Notification> notifications = new List<Notification>();

            using(SQLiteDataReader r = Query(query)){
                while (r.Read())
                {
                    notifications.Add(new Notification(
                        userLoginID,
                        r.GetInt32(0),
                        r.GetValue(1).ToString(),
                        false
                    ));
                }
            }

            return notifications;
        }

        public void MarkNotificationsSent(int courseID, string userLoginID, string hash = null)
        {
            string activeHash = hash ?? this.GetCurrentHash(courseID);

            string query = String.Format(
                DatabaseQueries.QUERY_MARK_NOTIFICATIONS_SENT,
                courseID,
                userLoginID,
                activeHash);

            NonQuery(query);
        }

        public List<TileEntry> GetEntries(int courseID)
        {
            string query = String.Format(
                DatabaseQueries.QUERY_TILE_ENTRIES,
                courseID
            );

            List<TileEntry> entries = new List<TileEntry>();

            using(SQLiteDataReader r = Query(query)) {
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
            string query = String.Format(
                    DatabaseQueries.REGISTER_TILE_ENTRY,
                    entry.TileID,
                    entry.Title,
                    entry.Type,
                    entry.Wildcard);
            return IDNonQuery(query);
        }

        public void DeleteTileEntry(int id)
        {
            string query = String.Format(
                    DatabaseQueries.DELETE_TILE_ENTRY, id);
            NonQuery(query);
        }

        public void RegisterAcceptedStudent(
            int courseID,
            string studentLoginID,
            bool accepted)
        {
            string query = String.Format(
                    DatabaseQueries.REGISTER_ACCEPTED_STUDENT,
                    courseID,
                    studentLoginID,
                    accepted);

            NonQuery(query);
        }

        public void ResetAcceptList(int courseID)
        {
            NonQuery(String.Format(
                    DatabaseQueries.RESET_ACCEPT_LIST,
                    courseID));
        }

        public void SetAcceptListRequired(int courseID, bool enabled)
        {
            string query = String.Format(
                DatabaseQueries.REQUIRE_ACCEPT_LIST,
                courseID, enabled);

            NonQuery(query);
        }

        public List<AcceptList> GetAcceptList(int courseID)
        {
            string query = String.Format(
                DatabaseQueries.QUERY_ACCEPT_LIST,
                courseID);

            List<AcceptList> keys = new List<AcceptList>();

            using (SQLiteDataReader r = Query(query)) {
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
            string query = String.Format(
                DatabaseQueries.QUERY_TILE_ENTRY_META_KEYS,
                entryID);

            List<string> keys = new List<string>();

            using(SQLiteDataReader r = Query(query)) {
                while (r.Read())
                {
                    keys.Add(r.GetValue(0).ToString());
                }
            }
            return keys;
        }

        public Dictionary<string, string> GetEntryMeta(int entryID, string synchash)
        {
            string query = String.Format(
                DatabaseQueries.QUERY_TILE_ENTRY_SUBMISSION_META,
                entryID, synchash);

            Dictionary<string, string> meta = new Dictionary<string, string>();

            using(SQLiteDataReader r = Query(query)) {
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

        public void UpdateTile(int courseID, Tile newTile)
        {
            // TODO: check courseID
            string query = String.Format(
                    DatabaseQueries.UPDATE_TILE,
                    newTile.ID,
                    newTile.GroupID,
                    newTile.Title,
                    newTile.Position,
                    newTile.ContentType,
                    newTile.TileType,
                    newTile.Visible,
                    newTile.Notifications,
                    newTile.GraphView,
                    newTile.Wildcard
            );

            NonQuery(query);
        }

        public List<Tile> GetTiles(int courseID, bool autoLoadEntries = false)
        {
            string query = String.Format(
                    DatabaseQueries.QUERY_TILES,
                    courseID
            );


            List<Tile> tiles = new List<Tile>();

            using(SQLiteDataReader r = Query(query)) {
                while (r.Read())
                {
                    try {
                        Tile row = new Tile(
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

            NonQuery(
                String.Format(
                    DatabaseQueries.REGISTER_TILE_GROUP,
                    courseID, cols.ToArray()[0].ID, title, position));
        }

        public LayoutTileGroup UpdateTileGroup(
            int courseID,
            int tileGroupID,
            int columnID,
            string title,
            int position)
        {
            NonQuery(
                String.Format(
                    DatabaseQueries.UPDATE_TILE_GROUP,
                    tileGroupID,
                    columnID,
                    title,
                    position));

            return GetLayoutTileGroups(courseID).Find(g => g.ID == tileGroupID);
        }

        public void DeleteLayoutTileGroup(int id)
        {
            NonQuery(
                String.Format(
                    DatabaseQueries.DELETE_TILE_GROUP, id));
        }

        public List<LayoutTileGroup> GetLayoutTileGroups(int courseID)
        {
            string query = String.Format(
                                DatabaseQueries.QUERY_TILE_GROUPS,
                                courseID);

            List<LayoutTileGroup> tileGroups = new List<LayoutTileGroup>();

            using(SQLiteDataReader r = Query(query)) {
                while (r.Read())
                {
                    try {
                        LayoutTileGroup row = new LayoutTileGroup(
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

            string query = String.Format(
                    DatabaseQueries.QUERY_COURSE_ASSIGNMENTS,
                    courseID,
                    activeHash
            );

            List<AppAssignment> assignments = new List<AppAssignment>();

            using(SQLiteDataReader r = Query(query)) {
                while (r.Read())
                {
                    AppAssignment row = new AppAssignment(
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
                }
            }

            return assignments;
        }

        public List<AppDiscussion> GetDiscussions(int courseID, string hash = null)
        {
            string activeHash = hash ?? this.GetCurrentHash(courseID);
            if (activeHash == null) return new List<AppDiscussion>() { };

            string query = String.Format(
                    DatabaseQueries.QUERY_COURSE_DISCUSSIONS,
                    courseID,
                    activeHash
            );

            List<AppDiscussion> discussions = new List<AppDiscussion>();

            using(SQLiteDataReader r = Query(query)) {
                while (r.Read())
                {
                    AppDiscussion row = new AppDiscussion(
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

            string query;

            query = String.Format(
                DatabaseQueries.QUERY_TILE_DISCUSSIONS,
                tileID,
                activeHash
            );

            List<AppDiscussion> discussions = new List<AppDiscussion>();

            using(SQLiteDataReader r = Query(query)) {
                while (r.Read())
                {
                    AppDiscussion row = new AppDiscussion(
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

        public List<AppDiscussion> GetDiscussionEntries(int course_id, int discussion_id, string user_id = null, string hash = null) {
            string activeHash = hash ?? this.GetCurrentHash(course_id);
            if (activeHash == null) return new List<AppDiscussion>() { };

            string query;
            if (user_id == null) {
                query = String.Format(
                    DatabaseQueries.QUERY_DISCUSSION_ENTRIES,
                    course_id,
                    discussion_id,
                    activeHash
                );
            } else {
                query = String.Format(
                    DatabaseQueries.QUERY_DISCUSSION_ENTRIES_FOR_USER,
                    course_id,
                    discussion_id,
                    activeHash,
                    user_id
                );
            }

            List<AppDiscussion> entries = new List<AppDiscussion>();
            using(SQLiteDataReader r = Query(query)) {
                while (r.Read()) {
                    AppDiscussion row = new AppDiscussion(
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

        public List<AppDiscussion> GetDiscussionReplies(int course_id, int discussion_id, string user_id = null, string hash = null) {
            string activeHash = hash ?? this.GetCurrentHash(course_id);
            if (activeHash == null) return new List<AppDiscussion>() { };

            string query;
            if (user_id == null) {
                query = String.Format(
                    DatabaseQueries.QUERY_DISCUSSION_REPLIES,
                    course_id,
                    discussion_id,
                    activeHash
                );
            } else {
                query = String.Format(
                    DatabaseQueries.QUERY_DISCUSSION_REPLIES_FOR_USER,
                    course_id,
                    discussion_id,
                    activeHash,
                    user_id
                );
            }

            List<AppDiscussion> entries = new List<AppDiscussion>();
            using(SQLiteDataReader r = Query(query)) {
                while (r.Read()) {
                    AppDiscussion row = new AppDiscussion(
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
            string query = String.Format(
                DatabaseQueries.REGISTER_LAYOUT_COLUMN,
                courseID, containerWidth, position
            );
            int id = IDNonQuery(query);
            return GetLayoutColumns(courseID).Find(c => c.ID == id);
        }

        public List<LayoutColumn> GetLayoutColumns(int courseID)
        {
            string query = String.Format(
                DatabaseQueries.QUERY_LAYOUT_COLUMNS,
                courseID
            );

            List<LayoutColumn> columns = new List<LayoutColumn>();

            using(SQLiteDataReader r = Query(query)) {
                while (r.Read())
                {
                    try {
                        LayoutColumn row = new LayoutColumn(
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
            string query = String.Format(
                    DatabaseQueries.UPDATE_LAYOUT_COLUMN,
                    columnID,
                    containerWidth,
                    position
            );

            NonQuery(query);

            return GetLayoutColumns(courseID).Find(c => c.ID == columnID);
        }

        public void DeleteLayoutColumn(
            int columnID)
        {
            string query1 = String.Format(
                DatabaseQueries.DELETE_LAYOUT_COLUMN,
                columnID
            );

            string query2 = String.Format(
                DatabaseQueries.RELEASE_TILE_GROUPS_FROM_COLUMN,
                columnID);

            NonQuery(query1);
            NonQuery(query2);
        }

        public void AddTileGroup(string title, int columnID)
        {
            NonQuery(String.Format(
                "INSERT INTO `layout_tile_group` (`title`, `column_id`) VALUES('{0}', {1});",
                title, columnID
            ));
        }



        public Tile GetTile(int courseID, int tileID)
        {
            // TODO: check courseID
            string query = String.Format(
                    @"SELECT `id`, `group_id`, `title`, `position`, `tile_type`, `content_type`, `visible`, `notifications`, `graph_view`, `wildcard`
                    FROM `tile` WHERE `id`={0}",
                    tileID
            );

            Tile tile = null;

            using(SQLiteDataReader r = Query(query)) {
                while (r.Read())
                {
                    tile = new Tile(
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
            }

            return tile;
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
            string query = String.Format(
                    DatabaseQueries.REGISTER_TILE,
                    groupID,
                    title,
                    position,
                    contentType,
                    tileType,
                    visible,
                    notifications,
                    graph_view,
                    wildcard
            );
            int id = IDNonQuery(query);
            return GetTile(courseID, id);
        }

        public void AddTileEntry(int courseID, int tileID, string type,
            string title, bool wildcard = false)
        {
            NonQuery(String.Format(
                    @"INSERT INTO `tile_entry` (
                       `course_id`,
                       `tile_id`,
                       `type`,
                       `title`,
                       `wildcard`
                    ) VALUES ({0}, {1}, '{2}', '{3}', {4})",
                    courseID, tileID, type, title, wildcard
            ));
        }

        public List<TileEntry> GetTileEntries(int tileID)
        {
            string query = String.Format(
                "SELECT `id`, `tile_id`, `title`, `type`, `wildcard` from `tile_entry` WHERE `tile_id`={0}",
                tileID
            );

            List<TileEntry> entries = new List<TileEntry>();

            using(SQLiteDataReader r = Query(query)) {
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
            NonQuery(String.Format(
                    @"DELETE FROM `tile` WHERE `id` = {0};",
                    tileID
            ));
        }

        public void SetConsent(ConsentData data)
        {
            NonQuery(String.Format(
                DatabaseQueries.SET_USER_CONSENT,
                data.CourseID, data.UserID, data.UserLoginID, data.UserName.Replace("'", ""), data.Granted,
                data.Granted == -1 ? "DO NOTHING" : "DO UPDATE SET `consent` = {4}"
            ));
        }

        public int GetConsent(int courseID, int userID)
        {
            string query = String.Format(
                "SELECT `user_login_id`, `consent` from `user_settings` WHERE `course_id`={0} AND `user_id`={1}",
                courseID, userID
            );

            int consent = -1;
            using(SQLiteDataReader r = Query(query)){
                if (r.Read())
                    consent = Convert.ToInt32(r["consent"]);
            }
            return consent;
        }

        public int GetConsent(int courseID, string userLoginID)
        {
            string query = String.Format(
                "SELECT `user_login_id`, `consent` from `user_settings` WHERE `course_id`={0} AND `user_login_id`='{1}'",
                courseID, userLoginID
            );

            int consent = -1;
            using(SQLiteDataReader r = Query(query)){
                if (r.Read())
                    consent = Convert.ToInt32(r["consent"]);
            }
            return consent;
        }

        public ConsentData[] GetGrantedConsents(int courseID)
        {

            string query = String.Format(
                "SELECT `user_id`, `user_login_id`, `user_name` from `user_settings` WHERE `course_id`={0} AND `consent`=1",
                courseID
            );

            List<ConsentData> consents = new List<ConsentData>();

            using(SQLiteDataReader r = Query(query)) {
                while (r.Read())
                {
                    consents.Add(new ConsentData(courseID, r.GetInt32(0), r.GetValue(1).ToString(), r.GetValue(2).ToString(), 1));
                }
            }

            return consents.ToArray();


        }
        public ConsentData[] GetConsents(int courseID)
        {
            string query = String.Format(
                "SELECT `user_id`, `user_login_id`, `user_name`, `consent` from `user_settings` WHERE `course_id`={0}",
                courseID
            );

            List<ConsentData> consents = new List<ConsentData>();

            using(SQLiteDataReader r = Query(query)) {
                while (r.Read())
                {
                    try {
                        consents.Add(new ConsentData(courseID, r.GetInt32(0), r.GetValue(1).ToString(), r.GetValue(2).ToString(), r.GetInt32(3)));
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
                NonQuery(String.Format(
                    "INSERT INTO external_data (`course_id`, `tile_id`, `title`, `grade`, `user_login_id`) VALUES('{0}', '{1}', '{2}', '{3}', '{4}');",
                    courseID, entry.TileID, entry.Title, entry.Grade, entry.UserLoginID
                ));
            }
        }

        public ExternalData[] GetExternalData(int courseID, int tileID, string userLoginID)
        {
            string query = tileID == -1
                ? String.Format(
                        "SELECT `user_login_id`, `title`, `grade` from `external_data` WHERE `course_id`={0} AND `user_login_id`='{1}'",
                        courseID, userLoginID
                    )
                : userLoginID != null ?
                    String.Format(
                        "SELECT `user_login_id`, `title`, `grade` from `external_data` WHERE `course_id`={0} AND `tile_id`={1} AND `user_login_id`='{2}'",
                        courseID, tileID, userLoginID
                    ) : String.Format(
                        "SELECT `user_login_id`, `title`, `grade` from `external_data` WHERE `course_id`={0} AND `tile_id`={1}",
                        courseID, tileID
                    );
            List<ExternalData> submissions = new List<ExternalData>();

            using(SQLiteDataReader r = Query(query)){
                while (r.Read())
                {
                    ExternalData submission = new ExternalData(courseID, r.GetValue(0).ToString(), tileID, r.GetValue(1).ToString(), r.GetValue(2).ToString());
                    submissions.Add(submission);
                }
            }

            return submissions.ToArray();
        }

        public void TrackUserAction(
            string userID,
            string action)
        {
            NonQuery(
                String.Format(
                    DatabaseQueries.INSERT_USER_ACTION,
                    userID,
                    action));
        }

    }
}
