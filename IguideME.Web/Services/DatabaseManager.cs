using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SQLite;
using System.Linq;
using IguideME.Web.Models;
using IguideME.Web.Models.App;
using IguideME.Web.Models.Impl;
using IguideME.Web.Services.Workers;
using Microsoft.Extensions.Logging;

namespace IguideME.Web.Services
{
    public sealed class DatabaseManager
    {
        private static DatabaseManager s_instance;
        private readonly string _connection_string;
        private readonly ILogger _logger;

        private DatabaseManager(bool isDev = false)
        {
            ILoggerFactory factory = LoggerFactory.Create(builder => builder.AddConsole());
            _logger = factory.CreateLogger("DatabaseManager");
            DatabaseManager.s_instance = this;
            if (isDev)
            {
                _connection_string = "Data Source=db.sqlite;Version=3;New=False;Compress=True;";
            }
            else
            {
                _connection_string = "Data Source=data/IguideME2.db;Version=3;New=False;Compress=True;";
            }

            DatabaseManager.s_instance.RunMigrations();
            DatabaseManager.s_instance.CreateTables();
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
                _logger.LogError(
                    "Exception encountered while creating query: {message}",
                    e.Message
                );
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
                    error +=
                        $"{r.GetName(i)} {r.GetDataTypeName(i)} {r.GetValue(i)} {r.GetValue(i).GetType()}\n";

                _logger.LogError(
                    "Error reading from the query: {error} \n\n {message} \n {trace}",
                    error,
                    e.Message,
                    e.StackTrace
                );
            }
            catch (Exception ex)
            {
                _logger.LogError(
                    "Error in printquerryerror: {message} {trace}\n\nOriginal error:\n{original} {originaltrace}",
                    ex.Message,
                    ex.StackTrace,
                    e.Message,
                    e.StackTrace
                );
            }
        }

        public void LogTable(string name)
        {
            _logger.LogDebug("Logging table {name}", name);

            string table = "";
            using (
                SQLiteDataReader r = Query("select * from @name", new SQLiteParameter("name", name))
            )
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
                DatabaseQueries.CREATE_TABLE_NOTIFICATIONS_COURSE_SETTINGS,
                DatabaseQueries.CREATE_TABLE_SYNC_HISTORY,
                DatabaseQueries.CREATE_TABLE_STUDENT_SETTINGS,
                DatabaseQueries.CREATE_TABLE_USER_TRACKER,
                DatabaseQueries.CREATE_TABLE_LAYOUT_COLUMNS,
                DatabaseQueries.CREATE_TABLE_TILE_GROUPS,
                DatabaseQueries.CREATE_TABLE_TILES,
                DatabaseQueries.CREATE_TABLE_ASSIGNMENTS,
                DatabaseQueries.CREATE_TABLE_LEARNING_GOALS,
                DatabaseQueries.CREATE_TABLE_GOAL_REQUREMENTS,
                DatabaseQueries.CREATE_TABLE_DISCUSSIONS,
                DatabaseQueries.CREATE_TABLE_DISCUSSION_ENTRIES,
                DatabaseQueries.CREATE_TABLE_TILE_ENTRIES,
                DatabaseQueries.CREATE_TABLE_SUBMISSIONS,
                DatabaseQueries.CREATE_TABLE_SUBMISSIONS_META,
                // DatabaseQueries.CREATE_TABLE_GRADE_PREDICTION_MODEL,
                // DatabaseQueries.CREATE_TABLE_GRADE_PREDICTION_MODEL_PARAMETER,
                DatabaseQueries.CREATE_TABLE_PEER_GROUPS,
                DatabaseQueries.CREATE_TABLE_TILE_GRADES,
                DatabaseQueries.CREATE_TABLE_NOTIFICATIONS,
                DatabaseQueries.CREATE_TABLE_MIGRATIONS,
                DatabaseQueries.CREATE_TABLE_USER_TRACKER,
                DatabaseQueries.CREATE_TABLE_ACCEPT_LIST,

                DatabaseQueries.CREATE_INDEX_NOTIFICATIONS_COURSE_SETTINGS,
                DatabaseQueries.CREATE_INDEX_USER_TRACKER_USER_ID,
                DatabaseQueries.CREATE_INDEX_USER_TRACKER_COURSE_ID,
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
                Console.WriteLine($"Checking migration {migration_id}...");
                using (
                    SQLiteDataReader r = Query(
                        DatabaseQueries.QUERY_MIGRATIONS,
                        new SQLiteParameter("id", migration_id)
                    )
                )
                    if (r.HasRows)
                        continue;

                Console.WriteLine(
                    $"Migration {migration_id} not yet applied, proceeding to apply..."
                );

                string migration_sql = entry.Value;
                NonQuery(migration_sql);
                NonQuery(
                    DatabaseQueries.REGISTER_MIGRATION,
                    new SQLiteParameter("id", migration_id)
                );
            }
        }

        private long GetCurrentSyncID(int courseID)
        {
            /**
             * Retrieve latest complete synchronization for course. If no
             * historic synchronization was found then null is returned.
             */
            using (
                SQLiteDataReader r = Query(
                    DatabaseQueries.QUERY_LATEST_SYNCS_FOR_COURSE,
                    new SQLiteParameter("courseID", courseID),
                    new SQLiteParameter("limit", 1)
                )
            )
                if (r.Read())
                    return long.Parse(r.GetValue(0).ToString());

            return 0;
        }

        private List<long> GetSyncsSince(int courseID, long moment, int limit = 1)
        {
            List<long> syncs = new() { };
            using (
                SQLiteDataReader r = Query(
                    DatabaseQueries.QUERY_SYNCS_SINCE_MOMENT_FOR_COURSE,
                    new SQLiteParameter("courseID", courseID),
                    new SQLiteParameter("moment", moment),
                    new SQLiteParameter("limit", limit)
                )
            )
                while (r.Read())
                {
                    syncs.Add(long.Parse(r.GetValue(0).ToString()));
                }

            return syncs;
        }

        private List<long> GetRecentSyncs(int courseID, int number_of_syncs)
        {
            /**
             * Retrieve latest n complete synchronizations for course. If no
             * historic synchronization was found then null is returned.
             */

            List<long> syncIDs = new();

            using (
                SQLiteDataReader r = Query(
                    DatabaseQueries.QUERY_LATEST_SYNCS_FOR_COURSE,
                    new SQLiteParameter("courseID", courseID),
                    new SQLiteParameter("limit", number_of_syncs)
                )
            )
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

            using (
                SQLiteDataReader r = Query(
                    DatabaseQueries.QUERY_OLD_HASHES_FOR_COURSE,
                    new SQLiteParameter("courseID", courseID),
                    new SQLiteParameter("offset", 15)
                )
            )
            {
                while (r.Read())
                {
                    try
                    {
                        syncIDs.Add(long.Parse(r.GetValue(0).ToString()));
                    }
                    catch (Exception e)
                    {
                        _logger.LogError(
                            "Unable to get old sync: {sync}\nError: {message}\n{trace}",
                            r.GetValue(0),
                            e.Message,
                            e.StackTrace
                        );
                    }
                }
            }
            foreach (long syncID in syncIDs)
            {
                NonQuery(
                    DatabaseQueries.DELETE_OLD_SYNCS_FOR_COURSE,
                    new SQLiteParameter("courseID", courseID),
                    new SQLiteParameter("syncID", syncID)
                );
            }
        }

        public bool IsCourseRegistered(int courseID)
        {
            using (
                SQLiteDataReader r = Query(
                    DatabaseQueries.QUERY_DOES_COURSE_EXIST,
                    new SQLiteParameter("courseID", courseID)
                )
            )
                return r.Read();
        }

        public void RegisterCourse(int courseID, string courseName)
        {
            /**
             * Create a new course.
             */
            NonQuery(
                DatabaseQueries.REGISTER_COURSE,
                new SQLiteParameter("courseID", courseID),
                new SQLiteParameter("courseName", courseName)
            );
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
                _logger.LogError(
                    "Error removing syncs: {message}\n{trace}",
                    e.Message,
                    e.StackTrace
                );
            }
        }

        public void RegisterSync(int courseID, long syncID)
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

            using (
                SQLiteDataReader r = Query(
                    DatabaseQueries.QUERY_SYNC_HASHES_FOR_COURSE,
                    new SQLiteParameter("courseID", courseID)
                )
            )
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

                        hashes.Add(
                            new DataSynchronization(
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
            using (
                SQLiteDataReader r = Query(
                    DatabaseQueries.QUERY_PEER_GROUP_FOR_COURSE,
                    new SQLiteParameter("courseID", courseID)
                )
            )
            {
                if (r.Read())
                    return r.GetInt32(0);
            }

            return 1;
        }

        public dynamic GetNotificationDates(int courseID)
        {
            using (
                SQLiteDataReader r = Query(
                    DatabaseQueries.QUERY_NOTIFICATION_DATES_FOR_COURSE,
                    new SQLiteParameter("courseID", courseID)
                )
            )
                if (r.Read())
                    return new
                    {
                        isRange = r.GetBoolean(0),
                        selectedDays = r.GetValue(1).ToString(),
                        selectedDates = r.GetValue(2).ToString()
                    };
            return new
            {
                isRange = false,
                selectedDays = "",
                selectedDates = ""
            };
        }

        public void RegisterUser(User user)
        {
            NonQuery(
                DatabaseQueries.REGISTER_USER_FOR_COURSE,
                new SQLiteParameter("studentnumber", user.StudentNumber),
                new SQLiteParameter("userID", user.UserID),
                new SQLiteParameter("name", user.Name),
                new SQLiteParameter("sortableName", user.SortableName),
                new SQLiteParameter("role", user.Role)
            );
        }

        public int RegisterAssignment(AppAssignment assignment)
        {
            int assignment_id = IDNonQuery(
                DatabaseQueries.REGISTER_ASSIGNMENT,
                new SQLiteParameter("externalID", assignment.ExternalID),
                new SQLiteParameter("courseID", assignment.CourseID),
                new SQLiteParameter("title", assignment.Title),
                new SQLiteParameter("published", assignment.Published),
                new SQLiteParameter("muted", assignment.Muted),
                new SQLiteParameter("dueDate", assignment.DueDate),
                new SQLiteParameter("maxGrade", assignment.MaxGrade),
                new SQLiteParameter("gradingType", assignment.GradingType)
            );

            if (assignment_id == 0)
                assignment_id = GetInternalAssignmentID(
                    (int)assignment.ExternalID,
                    assignment.CourseID
                );

            return assignment_id;
        }

        public void RegisterDiscussion(AppDiscussionTopic discussion, long syncID)
        {
            NonQuery(
                DatabaseQueries.REGISTER_DISCUSSION,
                new SQLiteParameter("discussionID", discussion.ID),
                new SQLiteParameter("courseID", discussion.CourseID),
                new SQLiteParameter("title", discussion.Title),
                new SQLiteParameter("authorName", discussion.Author),
                new SQLiteParameter("date", discussion.Date),
                new SQLiteParameter("message", discussion.Message)
            );
        }

        public void RegisterDiscussionEntry(AppDiscussionEntry entry)
        {
            // This seems to be possible when a teacher replies, but discussions without an author are useless to us
            // so no need to save them.
            if (entry.Author == null)
            {
                return;
            }

            NonQuery(
                DatabaseQueries.REGISTER_DISCUSSION_ENTRY,
                new SQLiteParameter("entryID", entry.ID),
                new SQLiteParameter("discussionID", entry.DiscussionID),
                new SQLiteParameter("parentID", entry.ParentID),
                new SQLiteParameter("userID", entry.Author),
                new SQLiteParameter("date", entry.Date),
                new SQLiteParameter("courseID", entry.CourseID),
                new SQLiteParameter("message", entry.Message)
            );
        }

        public List<User> GetUsers(
            int courseID,
            UserRoles role = UserRoles.student,
            long syncID = 0
        )
        {
            long activeSync = syncID == 0 ? this.GetCurrentSyncID(courseID) : syncID;
            if (activeSync == 0)
            {
                _logger.LogWarning("Hash is null, returning empty user list.");
                return new List<User>() { };
            }
            List<User> users = new();

            using (
                SQLiteDataReader r = Query(
                    DatabaseQueries.QUERY_USERS_WITH_ROLE_FOR_COURSE,
                    new SQLiteParameter("courseID", courseID),
                    new SQLiteParameter("role", (int)role),
                    new SQLiteParameter("syncID", activeSync)
                )
            )
            {
                // collect all users
                while (r.Read())
                {
                    User user =
                        new(
                            r.GetValue(0).ToString(),
                            courseID,
                            r.GetInt32(1),
                            r.GetValue(2).ToString(),
                            r.GetValue(3).ToString(),
                            role == UserRoles.student ? r.GetInt32(4) : 1
                        );
                    users.Add(user);
                }
            }

            return users;
        }

        public int CountUsers(int courseID, UserRoles role = UserRoles.student, long syncID = 0)
        {

            long activeSync = syncID == 0 ? this.GetCurrentSyncID(courseID) : syncID;
            if (activeSync == 0)
            {
                return 0;
            }

            using (
                SQLiteDataReader r = Query(
                    DatabaseQueries.QUERY_COUNT_USERS,
                    new SQLiteParameter("courseID", courseID),
                    new SQLiteParameter("role", role),
                    new SQLiteParameter("syncID", activeSync)
                )
            )
                if (r.Read())
                    return r.GetInt32(0);

            return 0;
        }

        public int CountConsents(int courseID, long syncID)
        {
            using SQLiteDataReader r = Query(
                    DatabaseQueries.QUERY_NUMBER_CONSENT_PER_COURSE,
                    new SQLiteParameter("courseID", courseID),
                    new SQLiteParameter("syncID", syncID)
            );
            if (r.Read())
            {
                return r.GetInt32(0);
            }
            return 0;
        }

        public List<User> GetUsersWithGrantedConsent(
            int courseID,
            UserRoles role = UserRoles.student,
            long syncID = 0
        )
        {
            long activeSync = syncID == 0 ? this.GetCurrentSyncID(courseID) : syncID;
            if (activeSync == 0)
            {
                _logger.LogWarning("Hash is null, returning empty user list.");
                return new List<User>() { };
            }

            List<User> users = new();

            using (
                SQLiteDataReader r = Query(
                    DatabaseQueries.QUERY_CONSENTED_STUDENTS_FOR_COURSE,
                    new SQLiteParameter("courseID", courseID),
                    new SQLiteParameter("syncID", activeSync)
                )
            )
            {
                while (r.Read())
                {
                    User user =
                        new(
                            r.GetValue(0).ToString(),
                            courseID,
                            r.GetInt32(1),
                            r.GetValue(2).ToString(),
                            r.GetValue(3).ToString(),
                            role == UserRoles.student ? r.GetInt32(4) : 1
                        );
                    users.Add(user);
                }
            }

            return users;
        }

        public List<User> GetUsersWithSettings(
            int courseID,
            UserRoles role = UserRoles.student,
            long syncID = 0
        )
        {
            long activeSync = syncID == 0 ? this.GetCurrentSyncID(courseID) : syncID;
            if (activeSync == 0)
            {
                _logger.LogWarning("Hash is null, returning empty user list.");
                return new List<User>() { };
            }

            List<User> users = new();

            using (
                SQLiteDataReader r = Query(
                    DatabaseQueries.QUERY_USERS_WITH_ROLE_FOR_COURSE,
                    new SQLiteParameter("courseID", courseID),
                    new SQLiteParameter("role", role),
                    new SQLiteParameter("syncID", activeSync)
                )
            )
            {
                while (r.Read())
                {
                    User user =
                        new(
                            r.GetValue(0).ToString(),
                            courseID,
                            r.GetInt32(1),
                            r.GetValue(2).ToString(),
                            r.GetValue(3).ToString(),
                            role == UserRoles.student ? r.GetInt32(4) : 1
                        );
                    users.Add(user);
                }
            }

            foreach (User user in users)
            {
                using (
                    SQLiteDataReader r2 = Query(
                        DatabaseQueries.QUERY_LAST_STUDENT_SETTINGS,
                        new SQLiteParameter("courseID", courseID),
                        new SQLiteParameter("userID", user.UserID)
                    )
                )
                {
                    if (r2.Read())
                    {
                        user.Settings = new(
                            r2.GetInt32(0),
                            r2.GetDouble(1),
                            r2.GetDouble(2),
                            r2.GetInt32(3),
                            r2.GetBoolean(4)
                        );
                    }
                }
            }
            return users;
        }

        public string GetUserID(int studentNumber)
        {
            using (
                SQLiteDataReader r = Query(
                    DatabaseQueries.QUERY_USER_ID,
                    new SQLiteParameter("studentNumber", studentNumber)
                )
            )
            {
                if (r.Read())
                {
                    return r.GetValue(0).ToString();
                }
            }
            return null;
        }

        public string GetUserIDFromName(int courseID, string name)
        {
            using (
                SQLiteDataReader r = Query(
                    DatabaseQueries.QUERY_USER_ID_FROM_NAME,
                    new SQLiteParameter("name", name)
                )
            )
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
            using (
                SQLiteDataReader r = Query(
                    DatabaseQueries.QUERY_CONSENTED_USER_ID_FROM_STUDENT_NUMBER,
                    new SQLiteParameter("courseID", courseID),
                    new SQLiteParameter("studentNumber", studentNumber)
                )
            )
            {
                if (r.Read())
                    return r.GetValue(0).ToString();
            }
            return null;
        }

        public User GetUser(int courseID, string userID)
        {
            User user = null;
            using (
                SQLiteDataReader r = Query(
                    DatabaseQueries.QUERY_USER_DATA_FOR_COURSE,
                    new SQLiteParameter("courseID", courseID),
                    new SQLiteParameter("userID", userID)
                )
            )
            {
                if (r.Read())
                {
                    user = new(
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
                using (
                    SQLiteDataReader r2 = Query(
                        DatabaseQueries.QUERY_LAST_STUDENT_SETTINGS,
                        new SQLiteParameter("courseID", courseID),
                        new SQLiteParameter("userID", userID)
                    )
                )
                {
                    if (r2.Read())
                    {
                        user.Settings = new(
                            r2.GetInt32(0),
                            r2.GetDouble(1),
                            r2.GetDouble(2),
                            r2.GetInt32(3),
                            r2.GetBoolean(4)
                        );
                    }
                }
            }

            return user;
        }

        // public User GetUser(int courseID, string userID)
        // {
        //     User user = null;
        //     using (
        //         SQLiteDataReader r = Query(
        //             DatabaseQueries.QUERY_CONSENTED_USER_DATA_FOR_COURSE,
        //             new SQLiteParameter("courseID", courseID),
        //             new SQLiteParameter("userID", userID)
        //         )
        //     )
        //     {
        //         if (r.Read())
        //         {
        //             user = new User(
        //                 r.GetValue(0).ToString(),
        //                 courseID,
        //                 r.GetInt32(1),
        //                 r.GetValue(2).ToString(),
        //                 r.GetValue(3).ToString(),
        //                 r.GetValue(5) != null ? r.GetInt32(5) : 1
        //             );
        //         }
        //     }

        //     return user;
        // }

        public List<User> GetUsersWithGoalGrade(int courseID, int goalGrade, long syncID = 0)
        {
            long activeSync = syncID == 0 ? this.GetCurrentSyncID(courseID) : syncID;
            if (activeSync == 0)
                return new List<User> { };

            List<User> users = new();

            using (
                SQLiteDataReader r = Query(
                    DatabaseQueries.QUERY_STUDENTS_WITH_GOAL_GRADE,
                    new SQLiteParameter("courseID", courseID),
                    new SQLiteParameter("goalGrade", goalGrade)
                )
            )
            {
                // collect all users
                while (r.Read())
                {
                    User user =
                        new(
                            r.GetValue(0).ToString(),
                            courseID,
                            r.GetInt32(1),
                            r.GetValue(2).ToString(),
                            r.GetValue(3).ToString(),
                            r.GetInt32(4)
                        );
                    users.Add(user);
                }
            }

            return users;
        }

        public List<string> GetUserIDsWithGoalGrade(int courseID, int goalGrade, long syncID = 0)
        {
            List<string> users = new();

            long activeSync = syncID == 0 ? this.GetCurrentSyncID(courseID) : syncID;
            if (activeSync == 0)
                return users;


            using (
                SQLiteDataReader r = Query(
                    DatabaseQueries.QUERY_STUDENT_IDS_WITH_GOAL_GRADE,
                    new SQLiteParameter("courseID", courseID),
                    new SQLiteParameter("goalGrade", goalGrade)
                )
            )
            {
                // collect all users
                while (r.Read())
                {
                    users.Add(r.GetValue(0).ToString());
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

            using (
                SQLiteDataReader r = Query(
                    DatabaseQueries.QUERY_GRADE_PREDICTION_MODELS_FOR_COURSE,
                    new SQLiteParameter("courseID", courseID)
                )
            )
            {
                while (r.Read())
                {
                    try
                    {
                        model = new GradePredictionModel(
                            r.GetInt32(0),
                            courseID,
                            r.GetBoolean(2),
                            r.GetFloat(1)
                        );
                        // model.getParameters();
                        models.Add(model);
                    }
                    catch (Exception e)
                    {
                        PrintQueryError("GetGrade{redictionModels", 2, r, e);
                    }
                }
            }

            models.ForEach(
                (GradePredictionModel model) =>
                    model.Parameters = GetGradePredictionModelParameters(model.ID)
            );

            return models;
        }

        public GradePredictionModel GetGradePredictionModel(int courseID)
        {
            GradePredictionModel model = null;

            using (
                SQLiteDataReader r = Query(
                    DatabaseQueries.QUERY_GRADE_PREDICTION_MODEL_FOR_COURSE,
                    new SQLiteParameter("courseID", courseID)
                )
            )
            {
                if (r.Read())
                {
                    model = new GradePredictionModel(r.GetInt32(0), courseID, true, r.GetFloat(1));
                }
            }

            if (model != null)
                model.Parameters = GetGradePredictionModelParameters(model.ID);
            return model;
        }

        public List<GradePredictionModelParameter> GetGradePredictionModelParameters(int modelID)
        {
            List<GradePredictionModelParameter> parameters = new();

            using (
                SQLiteDataReader r = Query(
                    DatabaseQueries.QUERY_GRADE_PREDICTION_MODEL_PARAMETERS_FOR_MODEL,
                    new SQLiteParameter("modelID", modelID)
                )
            )
            {
                while (r.Read())
                {
                    GradePredictionModelParameter parameter =
                        new(r.GetInt32(0), r.GetInt32(1), r.GetInt32(2), r.GetFloat(3));
                    parameters.Add(parameter);
                }
            }

            return parameters;
        }

        public void InitializeUserSettings(int courseID, string userID, long syncID)
        {
            long activeSync = syncID == 0 ? this.GetCurrentSyncID(courseID) : syncID;
            long old_sync = 0;

            using (
                SQLiteDataReader r = Query(
                    DatabaseQueries.QUERY_LAST_STUDENT_SETTINGS,
                    new SQLiteParameter("courseID", courseID),
                    new SQLiteParameter("userID", userID)
                )
            )
            {
                if (r.Read())
                    old_sync = long.Parse(r.GetValue(5).ToString());
            }

            if (old_sync != 0)
                NonQuery(
                    DatabaseQueries.QUERY_UPDATE_STUDENT_SETTINGS,
                    new SQLiteParameter("courseID", courseID),
                    new SQLiteParameter("userID", userID),
                    new SQLiteParameter("oldSyncID", old_sync),
                    new SQLiteParameter("syncID", activeSync)
                );
            else
                NonQuery(
                    DatabaseQueries.INITIALIZE_STUDENT_SETTINGS,
                    new SQLiteParameter("courseID", courseID),
                    new SQLiteParameter("userID", userID),
                    new SQLiteParameter("syncID", activeSync)
                );
        }

        public bool GetTileNotificationState(int tileID)
        {
            bool result = false;
            using (
                SQLiteDataReader r = Query(
                    DatabaseQueries.QUERY_TILE_NOTIFICATIONS_STATE,
                    new SQLiteParameter("tileID", tileID)
                )
            )
            {
                if (r.Read())
                {
                    try
                    {
                        result = r.GetBoolean(0);
                    }
                    catch (Exception e)
                    {
                        PrintQueryError("GetTileNotificationState", 0, r, e);
                    }
                }
                return result;
            }
        }

        public bool GetNotificationEnable(int courseID, string userID, long syncID)
        {
            bool result = true;
            using (
                SQLiteDataReader r = Query(
                    DatabaseQueries.QUERY_NOTIFICATIONS_ENABLE,
                    new SQLiteParameter("courseID", courseID),
                    new SQLiteParameter("userID", userID)
                )
            )
            {
                if (r.Read())
                {
                    try
                    {
                        result = r.GetBoolean(0);
                    }
                    catch (Exception e)
                    {
                        PrintQueryError("GetNotificationEnable", 0, r, e);
                    }
                }
                return result;
            }
        }

        public void UpdateUserSettings(
            int courseID,
            string userID,
            int? consent,
            int? goalGrade,
            double? totalGrade,
            double? predictedGrade,
            bool? notifications,
            long syncID
        )
        {
            // When it is done by the user, we get the last available syncID, to replace the settings instead of register them
            long activeSync = syncID == 0 ? this.GetCurrentSyncID(courseID) : syncID;
            User tempUser = new User(userID, courseID, -1, "", "-1", (int)UserRoles.student);

            using (
                SQLiteDataReader r = Query(
                    DatabaseQueries.QUERY_LAST_STUDENT_SETTINGS,
                    new SQLiteParameter("courseID", courseID),
                    new SQLiteParameter("userID", userID)
                )
            )
            {
                while (r.Read())
                {
                    try
                    {
                        tempUser.Settings = new UserSettings(
                            goalGrade ?? r.GetInt32(0),
                            totalGrade ?? r.GetDouble(1),
                            predictedGrade ?? r.GetDouble(2),
                            consent ?? r.GetInt32(3),
                            notifications ?? r.GetBoolean(4)
                        );
                    }
                    catch (Exception e)
                    {
                        PrintQueryError("UpdateUserSettings", 0, r, e);
                    }
                }
            }

            NonQuery(
                DatabaseQueries.REGISTER_STUDENT_SETTINGS,
                new SQLiteParameter("CourseID", courseID),
                new SQLiteParameter("UserID", userID),
                new SQLiteParameter("PredictedGrade", tempUser.Settings.PredictedGrade),
                new SQLiteParameter("TotalGrade", tempUser.Settings.TotalGrade),
                new SQLiteParameter("GoalGrade", tempUser.Settings.GoalGrade),
                new SQLiteParameter("Consent", tempUser.Settings.Consent),
                new SQLiteParameter("Notifications", tempUser.Settings.Notifications),
                new SQLiteParameter("syncID", activeSync)
            );
        }

        public double GetUserTotalGrade(int courseID, string userID)
        {
            double result = -1;
            using (
                SQLiteDataReader r = Query(
                    DatabaseQueries.QUERY_TOTAL_GRADE_FOR_USER,
                    new SQLiteParameter("courseID", courseID),
                    new SQLiteParameter("userID", userID)
                )
            )
            {
                if (r.Read())
                {
                    try
                    {
                        result = r.GetDouble(0);
                    }
                    catch (Exception e)
                    {
                        PrintQueryError("GetUserTotalGrade", 0, r, e);
                    }
                }
                return result;
            }
        }

        public int GetUserGoalGrade(int courseID, string userID, long syncID)
        {
            int result = -1;
            using (
                SQLiteDataReader r = Query(
                    DatabaseQueries.QUERY_GOAL_GRADE_FOR_USER,
                    new SQLiteParameter("courseID", courseID),
                    new SQLiteParameter("userID", userID)
                )
            )
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

        /// 0 means that we don't compare for assignment/tile/etc., but total average
        public void CreateUserPeer(
            int goalGrade,
            List<string> userIDs,
            int componentID,
            double avgGrade,
            double minGrade,
            double maxGrade,
            int componentType,
            long syncID
        )
        {
            string combinedIDs = string.Join(",", userIDs);
            NonQuery(
                DatabaseQueries.REGISTER_USER_PEER,
                new SQLiteParameter("goalGrade", goalGrade),
                new SQLiteParameter("combinedIDs", combinedIDs),
                new SQLiteParameter("componentID", componentID),
                new SQLiteParameter("avgGrade", avgGrade),
                new SQLiteParameter("minGrade", minGrade),
                new SQLiteParameter("maxGrade", maxGrade),
                new SQLiteParameter("componentType", componentType),
                new SQLiteParameter("syncID", syncID)
            );
        }

        public List<String> GetPeersFromGroup(int courseID, int goalGrade, long syncID = 0)
        {
            long activeSync = syncID == 0 ? this.GetCurrentSyncID(courseID) : syncID;
            if (activeSync == 0)
                return new List<string> { };

            List<String> peers = new();

            using (
                SQLiteDataReader r = Query(
                    DatabaseQueries.QUERY_GROUP_PEERS,
                    new SQLiteParameter("courseID", courseID),
                    new SQLiteParameter("goalGrade", goalGrade),
                    new SQLiteParameter("syncID", activeSync)
                )
            )
            {
                while (r.Read())
                {
                    peers.Add(r.GetValue(0).ToString());
                }
            }
            return peers;
        }

        public void CreateTileGradeForUser(string userID, int tileID, double grade, long syncID)
        {
            NonQuery(
                DatabaseQueries.REGISTER_TILE_GRADE,
                new SQLiteParameter("userID", userID),
                new SQLiteParameter("tileID", tileID),
                new SQLiteParameter("Grade", grade),
                new SQLiteParameter("syncID", syncID)
            );
        }

        public double GetLatestTileGradeForUser(string userID, int tileID)
        {
            using (
                SQLiteDataReader r = Query(
                    DatabaseQueries.QUERY_TILE_GRADE_FOR_USER,
                    new SQLiteParameter("userID", userID),
                    new SQLiteParameter("tileID", tileID)
                )
            )
            {
                if (r.Read())
                {
                    try
                    {
                        return r.GetDouble(0);
                    }
                    catch (Exception e)
                    {
                        PrintQueryError("GetLatestTileGradeForUser", 4, r, e);
                    }
                }
            }
            return 0;
        }

        public int GetInternalAssignmentID(int externalID, int courseID)
        {
            using (
                SQLiteDataReader r = Query(
                    DatabaseQueries.QUERY_ASSIGNMENT_ID_FROM_EXTERNAL,
                    new SQLiteParameter("externalID", externalID),
                    new SQLiteParameter("courseID", courseID)
                )
            )
            {
                if (r.Read())
                {
                    try
                    {
                        return r.GetInt32(0);
                    }
                    catch (Exception e)
                    {
                        PrintQueryError("GetInternalAssignmentID", 4, r, e);
                    }
                }
            }
            return 0;
        }

        public bool AssignmentHasEntry(int courseID, int assignmentID)
        {
            using (
                SQLiteDataReader r = Query(
                    DatabaseQueries.QUERY_CONTENT_HAS_ENTRY,
                    new SQLiteParameter("assignmentID", assignmentID),
                    new SQLiteParameter("contentType", TileType.assignments)
                )
            )
            {
                // If we find anything then it has an entry.
                if (r.Read())
                {
                    return true;
                }
            }
            return false;

        }

        public int CreateUserSubmission(AssignmentSubmission submission)
        {
            return IDNonQuery(
                DatabaseQueries.REGISTER_USER_SUBMISSION,
                new SQLiteParameter("assignmentID", submission.AssignmentID),
                new SQLiteParameter("userID", submission.UserID),
                new SQLiteParameter("Grade", submission.Grade),
                new SQLiteParameter("date", submission.Date)
            );
        }

        public void CreateSubmissionMeta(int submissionID, string key, string value)
        {
            NonQuery(
                DatabaseQueries.REGISTER_SUBMISSION_META,
                new SQLiteParameter("submissionID", submissionID),
                new SQLiteParameter("key", key),
                new SQLiteParameter("value", value)
            );
        }

        // TODO: probably switch to using grades version of submissions instead of Grade.
        public List<AssignmentSubmission> GetCourseSubmissions(int courseID, long syncID = 0)
        {
            long activeSync = syncID == 0 ? this.GetCurrentSyncID(courseID) : syncID;
            if (activeSync == 0)
                return new List<AssignmentSubmission>() { };

            List<AssignmentSubmission> submissions = new();

            using (
                SQLiteDataReader r = Query(
                    DatabaseQueries.QUERY_COURSE_SUBMISSIONS,
                    new SQLiteParameter("courseID", courseID),
                    new SQLiteParameter("syncID", activeSync)
                )
            )
            {
                while (r.Read())
                {
                    try
                    {
                        AssignmentSubmission submission =
                            new(
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
            long syncID = 0
        )
        {
            long activeSync = syncID == 0 ? this.GetCurrentSyncID(courseID) : syncID;
            if (activeSync == 0)
                return new List<AssignmentSubmission>() { };

            List<AssignmentSubmission> submissions = new();

            using (
                SQLiteDataReader r = Query(
                    DatabaseQueries.QUERY_COURSE_SUBMISSIONS_FOR_STUDENT,
                    new SQLiteParameter("courseID", courseID),
                    new SQLiteParameter("userID", userID)
                )
            )
            {
                while (r.Read())
                {
                    AssignmentSubmission submission =
                        new(
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

        public LearningGoal GetLearningGoalForUser(int courseID, int entryID, string userID)
        {
            LearningGoal goal = new(entryID, "Backend only title, use the entry title instead");
            goal.Requirements = GetGoalRequirements(entryID);
            foreach (GoalRequirement requirement in goal.Requirements)
            {
                goal.Results.Add(GetGoalRequirementResult(requirement, userID));
            };
            return goal;
        }

        public List<LearningGoal> GetLearningGoalsForTile(int tileID)
        {
            List<LearningGoal> goals = new();

            using SQLiteDataReader r = Query(
                    DatabaseQueries.QUERY_TILE_LEARNING_GOALS,
                    new SQLiteParameter("tileID", tileID)
                );
            while (r.Read())
            {
                goals.Add(new(r.GetInt32(0), r.GetValue(1).ToString()));
            }

            return goals;
        }


        public bool GetGoalRequirementResult(GoalRequirement requirement, string userID)
        {
            using SQLiteDataReader r = Query(
                    DatabaseQueries.QUERY_ASSIGNMENT_GRADE,
                    new SQLiteParameter("assignmentID", requirement.AssignmentID),
                    new SQLiteParameter("userID", userID)
                );

            if (r.Read())
            {
                double grade = r.GetDouble(0);
                return requirement.Expression switch
                {
                    LogicalExpressions.NotEqual => grade != requirement.Value,
                    LogicalExpressions.Less => grade < requirement.Value,
                    LogicalExpressions.LessEqual => grade <= requirement.Value,
                    LogicalExpressions.Equal => grade == requirement.Value,
                    LogicalExpressions.GreaterEqual => grade > requirement.Value,
                    LogicalExpressions.Greater => grade >= requirement.Value,
                    _ => throw new InvalidOperationException("Invalid logical expression")
                };
            }

            return false;
        }

        public AssignmentSubmission GetAssignmentSubmissionForUser(
            int courseID,
            int entryID,
            string userID
        )
        {
            int goal = GetUserGoalGrade(courseID, userID, GetCurrentSyncID(courseID));
            PeerComparisonData comparison = GetUserPeerComparison(courseID, goal, Comparison_Component_Types.assignment, entryID);
            AppAssignment ass = GetAssignment(courseID, entryID);

            using (
                SQLiteDataReader r = Query(
                    DatabaseQueries.QUERY_USER_SUBMISSION_FOR_ENTRY_FOR_USER,
                    new SQLiteParameter("entryID", entryID),
                    new SQLiteParameter("userID", userID)
                )
            )
            {
                if (r.Read())
                {
                    return new(
                        r.GetInt32(0),
                        r.GetInt32(1),
                        r.GetValue(2).ToString(),
                        new AppGrades(
                            r.GetDouble(3),
                            comparison.Average,
                            comparison.Minimum,
                            comparison.Maximum,
                            ass.MaxGrade,
                            ass.GradingType
                        ),
                        r.GetInt64(4)
                    );
                }
            }

            return null;
        }

        public PeerGroup GetPeerGroup(int courseID)
        {
            PeerGroup group = null;

            using (
                SQLiteDataReader r = Query(
                    DatabaseQueries.QUERY_PEER_GROUP_FOR_COURSE,
                    new SQLiteParameter("courseID", courseID)
                )
            )
            {
                if (r.Read())
                {
                    group = new PeerGroup(r.GetInt32(0));
                }
            }

            return group;
        }

        public PublicInformedConsent GetPublicInformedConsent(int courseID)
        {
            PublicInformedConsent consent = null;

            using (
                SQLiteDataReader r = Query(
                    DatabaseQueries.QUERY_CONSENT_FOR_COURSE,
                    new SQLiteParameter("courseID", courseID)
                )
            )
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

        public void UpdateInformedConsent(int courseID, string text, long syncID)
        {
            NonQuery(
                DatabaseQueries.UPDATE_CONSENT_FOR_COURSE,
                new SQLiteParameter("courseID", courseID),
                new SQLiteParameter("text", text)
            );

            // Then we remove consent from all students

            // First we find all their ids and save them in a list
            List<int> consentedStudentIds = new List<int>();
            using (
                SQLiteDataReader r = Query(
                    DatabaseQueries.QUERY_CONSENTED_STUDENTS_FOR_COURSE,
                    new SQLiteParameter("courseID", courseID),
                    new SQLiteParameter("syncID", syncID)
                )
            )
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

        public void UpdateNotificationDates(int courseID,
                                            bool isRange,
                                            string selectedDays,
                                            string selectedDates)
        {
            NonQuery(
                DatabaseQueries.UPDATE_NOTIFICATION_DATES_FOR_COURSE,
                new SQLiteParameter("courseID", courseID),
                new SQLiteParameter("isRange", isRange),
                new SQLiteParameter("selectedDays", selectedDays),
                new SQLiteParameter("selectedDates", selectedDates)
            );
        }

        public void UpdateCoursePeerGroups(int courseID, int groupSize)
        {
            NonQuery(
                DatabaseQueries.UPDATE_PEER_GROUP_FOR_COURSE,
                new SQLiteParameter("courseID", courseID),
                new SQLiteParameter("groupSize", groupSize)
            );
        }

        public Dictionary<int, double> GetUserEntryGrades(int courseID, string userID)
        {
            Dictionary<int, double> grades = new();

            using (
                SQLiteDataReader r = Query(
                    DatabaseQueries.QUERY_COURSE_SUBMISSIONS_FOR_STUDENT,
                    new SQLiteParameter("courseID", courseID),
                    new SQLiteParameter("userID", userID)
                )
            )
            {
                while (r.Read())
                {
                    try
                    {
                        // We save all the retrieved grades in a dictionary with
                        // the assignment.id as key and a list of grades as value
                        grades.Add(r.GetInt32(1), r.GetDouble(3));
                    }
                    catch (Exception e)
                    {
                        PrintQueryError("GetUserAssignmentGrades", 3, r, e);
                    }
                }
            }
            return grades;
        }

        public int GetDiscussionCountForUser(int courseID, string userID)
        {

            using (
                SQLiteDataReader r = Query(
                    DatabaseQueries.QUERY_DISCUSSIONS_COUNTER_FOR_USER,
                    new SQLiteParameter("courseID", courseID),
                    new SQLiteParameter("userID", userID)
                )
            )
            {
                if (r.Read())
                {
                    return r.GetInt32(0);
                }

            }

            return 0;
        }

        public int GetDiscussionCountForUserForEntry(int contentID, string userID)
        {

            using (
                SQLiteDataReader r = Query(
                    DatabaseQueries.QUERY_DISCUSSIONS_COUNTER_FOR_USER_FOR_ENTRY,
                    new SQLiteParameter("discussionID", contentID),
                    new SQLiteParameter("userID", userID)
                )
            )
            {
                if (r.Read())
                {
                    return r.GetInt32(0);
                }

            }

            return 0;
        }

        public PeerComparisonData GetUserPeerComparison(
            int courseID,
            long goalGrade,
            Comparison_Component_Types componentType,
            int componentID,
            long syncID = 0
        )
        {
            long activeSync = syncID == 0 ? this.GetCurrentSyncID(courseID) : syncID;
            if (activeSync == 0)
                return null;


            using (
                SQLiteDataReader r = Query(
                    DatabaseQueries.QUERY_PEER_GROUP_RESULTS,
                    new SQLiteParameter("goalGrade", goalGrade),
                    new SQLiteParameter("componentType", componentType),
                    new SQLiteParameter("componentID", componentID),
                    new SQLiteParameter("syncID", activeSync)
                )
            )
            {
                if (r.Read())
                {
                    try
                    {
                        return new(componentID, r.GetDouble(0), r.GetDouble(1), r.GetDouble(2));
                    }
                    catch (Exception e)
                    {
                        PrintQueryError("GetUserPeerComparison2", 3, r, e);
                    }
                }
            }
            return new(componentID, 0, 0, 0);
        }

        public List<PredictedGrade> GetPredictedGrades(int courseID, string userID)
        {
            List<PredictedGrade> predictions = new();

            using (
                SQLiteDataReader r = Query(
                    DatabaseQueries.QUERY_PREDICTED_GRADES_FOR_USER,
                    new SQLiteParameter("courseID", courseID),
                    new SQLiteParameter("userID", userID)
                )
            )
            {
                while (r.Read())
                {
                    PredictedGrade prediction = new(userID, r.GetInt64(1), r.GetDouble(0));
                    predictions.Add(prediction);
                }
            }

            return predictions;
        }

        // TODO: probably switch to using grades version of submissions instead of Grade.
        public List<AssignmentSubmission> GetTileSubmissionsForUser(
            int courseID,
            string userID,
            long syncID = 0
        )
        {
            List<AssignmentSubmission> submissions = new();

            using (
                SQLiteDataReader r1 = Query(
                    DatabaseQueries.QUERY_COURSE_SUBMISSIONS_FOR_STUDENT,
                    new SQLiteParameter("userID", userID),
                    new SQLiteParameter("courseID", courseID)
                )
            )
            {
                while (r1.Read())
                {
                    AssignmentSubmission submission =
                        new(
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
            long syncID = 0
        )
        {
            long activeSync = syncID == 0 ? this.GetCurrentSyncID(courseID) : syncID;
            if (activeSync == 0)
                return new Dictionary<int, List<List<object>>>();

            Dictionary<int, List<List<object>>> comparisson_history = new();

            using (
                SQLiteDataReader r1 = Query(
                    DatabaseQueries.QUERY_GRADE_COMPARISSON_HISTORY,
                    new SQLiteParameter("courseID", courseID),
                    new SQLiteParameter("Grade", GetUserGoalGrade(courseID, userID, syncID)),
                    new SQLiteParameter("userID", userID)
                )
            )
            {
                try
                {
                    // Initialize last elements
                    double last_user_avg = -1; //user
                    double last_peer_avg = -1; //avg
                    double last_peer_max = -1; //Max
                    double last_peer_min = -1; //min

                    while (r1.Read())
                    {
                        // Initialize varaibles with the values to be put inside the lists
                        int tile_id = r1.GetInt32(0); //tile
                        double user_avg = r1.GetDouble(1); //user
                        double peer_avg = r1.GetDouble(2); //avg
                        double peer_max = r1.GetDouble(3); //Max
                        double peer_min = r1.GetDouble(4); //min

                        DateTime labelDate = new DateTime(1970, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc);
                        labelDate = labelDate.AddMilliseconds(
                            long.Parse(r1.GetValue(5).ToString())
                        );
                        string label = String.Format("{0:dd/MM/yyyy}", labelDate); //sync_hash

                        // If this entry is different than the last, we add it
                        if (
                            last_user_avg != user_avg
                            || last_peer_avg != peer_avg
                            || last_peer_max != peer_max
                            || last_peer_min != peer_min
                        )
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

        public List<LearningGoal> GetGoals(int courseID, bool autoLoadRequirements = false)
        {
            List<LearningGoal> goals = new();

            using (
                SQLiteDataReader r = Query(
                    DatabaseQueries.QUERY_LEARNING_GOALS,
                    new SQLiteParameter("courseID", courseID)
                )
            )
            {
                while (r.Read())
                {
                    try
                    {
                        goals.Add(new LearningGoal(r.GetInt32(0), r.GetValue(1).ToString()));
                    }
                    catch (Exception e)
                    {
                        PrintQueryError("GetGoals", 2, r, e);
                    }
                }
            }

            foreach (LearningGoal g in goals)
            {
                if (autoLoadRequirements)
                    g.Requirements = GetGoalRequirements(g.ID);
            }
            return goals;
        }

        public List<LearningGoal> GetGoals(int courseID, int tileID)
        {
            List<LearningGoal> goals = new();
            using (
                SQLiteDataReader r = Query(
                    DatabaseQueries.QUERY_TILE_LEARNING_GOALS,
                    new SQLiteParameter("tileID", tileID)
                )
            )
            {
                while (r.Read())
                {
                    try
                    {
                        goals.Add(new LearningGoal(r.GetInt32(0), r.GetValue(1).ToString()));
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
            using (
                SQLiteDataReader r = Query(
                    DatabaseQueries.QUERY_LEARNING_GOAL,
                    new SQLiteParameter("goalID", id)
                )
            )
            {
                if (r.Read())
                {
                    try
                    {
                        goal = new LearningGoal(id, r.GetValue(0).ToString());
                    }
                    catch (Exception e)
                    {
                        PrintQueryError("GetGoals", 0, r, e);
                    }
                }
            }
            return goal;
        }

        public void CreateGoal(int courseID, LearningGoal goal)
        {
            NonQuery(
                DatabaseQueries.REGISTER_LEARNING_GOAL,
                new SQLiteParameter("courseID", courseID),
                new SQLiteParameter("title", goal.Title)
            );
        }

        public void UpdateGoal(int courseID, LearningGoal goal)
        {
            NonQuery(
                DatabaseQueries.UPDATE_LEARNING_GOAL,
                new SQLiteParameter("goalID", goal.ID),
                new SQLiteParameter("courseID", courseID),
                new SQLiteParameter("title", goal.Title)
            );
        }

        public void DeleteGoal(int courseID, LearningGoal goal)
        {
            goal.Requirements = GetGoalRequirements(goal.ID);

            DeleteGoalRequirements(goal.ID);
            goal.Requirements.Clear();

            NonQuery(DatabaseQueries.DELETE_LEARNING_GOAL, new SQLiteParameter("goalID", goal.ID));
        }

        public void DeleteGoal(int courseID, int id)
        {
            LearningGoal goal = GetGoal(courseID, id);
            if (goal == null)
                return;

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

        public void CreateGoalRequirement(GoalRequirement requirement)
        {
            NonQuery(
                DatabaseQueries.REGISTER_GOAL_REQUIREMENT,
                new SQLiteParameter("goalID", requirement.GoalID),
                new SQLiteParameter("assignmentID", requirement.AssignmentID),
                new SQLiteParameter("expresson", requirement.Expression),
                new SQLiteParameter("value", requirement.Value)
            );
        }

        public void UpdateGoalRequirement(GoalRequirement requirement)
        {
            NonQuery(
                DatabaseQueries.UPDATE_LEARNING_GOAL_REQUIREMENT,
                new SQLiteParameter("requirementID", requirement.ID),
                new SQLiteParameter("assignmentID", requirement.AssignmentID),
                new SQLiteParameter("expression", requirement.Expression),
                new SQLiteParameter("value", requirement.Value)
            );
        }

        public void DeleteGoalRequirements(int goalID)
        {
            NonQuery(
                DatabaseQueries.DELETE_GOAL_REQUIREMENTS,
                new SQLiteParameter("goalID", goalID)
            );
        }

        public void DeleteGoalRequirement(int requirementID)
        {
            NonQuery(
                DatabaseQueries.DELETE_GOAL_REQUIREMENT,
                new SQLiteParameter("requirementID", requirementID)
            );
        }

        public List<GoalRequirement> GetGoalRequirements(int goalID)
        {
            List<GoalRequirement> requirements = new();

            using (
                SQLiteDataReader r = Query(
                    DatabaseQueries.QUERY_GOAL_REQUIREMENTS,
                    new SQLiteParameter("goalID", goalID)
                )
            )
            {
                while (r.Read())
                {
                    requirements.Add(
                        new GoalRequirement(
                            r.GetInt32(0),
                            r.GetInt32(1),
                            r.GetInt32(2),
                            r.GetInt32(3),
                            r.GetDouble(4)
                        )
                    );
                }
            }

            return requirements;
        }

        public void RegisterNotification(
            int courseID,
            string userID,
            int tileID,
            int status,
            long syncID = 0
        )
        {
            long activeSync = syncID == 0 ? this.GetCurrentSyncID(courseID) : syncID;

            NonQuery(
                DatabaseQueries.REGISTER_USER_NOTIFICATIONS,
                new SQLiteParameter("userID", userID),
                new SQLiteParameter("tileID", tileID),
                new SQLiteParameter("status", status),
                new SQLiteParameter("syncID", activeSync)
            );
        }

        public List<Notification> GetAllNotifications(int courseID)
        {
            string activeSync = String.Join("', '", this.GetRecentSyncs(courseID, 2));

            // TODO: not sure how to write this as sqliteparameters
            string query = String.Format(DatabaseQueries.QUERY_ALL_NOTIFICATIONS, activeSync);

            List<Notification> notifications = new();

            using (SQLiteDataReader r = Query(query))
            {
                while (r.Read())
                {
                    try
                    {
                        notifications.Add(
                            new Notification(
                                r.GetValue(0).ToString(),
                                r.GetInt32(1),
                                r.GetInt32(2),
                                r.GetBoolean(3)
                            )
                        );
                    }
                    catch (Exception e)
                    {
                        PrintQueryError("GetAllNotifications", 3, r, e);
                    }
                }
            }

            return notifications;
        }

        public Notifications GetAllUserNotifications(int courseID, string userID, long syncID = 0)
        {
            long activeSync = syncID == 0 ? this.GetCurrentSyncID(courseID) : syncID;

            Notifications notifications = new();

            using (
                SQLiteDataReader r = Query(
                    DatabaseQueries.QUERY_ALL_USER_NOTIFICATIONS,
                    new SQLiteParameter("userID", userID),
                    new SQLiteParameter("syncID", activeSync)
                )
            )
            {
                while (r.Read())
                {
                    Notification_Types status = (Notification_Types)r.GetInt32(1);
                    switch (status)
                    {
                        case Notification_Types.outperforming:
                            notifications.Outperforming.Add(
                                new Notification(
                                    userID,
                                    r.GetInt32(0),
                                    r.GetInt32(1),
                                    r.GetBoolean(2)
                                )
                            );
                            break;
                        case Notification_Types.closing_gap:
                            notifications.Closing.Add(
                                new Notification(
                                    userID,
                                    r.GetInt32(0),
                                    r.GetInt32(1),
                                    r.GetBoolean(2)
                                )
                            );
                            break;
                        case Notification_Types.falling_behind:
                            notifications.Falling.Add(
                                new Notification(
                                    userID,
                                    r.GetInt32(0),
                                    r.GetInt32(1),
                                    r.GetBoolean(2)
                                )
                            );
                            break;
                        case Notification_Types.more_effort:
                            notifications.Effort.Add(
                                new Notification(
                                    userID,
                                    r.GetInt32(0),
                                    r.GetInt32(1),
                                    r.GetBoolean(2)
                                )
                            );
                            break;
                    }
                }
            }

            return notifications;
        }

        public List<Notification> GetPendingNotifications(
            int courseID,
            string userID,
            long syncID = 0
        )
        {
            long activeSync = syncID == 0 ? this.GetCurrentSyncID(courseID) : syncID;

            List<Notification> notifications = new();

            using (
                SQLiteDataReader r = Query(
                    DatabaseQueries.QUERY_PENDING_USER_NOTIFICATIONS,
                    new SQLiteParameter("userID", userID),
                    new SQLiteParameter("syncID", activeSync)
                )
            )
            {
                while (r.Read())
                {
                    notifications.Add(
                        new Notification(userID, r.GetInt32(0), r.GetInt32(1), false)
                    );
                }
            }

            return notifications;
        }

        public void MarkNotificationsSent(int courseID, string userID, long syncID = 0)
        {
            long activeSync = syncID == 0 ? this.GetCurrentSyncID(courseID) : syncID;

            NonQuery(
                DatabaseQueries.QUERY_MARK_NOTIFICATIONS_SENT,
                new SQLiteParameter("courseID", courseID),
                new SQLiteParameter("userID", userID),
                new SQLiteParameter("syncID", activeSync)
            );
        }

        public List<TileEntry> GetAllTileEntries(int courseID)
        {
            List<TileEntry> entries = new();

            using (
                SQLiteDataReader r = Query(
                    DatabaseQueries.QUERY_ALL_TILE_ENTRIES,
                    new SQLiteParameter("courseID", courseID)
                )
            )
            {
                while (r.Read())
                {
                    try
                    {
                        // TODO: Title??
                        entries.Add(
                            new TileEntry(
                                r.GetInt32(0),
                                r.GetInt32(1),
                                "This is another title",
                                r.GetDouble(2)
                            )
                        );
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
            NonQuery(
                DatabaseQueries.REGISTER_TILE_ENTRY,
                new SQLiteParameter("tileID", entry.TileID),
                new SQLiteParameter("content_id", entry.ContentID),
                new SQLiteParameter("weight", entry.Weight)
            );
        }

        public void CreateTileEntries(int tileID, List<TileEntry> entries)
        {
            foreach (TileEntry entry in entries)
                NonQuery(
                    DatabaseQueries.REGISTER_TILE_ENTRY,
                    new SQLiteParameter("tileID", tileID),
                    new SQLiteParameter("contentID", entry.ContentID),
                    new SQLiteParameter("weight", entry.Weight)
                );
        }

        public void DeleteAllTileEntries(int tileID)
        {
            NonQuery(
                DatabaseQueries.DELETE_ALL_TILE_ENTRIES_OF_TILE,
                new SQLiteParameter("tileID", tileID)
            );
        }

        public void DeleteTileEntry(int entryID)
        {
            NonQuery(DatabaseQueries.DELETE_TILE_ENTRY, new SQLiteParameter("contentID", entryID));
        }

        /////////////////////////////////////////////////////////////////////////////////
        //////////////////////////         ACCEPT LIST         //////////////////////////
        /////////////////////////////////////////////////////////////////////////////////


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
                ))
            {
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

        /////////////////////////////////////////////////////////////////////////////////
        //////////////////////////         END OF LIST         //////////////////////////
        /////////////////////////////////////////////////////////////////////////////////

        public List<string> GetEntryMetaKeys(int submissionID)
        {
            List<string> keys = new();

            using (
                SQLiteDataReader r = Query(
                    DatabaseQueries.QUERY_TILE_ENTRY_META_KEYS,
                    new SQLiteParameter("submissionID", submissionID)
                )
            )
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

            using (
                SQLiteDataReader r = Query(
                    DatabaseQueries.QUERY_TILE_ENTRY_SUBMISSION_META,
                    new SQLiteParameter("submissionID", submissionID)
                )
            )
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
            NonQuery(
                DatabaseQueries.UPDATE_TILE,
                new SQLiteParameter("tileID", tile.ID),
                new SQLiteParameter("groupID", tile.GroupID),
                new SQLiteParameter("title", tile.Title),
                new SQLiteParameter("order", tile.Order),
                new SQLiteParameter("type", (int)tile.Type),
                new SQLiteParameter("weight", tile.Weight),
                new SQLiteParameter("gradingType", (int)tile.GradingType),
                new SQLiteParameter("alt", tile.Alt),
                new SQLiteParameter("visible", tile.Visible),
                new SQLiteParameter("notifications", tile.Notifications)
            );
        }

        public void UpdateTileOrder(int[] tileIDs)
        {
            for (int i = 0; i < tileIDs.Length; i++)
            {
                NonQuery(
                    DatabaseQueries.UPDATE_TILE_ORDER,
                    new SQLiteParameter("tileID", tileIDs[i]),
                    new SQLiteParameter("order", i)
                );
            }
        }

        public List<Tile> GetTiles(int courseID, bool autoLoadEntries = false)
        {
            List<Tile> tiles = new();

            using (
                SQLiteDataReader r = Query(
                    DatabaseQueries.QUERY_TILES,
                    new SQLiteParameter("courseID", courseID)
                )
            )
            {
                while (r.Read())
                {
                    try
                    {
                        Tile row =
                            new(
                                r.GetInt32(0),
                                r.GetInt32(1),
                                r.GetValue(2).ToString(),
                                r.GetInt32(3),
                                (TileType)r.GetInt32(4),
                                r.GetDouble(5),
                                (AppGradingType)r.GetInt32(6),
                                r.GetBoolean(7),
                                r.GetBoolean(8),
                                r.GetBoolean(9)
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

        public List<Tile> GetGroupTiles(int courseID, string groupID, bool autoLoadEntries = false)
        {
            List<Tile> tiles = new();

            using (
                SQLiteDataReader r = Query(
                    DatabaseQueries.QUERY_TILES_FOR_GROUP,
                    new SQLiteParameter("courseID", courseID),
                    new SQLiteParameter("groupID", groupID)
                )
            )
            {
                while (r.Read())
                {
                    try
                    {
                        Tile row =
                            new(
                                r.GetInt32(0),
                                r.GetInt32(1),
                                r.GetValue(2).ToString(),
                                r.GetInt32(3),
                                (TileType)r.GetInt32(4),
                                r.GetDouble(5),
                                (AppGradingType)r.GetInt32(6),
                                r.GetBoolean(7),
                                r.GetBoolean(8),
                                r.GetBoolean(9)
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

        public void CreateLayoutTileGroup(int courseID, string title, int position)
        {
            // List<LayoutColumn> cols = this.GetLayoutColumns(courseID);
            // if (cols.Count < 1) return;

            NonQuery(
                DatabaseQueries.REGISTER_TILE_GROUP,
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
            int order
        )
        {
            NonQuery(
                DatabaseQueries.UPDATE_TILE_GROUP,
                new SQLiteParameter("columnID", columnID),
                new SQLiteParameter("title", title),
                new SQLiteParameter("order", order),
                new SQLiteParameter("groupID", tileGroupID)
            );

            return GetLayoutTileGroup(courseID, tileGroupID);
        }

        public void UpdateTileGroupOrder(int[] tileGroupIDs)
        {
            for (int i = 0; i < tileGroupIDs.Length; i++)
            {
                NonQuery(
                    DatabaseQueries.UPDATE_TILE_GROUP_ORDER,
                    new SQLiteParameter("groupID", tileGroupIDs[i]),
                    new SQLiteParameter("order", i)
                );
            }
        }

        public void DeleteLayoutTileGroup(int groupID)
        {
            NonQuery(DatabaseQueries.DELETE_TILE_GROUP, new SQLiteParameter("groupID", groupID));
        }

        public LayoutTileGroup GetLayoutTileGroup(int courseID, int groupID)
        {
            using (
                SQLiteDataReader r = Query(
                    DatabaseQueries.QUERY_TILE_GROUP,
                    new SQLiteParameter("courseID", courseID),
                    new SQLiteParameter("groupID", groupID)
                )
            )
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

            using (
                SQLiteDataReader r = Query(
                    DatabaseQueries.QUERY_TILE_GROUPS,
                    new SQLiteParameter("courseID", courseID)
                )
            )
            {
                while (r.Read())
                {
                    try
                    {
                        LayoutTileGroup row =
                            new(
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

        public double GetTileAVG(int tileID, string userID, int courseID)
        {
            long syncID = this.GetCurrentSyncID(courseID);
            using (
                SQLiteDataReader r = Query(
                    DatabaseQueries.QUERY_TILE_GRADE,
                    new SQLiteParameter("tileID", tileID),
                    new SQLiteParameter("userID", userID),
                    new SQLiteParameter("syncID", syncID)
                )
            )
            {
                if (r.Read())
                {
                    try
                    {
                        return r.GetDouble(0);
                    }
                    catch (Exception e)
                    {
                        PrintQueryError("GetLayoutTileGroups", 3, r, e);
                    }
                }
            }
            return -1;

        }

        public (int max, AppGradingType type) GetTileMax(int tileID, int courseID)
        {
            using (
                SQLiteDataReader r = Query(
                    DatabaseQueries.QUERY_TILE_GRADE_MAX_AND_TYPE,
                    new SQLiteParameter("tileID", tileID),
                    new SQLiteParameter("courseID", courseID)
                )
            )
            {
                if (r.Read())
                {
                    return (Convert.ToInt32(r.GetDouble(0)), (AppGradingType)r.GetInt32(1));
                }
            }
            return (-1, AppGradingType.Points);
        }

        public UserTileGrades[] GetAllTileGrades(int courseID)
        {
            List<User> students = GetUsersWithSettings(courseID);
            return students.Select((student) => new UserTileGrades(
                student.UserID,
                student.Settings.GoalGrade,
                GetUserTileAVGs(student.UserID, courseID).ToArray()
            )

             ).ToArray();

        }

        public List<TilesGrades> GetUserTileAVGs(string userID, int courseID)
        {
            long syncID = this.GetCurrentSyncID(courseID);
            List<TilesGrades> avgs = new();
            using (
                SQLiteDataReader r = Query(
                    DatabaseQueries.QUERY_TILE_GRADES,
                    new SQLiteParameter("userID", userID),
                    new SQLiteParameter("syncID", syncID)
                )
            )
            {
                while (r.Read())
                {
                    try
                    {
                        avgs.Append(new(r.GetInt32(1), r.GetDouble(0), -1));
                    }
                    catch (Exception e)
                    {
                        PrintQueryError("GetLayoutTileGroups", 3, r, e);
                    }
                }
            }
            foreach (TilesGrades grades in avgs)
            {
                grades.max = GetTileMax(grades.tile_id, courseID).max;
            }
            return avgs;

        }

        public AppGrades GetTileGrade(int tileID, string userID, int courseID)
        {
            double tileGrade = GetTileAVG(tileID, userID, courseID);
            (int max, AppGradingType type) = GetTileMax(tileID, courseID);

            long syncID = this.GetCurrentSyncID(courseID);
            using (
                SQLiteDataReader r = Query(
                    DatabaseQueries.QUERY_TILE_PEER_GRADES,
                    new SQLiteParameter("tileID", tileID),
                    new SQLiteParameter("userID", userID),
                    new SQLiteParameter("type", Comparison_Component_Types.tile),
                    new SQLiteParameter("syncID", syncID)
                )
            )
            {
                if (r.Read())
                {
                    try
                    {
                        return new(
                            tileGrade,
                            r.GetDouble(0),
                            r.GetDouble(1),
                            r.GetDouble(2),
                            max,
                            type
                        );
                    }
                    catch (Exception e)
                    {
                        PrintQueryError("GetLayoutTileGroups", 3, r, e);
                    }
                }
            }

            return null;
        }

        public Dictionary<int, AppAssignment> GetAssignmentsMap(int courseID)
        {
            Dictionary<int, AppAssignment> assignments = new();

            using (
                SQLiteDataReader r = Query(
                    DatabaseQueries.QUERY_COURSE_ASSIGNMENTS,
                    new SQLiteParameter("courseID", courseID)
                )
            )
            {
                while (r.Read())
                {
                    try
                    {
                        AppAssignment row =
                            new(
                                r.GetInt32(0),
                                r.GetInt32(1),
                                r.GetValue(2).ToString(),
                                r.GetInt32(3),
                                r.GetBoolean(4),
                                r.GetBoolean(5),
                                r.GetInt64(6),
                                r.GetDouble(7),
                                (AppGradingType)r.GetInt32(8)
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

        public AppAssignment GetAssignment(int courseID, int internalID)
        {
            using (
                SQLiteDataReader r = Query(
                    DatabaseQueries.QUERY_ASSIGNMENT,
                    new SQLiteParameter("courseID", courseID),
                    new SQLiteParameter("internalID", internalID)
                )
            )
            {
                if (r.Read())
                {
                    try
                    {
                        return new(
                                r.GetInt32(0),
                                r.GetInt32(1),
                                r.GetValue(2).ToString(),
                                r.GetInt32(3),
                                r.GetBoolean(4),
                                r.GetBoolean(5),
                                r.GetInt64(6),
                                r.GetDouble(7),
                                (AppGradingType)r.GetInt32(8)
                            );
                    }
                    catch (Exception e)
                    {
                        PrintQueryError("GetAssignments", 9, r, e);
                    }
                }
            }

            return null;
        }

        public List<AppDiscussionTopic> GetDiscussions(int courseID)
        {
            List<AppDiscussionTopic> discussions = new();

            using (
                SQLiteDataReader r = Query(
                    DatabaseQueries.QUERY_COURSE_TOPICS,
                    new SQLiteParameter("courseID", courseID)
                )
            )
            {
                while (r.Read())
                {
                    AppDiscussionTopic row =
                        new(
                            r.GetInt32(0),
                            courseID,
                            r.GetValue(1).ToString(),
                            r.GetValue(2).ToString(),
                            r.GetInt32(3),
                            r.GetValue(4).ToString(),
                            new List<AppDiscussionEntry>() { }
                        );
                    discussions.Add(row);
                }
            }

            return discussions;
        }
        public List<AppDiscussionEntry> GetUserDiscussionEntries(int courseID, string userID)
        {
            List<AppDiscussionEntry> discussions = new();

            using (
                SQLiteDataReader r = Query(
                    DatabaseQueries.QUERY_COURSE_DISCUSSION_ENTRIES_FOR_USER,
                    new SQLiteParameter("courseID", courseID),
                    new SQLiteParameter("userID", userID)
                )
            )
            {
                while (r.Read())
                {
                    AppDiscussionEntry row =
                        new(
                            r.GetInt32(0),
                            r.GetInt32(1),
                            r.GetInt32(2),
                            courseID,
                            r.GetValue(3).ToString(),
                            r.GetInt32(4),
                            r.GetValue(5).ToString()
                        );
                    discussions.Add(row);
                }
            }

            return discussions;
        }

        public AppDiscussionTopic GetTopicGradesForUser(int courseID, int contentID, string userID)
        {
            int goal = GetUserGoalGrade(courseID, userID, GetCurrentSyncID(courseID));
            int grade = GetDiscussionCountForUserForEntry(contentID, userID);
            PeerComparisonData comparison = GetUserPeerComparison(courseID, goal, Comparison_Component_Types.discussion, contentID);

            using (
                SQLiteDataReader r = Query(
                    DatabaseQueries.QUERY_TOPIC_FOR_USER,
                    new SQLiteParameter("courseID", courseID),
                    new SQLiteParameter("contentID", contentID)
                )
            )
            {
                if (r.Read())
                {
                    int max = r.GetInt32(5);
                    max = max == 0 ? 1 : max;
                    return new(
                        r.GetInt32(0),
                        courseID,
                        r.GetValue(1).ToString(),
                        r.GetValue(2).ToString(),
                        r.GetInt32(3),
                        r.GetValue(4).ToString(),
                        new AppGrades(
                               100 * grade / max,
                             100 * comparison.Minimum / max,
                             100 * comparison.Average / max,
                             100 * comparison.Maximum / max,
                                 max,
                                 AppGradingType.Points
                        )
                    );
                }
            }

            return null;
        }

        public List<LayoutColumn> GetLayoutColumns(int courseID)
        {
            List<LayoutColumn> layoutList = new List<LayoutColumn>();

            using (
                SQLiteDataReader r2 = Query(
                    DatabaseQueries.QUERY_LAYOUT_COLUMNS,
                    new SQLiteParameter("courseID", courseID)
                )
            )
            {
                while (r2.Read())
                {
                    try
                    {
                        layoutList.Add(
                            new LayoutColumn(
                                r2.GetInt32(0),
                                r2.GetInt32(1),
                                r2.GetInt32(2),
                                new List<int>()
                            )
                        );
                    }
                    catch (Exception e)
                    {
                        PrintQueryError("GetLayoutColumn", 2, r2, e);
                    }
                }
            }

            foreach (LayoutColumn lcolumn in layoutList)
                using (
                    SQLiteDataReader r = Query(
                        DatabaseQueries.QUERY_ALL_TILE_GROUPS_IN_LAYOUT_COLUMN,
                        new SQLiteParameter("columnID", lcolumn.ID)
                    )
                )
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

        public void DeleteAllLayoutColumns(int courseID)
        {
            NonQuery(
                DatabaseQueries.RELEASE_ALL_COURSE_TILE_GROUPS_FROM_COLUMNS,
                new SQLiteParameter("courseID", courseID)
            );
            NonQuery(
                DatabaseQueries.DELETE_ALL_LAYOUT_COLUMNS,
                new SQLiteParameter("courseID", courseID)
            );
        }

        public void CreateLayoutColumns(List<LayoutColumn> layoutColumns, int courseID)
        {
            foreach (LayoutColumn column in layoutColumns)
            {
                int id = IDNonQuery(
                    DatabaseQueries.REGISTER_LAYOUT_COLUMN,
                    new SQLiteParameter("courseID", courseID),
                    new SQLiteParameter("size", column.Width),
                    new SQLiteParameter("order", column.Position)
                );

                if (column.TileGroups != null)
                    foreach (int groupID in column.TileGroups)
                    {
                        NonQuery(
                            DatabaseQueries.TIE_TILE_GROUP_TO_COLUMN,
                            new SQLiteParameter("columnID", id),
                            new SQLiteParameter("groupID", groupID)
                        );
                    }
            }
        }

        public Tile GetTile(int courseID, int tileID, bool autoLoadEntries = false)
        {
            Tile tile;
            using (
                SQLiteDataReader r = Query(
                    DatabaseQueries.QUERY_TILE,
                    new SQLiteParameter("courseID", courseID),
                    new SQLiteParameter("tileID", tileID)
                )
            )
            {
                if (r.Read())
                {
                    tile = new(
                                        r.GetInt32(0),
                                        r.GetInt32(1),
                                        r.GetValue(2).ToString(),
                                        r.GetInt32(3),
                                        (TileType)r.GetInt32(4),
                                        r.GetDouble(5),
                                        (AppGradingType)r.GetInt32(6),
                                        r.GetBoolean(7),
                                        r.GetBoolean(8),
                                        r.GetBoolean(9)
                                    );
                    if (autoLoadEntries)
                    {
                        tile.Entries = GetTileEntries(tile.ID);
                    }
                    return tile;
                }
            }

            return null;
        }

        public void CreateTile(
            Tile tile
        )
        {
            int id = IDNonQuery(
                DatabaseQueries.REGISTER_TILE,
                new SQLiteParameter("groupID", tile.GroupID),
                new SQLiteParameter("title", tile.Title),
                new SQLiteParameter("order", tile.Order),
                new SQLiteParameter("type", tile.Type),
                new SQLiteParameter("weight", tile.Weight),
                new SQLiteParameter("gradingType", tile.GradingType),
                new SQLiteParameter("alt", tile.Alt),
                new SQLiteParameter("visible", tile.Visible),
                new SQLiteParameter("notifications", tile.Notifications)
            );
        }

        public List<TileEntry> GetTileEntries(int tileID)
        {
            List<TileEntry> entries = new();

            using (
                SQLiteDataReader r = Query(
                    DatabaseQueries.QUERY_ENTRIES_FOR_TILE,
                    new SQLiteParameter("tileID", tileID)
                )
            )
            {
                while (r.Read())
                {
                    entries.Add(
                        new TileEntry(
                            r.GetInt32(0),
                            r.GetInt32(1),
                            r.GetValue(2).ToString(),
                            r.GetDouble(3)
                        )
                    );
                }
            }

            return entries;
        }

        public void DeleteTile(int courseID, int tileID)
        {
            DeleteGoals(courseID, tileID);
            NonQuery(DatabaseQueries.DELETE_TILE, new SQLiteParameter("tileID", tileID));
        }

        public bool GetUserConsent(int courseID, string userID)
        {
            using (
                SQLiteDataReader r = Query(
                    DatabaseQueries.QUERY_CONSENT_FOR_USER,
                    new SQLiteParameter("courseID", courseID),
                    new SQLiteParameter("userID", userID)
                )
            )
            {
                if (r.Read())
                    return r.GetInt32(0) == 1;
            }
            return false;
        }

        public void AddExternalData(int courseID, ExternalData[] entries)
        {
            foreach (ExternalData entry in entries)
            {
                NonQuery(
                    DatabaseQueries.REGISTER_EXTERNALDATA,
                    new SQLiteParameter("courseID", courseID),
                    new SQLiteParameter("tileID", entry.TileID),
                    new SQLiteParameter("title", entry.Title),
                    new SQLiteParameter("Grade", entry.Grade),
                    new SQLiteParameter("userID", entry.UserID)
                );
            }
        }

        public ExternalData[] GetExternalData(int courseID, int tileID, string userID)
        {
            List<ExternalData> submissions = new();

            using (
                SQLiteDataReader r = Query(
                    DatabaseQueries.QUERY_EXTERNALDATA,
                    new SQLiteParameter("courseID", courseID),
                    new SQLiteParameter("tileID", tileID == -1 ? '*' : tileID),
                    new SQLiteParameter("userID", userID == null ? '*' : userID)
                )
            )
            {
                while (r.Read())
                {
                    ExternalData submission =
                        new(
                            courseID,
                            r.GetValue(0).ToString(),
                            tileID,
                            r.GetValue(1).ToString(),
                            r.GetValue(2).ToString()
                        );
                    submissions.Add(submission);
                }
            }

            return submissions.ToArray();
        }

        // public void InsertUserAction(string userID, ActionTypes action, string actionDetail, int courseID)
        // {
        //     int sessionID = 0;
        //     long timestamp = 0;

        //     using SQLiteConnection connection = new(s_instance._connection_string);
        //     try
        //     {
        //         connection.Open();

        //         // Open a transaction to prevent race conditions for the sessionID.
        //         using SQLiteTransaction transaction = connection.BeginTransaction();
        //         {
        //             using SQLiteCommand commandGet = connection.CreateCommand();
        //             {
        //                 commandGet.CommandText = DatabaseQueries.GET_TRACKER_SESSION_ID;
        //                 commandGet.Parameters.Add(new SQLiteParameter("userID", userID));
        //                 commandGet.Parameters.Add(new SQLiteParameter("courseID", courseID));
        //                 commandGet.Transaction = transaction;

        //                 using SQLiteDataReader r = commandGet.ExecuteReader(CommandBehavior.Default);
        //                 {
        //                     if (r.Read())
        //                     {
        //                         sessionID = r.GetInt32(0);
        //                         timestamp = r.GetInt64(1);
        //                     }
        //                 }
        //             }

        //             if (DateTimeOffset.UtcNow.ToUnixTimeSeconds() - timestamp > 1800) // 30 minutes
        //             {
        //                 sessionID++;
        //             }

        //             using SQLiteCommand commandInsert = connection.CreateCommand();
        //             {
        //                 commandInsert.CommandText = DatabaseQueries.INSERT_USER_ACTION;
        //                 commandInsert.Parameters.Add(new SQLiteParameter("userID", userID));
        //                 commandInsert.Parameters.Add(new SQLiteParameter("action", action));
        //                 commandInsert.Parameters.Add(new SQLiteParameter("actionDetail", actionDetail));
        //                 commandInsert.Parameters.Add(new SQLiteParameter("sessionID", sessionID));
        //                 commandInsert.Parameters.Add(new SQLiteParameter("courseID", courseID));
        //                 commandInsert.Transaction = transaction;

        //                 commandInsert.ExecuteNonQuery();
        //             }

        //             transaction.Commit();
        //         }

        //         connection.Close();
        //     }
        //     catch (Exception e)
        //     {
        //         // silently fail
        //         _logger.LogError("Error inserting user action: {message}", e.Message);
        //         connection.Close();
        //     }
        // }

        public void InsertUserAction(string userID, ActionTypes action, string actionDetail, int courseID)
        {
            NonQuery(DatabaseQueries.INSERT_USER_ACTION_TEST,
    new SQLiteParameter("userID", userID),
                new SQLiteParameter("action", action),
                new SQLiteParameter("actionDetail", actionDetail),
                new SQLiteParameter("courseID", courseID)
            );
        }

        public List<UserTracker> RetrieveAllActionsPerCourse(int courseID)
        {
            List<UserTracker> actions = [];

            using SQLiteDataReader r = Query(
                    DatabaseQueries.QUERY_ALL_ACTIONS_PER_COURSE,
                    new SQLiteParameter("courseID", courseID)
                );
            while (r.Read())
            {
                actions.Add(
                    new UserTracker(
                        r.GetInt64(0),
                        r.GetValue(1).ToString(),
                        (ActionTypes)r.GetInt32(2),
                        r.GetValue(3).ToString(),
                        r.GetInt32(4),
                        courseID
                    )
                );
            }

            return actions;
        }

        public ConsentInfo RetrieveAnalyticConsentInfoPerCourse(int courseID)
        {
            long now = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds();
            long lastWeek = now - (7 * 24 * 60 * 60 * 1000);
            List<long> syncs = GetSyncsSince(courseID, lastWeek);
            now = GetCurrentSyncID(courseID);

            if (syncs.Count > 0)
            {
                lastWeek = syncs[0];
            }

            return new(
            CountConsents(courseID, now),
            CountConsents(courseID, lastWeek),
            CountUsers(courseID)
            );
        }
    }
}
