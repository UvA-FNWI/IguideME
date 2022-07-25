using System;
using System.Collections.Generic;
using System.Data.SQLite;
using System.Linq;
using IguideME.Web.Models;
using IguideME.Web.Models.App;
using IguideME.Web.Models.Impl;

namespace IguideME.Web.Services
{
    public sealed class DatabaseManager
    {
        private static DatabaseManager instance;
        private SQLiteConnection connection;
        private static SQLiteCommand command;

        static DatabaseManager() { }

        public static void Initialize(bool isDev = false)
        {
            DatabaseManager.instance = new DatabaseManager();
            DatabaseManager.instance.connection = new SQLiteConnection(
                isDev ? "Data Source=db.sqlite;Version=3;New=False;Compress=True;"
                : "Data Source=/data/IguideME.db;Version=3;New=False;Compress=True;"
            );

            DatabaseManager.instance.connection.Open();
            DatabaseManager.instance.CreateTables();
            DatabaseManager.instance.RunMigrations();
        }

        public static DatabaseManager Instance
        {
            get { return instance; }
        }

        private void CreateTables()
        {
            SQLiteCommand command;

            // collection of all table creation queries
            var queries = new List<string>()
            {
                DatabaseQueries.CREATE_TABLE_COURSE_SETTINGS,
                DatabaseQueries.CREATE_TABLE_CONSENT,
                DatabaseQueries.CREATE_TABLE_PEER_GROUP,
                DatabaseQueries.CREATE_TABLE_GOAL_GRADE,
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
                DatabaseQueries.CREATE_TABLE_GRADE_PREDICTION_MODEL,
                DatabaseQueries.CREATE_TABLE_GRADE_PREDICTION_MODEL_PARAMETER,
                DatabaseQueries.CREATE_TABLE_PREDICTIVE_MODEL,
                DatabaseQueries.CREATE_TABLE_MODEL_THETA,
                DatabaseQueries.CREATE_TABLE_PREDICTED_GRADE,
                DatabaseQueries.CREATE_TABLE_LEARNING_GOALS,
                DatabaseQueries.CREATE_TABLE_GOAL_REQUREMENTS,
                DatabaseQueries.CREATE_TABLE_NOTIFICATIONS,
                DatabaseQueries.CREATE_TABLE_ACCEPT_LIST,
                DatabaseQueries.CREATE_TABLE_MIGRATIONS,
            };

            // create tables if they do not exist
            foreach (var query in queries)
            {
                command = connection.CreateCommand();
                command.CommandText = query;
                command.ExecuteNonQuery();
            }

            //NonQuery("DELETE FROM tile WHERE id=10;");
            NonQuery("DELETE FROM learning_goal;");
            NonQuery("DELETE FROM predictive_model;");
            NonQuery("DELETE FROM predicted_grade;");
            NonQuery("DELETE FROM model_theta;");
            NonQuery("DELETE FROM goal_requirement;");
            NonQuery("DELETE FROM tile WHERE id=12;");
        }

        private void RunMigrations()
        {
            foreach (KeyValuePair<string, string> entry in DatabaseQueries.MIGRATIONS)
            {
                var migration_id = entry.Key;
                if (Query(String.Format(DatabaseQueries.QUERY_MIGRATIONS, migration_id)).HasRows)
                    continue;

                Console.WriteLine("Migration " + migration_id + " not yet applied, proceeding to apply...");

                var migration_sql = entry.Value;
                NonQuery(migration_sql);
                NonQuery(String.Format(DatabaseQueries.CREATE_MIGRATION, migration_id));
            }
        }

        private int NonQuery(string query)
        {
            // execute non query
            command = connection.CreateCommand();
            command.CommandText = query;
            command.ExecuteNonQuery();

            command = connection.CreateCommand();
            command.CommandText = "SELECT last_insert_rowid()";
            int id = int.Parse(command.ExecuteScalar().ToString());
            return id;
        }

        private SQLiteDataReader Query(string query)
        {
            // execute query and return results
            SQLiteDataReader sqlite_datareader;

            command = connection.CreateCommand();
            command.CommandText = query;

            sqlite_datareader = command.ExecuteReader();
            return sqlite_datareader;
        }

        private string GetCurrentHash(int courseID)
        {
            /**
             * Retrieve latest complete synchronization for course. If no 
             * historic synchronization was found then null is returned.
             */
            SQLiteDataReader r = Query(
                String.Format(
                    DatabaseQueries.QUERY_LATEST_SYNC_FOR_COURSE, courseID));

            if (r.Read())
                return r.GetValue(0).ToString();

            return null;
        }

        public bool IsCourseRegistered(int courseID)
        {
            SQLiteDataReader r = Query(
                String.Format(
                    DatabaseQueries.QUERY_DOES_COURSE_EXIST, courseID));

            return (bool)r.Read();
        }

        public void RegisterCourse(int courseID, string courseName)
        {
            /**
             * Create a new course.
             */
            NonQuery(String.Format(DatabaseQueries.INSERT_COURSE,
                courseID,
                courseName));
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
            SQLiteDataReader r = Query(
                String.Format(
                    DatabaseQueries.QUERY_SYNC_HASHES_FOR_COURSE, courseID));
            List<DataSynchronization> hashes = new List<DataSynchronization>();

            while (r.Read())
                hashes.Add(new DataSynchronization(
                    r.GetInt32(0),
                    r.GetInt32(1),
                    r.GetValue(2).ToString(),
                    r.GetValue(3).ToString(),
                    r.GetValue(4).ToString(),
                    r.GetValue(5).ToString()));

            return hashes;
        }

        public int GetMinimumPeerGroupSize(int courseID)
        {
            return 1;
        }

        public bool HasPersonalizedPeers(int courseID)
        {
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
                    submissionType,
                    syncHash));
        }

        public void RegisterDiscussion(
            int? discussionID,
            int courseID,
            int tileID,
            string title,
            string postedBy,
            string postedAt,
            string message,
            string syncHash)
        {

            NonQuery(
                String.Format(
                    DatabaseQueries.REGISTER_CANVAS_DISCUSSION,
                    discussionID,
                    courseID,
                    tileID,
                    title,
                    postedBy,
                    postedAt,
                    message,
                    syncHash));
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
            SQLiteDataReader r = Query(query);

            List<User> users = new List<User>();
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

            SQLiteDataReader r = Query(query);

            if (r.Read())
            {
                return new User(
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

            return null;
        }

        public List<User> GetUsersWithGoalGrade(
            int courseID,
            int goalGrade,
            string hash = null)
        {
            string activeHash = hash != null ? hash : this.GetCurrentHash(courseID);
            if (activeHash == null) new List<User> { };

            string query = String.Format(
                DatabaseQueries.QUERY_USERS_WITH_GOAL_GRADE,
                courseID,
                activeHash,
                goalGrade);

            SQLiteDataReader r = Query(query);
            List<User> users = new List<User>();

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

            return users;
        }

        public int CreateGradePredictionModel(int courseID)
        {
            return NonQuery(
                String.Format(
                    DatabaseQueries.CREATE_GRADE_PREDICTION_MODEL,
                    courseID
                ));
        }

        public int CreateGradePredictionModelParameter(int modelID, int parameterID, float weight)
        {
            return NonQuery(
                String.Format(
                    DatabaseQueries.CREATE_GRADE_PREDICTION_MODEL_PARAMETER,
                    modelID,
                    parameterID,
                    weight
                ));
        }

        public List<GradePredictionModel> GetGradePredictionModels(int courseID)
        {
            // TODO implement
            throw new Exception();
        }

        public int CreatePredictiveModel(
            int courseID,
            string entryCollection,
            float mse)
        {
            return NonQuery(
                String.Format(
                    DatabaseQueries.CREATE_PREDICTIVE_MODEL,
                    courseID,
                    entryCollection,
                    mse
                ));
        }

        public List<PredictiveModel> GetPredictiveModels(
            int courseID,
            bool autoLoadThetas = false)
        {
            string query = String.Format(
                DatabaseQueries.QUERY_PREDICTIVE_MODELS_FOR_COURSE,
                courseID);

            SQLiteDataReader r = Query(query);
            List<PredictiveModel> models = new List<PredictiveModel>();

            while (r.Read())
            {
                PredictiveModel model = new PredictiveModel(
                    r.GetInt32(0),
                    r.GetInt32(1),
                    r.GetValue(2).ToString(),
                    r.GetFloat(3),
                    new ModelTheta[] { },
                    autoLoadThetas
                );
                models.Add(model);
            }

            return models;
        }

        public void DeletePredictiveModels(int courseID)
        {
            NonQuery(
                String.Format(
                    DatabaseQueries.DELETE_MODEL_THETAS,
                    courseID));

            NonQuery(
                String.Format(
                    DatabaseQueries.DELETE_PREDICTIVE_MODELS_FOR_COURSE,
                    courseID));
        }

        public void CreateModelTheta(
            int modelID,
            Nullable<int> tileID,
            Nullable<int> entryID,
            bool intercept,
            string metaKey,
            float value)
        {
            NonQuery(
                String.Format(
                    DatabaseQueries.CREATE_MODEL_THETA,
                    modelID,
                    tileID != null ? tileID.ToString() : "NULL",
                    entryID != null ? entryID.ToString() : "NULL",
                    intercept,
                    metaKey,
                    value
                ));
        }

        public List<ModelTheta> GetModelThetas(int modelID)
        {
            string query = String.Format(
                DatabaseQueries.QUERY_MODEL_THETA,
                modelID
            );

            SQLiteDataReader r = Query(query);
            List<ModelTheta> thetas = new List<ModelTheta>();

            while (r.Read())
            {
                ModelTheta theta = new ModelTheta(
                    r.GetInt32(0),
                    r.IsDBNull(1) ? (int?)null : r.GetInt32(1),
                    r.IsDBNull(2) ? (int?)null : r.GetInt32(2),
                    r.GetBoolean(3),
                    r.GetValue(4).ToString(),
                    r.GetFloat(5)
                );
                thetas.Add(theta);
            }

            return thetas;
        }

        public void CreatePredictedGrade(
            int courseID,
            string userLoginID,
            float grade,
            int gradedComponents,
            string syncHash)
        {
            NonQuery(
                String.Format(
                    DatabaseQueries.REGISTER_PREDICTED_GRADE,
                    courseID,
                    userLoginID,
                    grade,
                    gradedComponents,
                    syncHash
                ));
        }

        public void CreateEmptyUserGoalGrade(int courseID, string loginID)
        {
            NonQuery(
                String.Format(
                    DatabaseQueries.REGISTER_USER_GOAL_GRADE, courseID, loginID
                ));
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

            SQLiteDataReader r = Query(query);
            if (!r.Read()) return -1;
            else
            {
                return Convert.ToInt32(r.GetValue(0).ToString());
            }
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

        public List<string> GetUserPeers(
            int courseID,
            string userLoginID,
            string hash = null)
        {
            string activeHash = hash != null ? hash : this.GetCurrentHash(courseID);
            if (activeHash == null) new List<string> { };

            SQLiteDataReader r = Query(String.Format(
                    DatabaseQueries.QUERY_USER_PEERS,
                    courseID,
                    userLoginID,
                    activeHash
                ));

            List<string> peers = new List<string>();
            while (r.Read())
            {
                peers.Add(r.GetValue(0).ToString());
            }

            return peers;
        }

        public int CreateUserSubmission(
            int courseID,
            int entryID,
            string userLoginID,
            string grade,
            string submitted,
            string hash = null)
        {
            string activeHash = hash != null ? hash : this.GetCurrentHash(courseID);
            if (activeHash == null) new List<User> { };

            return NonQuery(
                String.Format(
                    DatabaseQueries.CREATE_USER_SUBMISSION,
                    entryID,
                    userLoginID,
                    grade,
                    submitted,
                    activeHash));
        }

        public int CreateSubmissionMeta(
            int submissionID,
            string key,
            string value)
        {
            return NonQuery(
                String.Format(
                    DatabaseQueries.CREATE_SUBMISSION_META,
                    submissionID,
                    key,
                    value));
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

            SQLiteDataReader r = Query(query);
            List<TileEntrySubmission> submissions = new List<TileEntrySubmission>();

            while (r.Read())
            {
                TileEntrySubmission submission = new TileEntrySubmission(
                    r.GetInt32(0),
                    r.GetInt32(1),
                    r.GetValue(2).ToString(),
                    r.GetValue(3).ToString(),
                    r.GetValue(4).ToString()
                );
                submissions.Add(submission);
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

            SQLiteDataReader r = Query(query);
            List<TileEntrySubmission> submissions = new List<TileEntrySubmission>();

            while (r.Read())
            {
                TileEntrySubmission submission = new TileEntrySubmission(
                    r.GetInt32(0),
                    r.GetInt32(1),
                    r.GetValue(2).ToString(),
                    r.GetValue(3).ToString(),
                    r.GetValue(4).ToString()
                );
                submissions.Add(submission);
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

            SQLiteDataReader r = Query(query);
            List<TileEntrySubmission> submissions = new List<TileEntrySubmission>();

            while (r.Read())
            {
                TileEntrySubmission submission = new TileEntrySubmission(
                    r.GetInt32(0),
                    r.GetInt32(1),
                    r.GetValue(2).ToString(),
                    r.GetValue(3).ToString(),
                    r.GetValue(4).ToString()
                );
                submissions.Add(submission);
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

            SQLiteDataReader r = Query(query);
            List<TileEntrySubmission> submissions = new List<TileEntrySubmission>();

            while (r.Read())
            {
                TileEntrySubmission submission = new TileEntrySubmission(
                    r.GetInt32(0),
                    r.GetInt32(1),
                    r.GetValue(2).ToString(),
                    r.GetValue(3).ToString(),
                    r.GetValue(4).ToString()
                );
                submissions.Add(submission);
            }

            return submissions;
        }

        public PeerGroup GetPeerGroup(int courseID)
        {
            string query = String.Format(
                DatabaseQueries.QUERY_PEER_GROUP_FOR_COURSE, courseID);

            SQLiteDataReader r = Query(query);

            if (r.Read())
            {
                return new PeerGroup(
                    r.GetInt32(0),
                    r.GetBoolean(1)
                );
            }

            return null;
        }

        public PublicInformedConsent GetPublicInformedConsent(
            int courseID)
        {
            string query = String.Format(
                DatabaseQueries.QUERY_CONSENT_FOR_COURSE, courseID);

            SQLiteDataReader r = Query(query);

            if (r.Read())
            {
                return new PublicInformedConsent(
                    r.GetValue(0).ToString(),
                    r.GetBoolean(1),
                    r.GetValue(2).ToString(),
                    r.GetBoolean(3)
                );
            }

            return null;
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

            string query2 = String.Format(
                DatabaseQueries.QUERY_PREDICTED_GRADES,
                courseID,
                activeHash);

            SQLiteDataReader r1 = Query(query1);

            List<PeerComparisonData> submissions = new List<PeerComparisonData>();

            while (r1.Read())
            {
                PeerComparisonData submission = new PeerComparisonData(
                    r1.GetInt32(0),
                    r1.GetFloat(1),
                    r1.GetFloat(2),
                    r1.GetFloat(3)
                );

                submissions.Add(submission);
            }

            SQLiteDataReader r2 = Query(query2);
            List<float> predictedGrades = new List<float>();
            int tileID = -1;

            while (r2.Read())
            {
                if (tileID < 0)
                {
                    try
                    {
                        tileID = r2.GetInt32(1);
                    }
                    catch { }
                }
                predictedGrades.Add(r2.GetFloat(2));
            }

            if (tileID > 0)
            {
                PeerComparisonData predictedGrade = new PeerComparisonData(
                    tileID,
                    predictedGrades.Average(),
                    predictedGrades.Min(),
                    predictedGrades.Max()
                );

                submissions.Add(predictedGrade);
            }

            var tiles = GetTiles(courseID);
            var tile = tiles.Find(t => t.ContentType == Tile.CONTENT_TYPE_LEARNING_OUTCOMES);

            /*
            if (tile != null)
            {
                List<LearningGoal> goals = GetGoals(courseID)
                    .ToList();
                List<int> completed = new List<int>();

                foreach (string peer in this.GetUserPeers(courseID, userLoginID))
                {

                    List<TileEntrySubmission> submissions1 =
                        GetTileSubmissionsForUser(
                            courseID,
                            peer);

                    int current = 0;

                    goals.ForEach(g =>
                    {
                        bool success = true;
                        g.FetchRequirements();
                        foreach (GoalRequirement req in g.Requirements)
                        {
                            TileEntrySubmission submission = submissions1.Find(
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

                        if (success) current += 1;
                    });
                    completed.Add(current);
                }


                PeerComparisonData learningOutcomes = new PeerComparisonData(
                    tile.ID,
                    completed.Count() > 0 ? (float)completed.Average() : 0,
                    completed.Count() > 0 ? completed.Min() : 0,
                    completed.Count() > 0 ? completed.Max() : 0
                );
                submissions.Add(learningOutcomes);
            }
            */

            return submissions.ToArray();
        }

        public List<PredictedGrade> GetPredictedGrades(int courseID, string userLoginID, string hash = null)
        {
            string activeHash = hash ?? this.GetCurrentHash(courseID);
            if (activeHash == null)
                return new List<PredictedGrade>() { };

            string query = String.Format(
                DatabaseQueries.QUERY_PREDICTED_GRADES_FOR_USER,
                courseID,
                userLoginID,
                activeHash);

            SQLiteDataReader r = Query(query);

            List<PredictedGrade> predictions = new List<PredictedGrade>();

            while (r.Read())
            {
                PredictedGrade prediction = new PredictedGrade(
                    r.GetValue(0).ToString(),
                    r.GetInt32(3),
                    r.GetFloat(2)
                );

                predictions.Add(prediction);
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

            string query2 = String.Format(
                DatabaseQueries.QUERY_PREDICTED_GRADES,
                courseID, activeHash);

            SQLiteDataReader r1 = Query(query1);
            SQLiteDataReader r2 = Query(query2);
            List<PeerComparisonData> submissions = new List<PeerComparisonData>();

            while (r1.Read())
            {
                PeerComparisonData submission = new PeerComparisonData(
                    r1.GetInt32(0),
                    r1.GetFloat(1),
                    r1.GetFloat(2),
                    r1.GetFloat(3)
                );
                submissions.Add(submission);
            }

            while (r2.Read())
            {
                if (r2.GetValue(0).ToString() != userLoginID) continue;

                PeerComparisonData submission = new PeerComparisonData(
                    r2.GetInt32(1),
                    r2.GetFloat(2),
                    null,
                    null
                );
                submissions.Add(submission);
            }

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

            SQLiteDataReader r1 = Query(query1);
            List<TileEntrySubmission> submissions = new List<TileEntrySubmission>();

            while (r1.Read())
            {
                TileEntrySubmission submission = new TileEntrySubmission(
                    r1.GetInt32(0),
                    r1.GetInt32(1),
                    r1.GetValue(2).ToString(),
                    r1.GetValue(3).ToString(),
                    r1.GetValue(4).ToString()
                );
                submissions.Add(submission);
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

            SQLiteDataReader r1 = Query(query1);
            List<TileEntrySubmission> submissions = new List<TileEntrySubmission>();

            while (r1.Read())
            {
                TileEntrySubmission submission = new TileEntrySubmission(
                    r1.GetInt32(0),
                    r1.GetInt32(1),
                    r1.GetValue(2).ToString(),
                    r1.GetValue(3).ToString(),
                    r1.GetValue(4).ToString()
                );
                submissions.Add(submission);
            }

            return submissions;
        }

        public List<LearningGoal> GetGoals(int courseID)
        {
            string query = String.Format(
                DatabaseQueries.QUERY_LEARNING_GOALS,
                courseID
            );

            SQLiteDataReader r = Query(query);
            List<LearningGoal> goals = new List<LearningGoal>();

            while (r.Read())
            {
                goals.Add(new LearningGoal(
                    r.GetInt32(0),
                    r.GetInt32(1),
                    r.GetValue(2).ToString()
                ));
            }

            return goals;
        }

        public LearningGoal CreateGoal(int courseID, int tileID, string title)
        {
            string query = String.Format(
                DatabaseQueries.CREATE_LEARNING_GOAL,
                courseID, tileID, title
            );

            int id = NonQuery(query);
            return GetGoals(courseID).Find(g => g.ID == id);
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
                DatabaseQueries.CREATE_GOAL_REQUIREMENT,
                goalID, tileID, entryID, metaKey, value, expresson
            );

            NonQuery(query);
        }

        public List<GoalRequirement> GetGoalRequirements(int goalID)
        {
            string query = String.Format(
                DatabaseQueries.QUERY_GOAL_REQUIREMENTS,
                goalID
            );

            SQLiteDataReader r = Query(query);
            List<GoalRequirement> requirements = new List<GoalRequirement>();

            while (r.Read())
            {
                requirements.Add(new GoalRequirement(
                    r.GetInt32(0),
                    r.GetInt32(1),
                    r.GetInt32(2),
                    r.GetValue(3).ToString(),
                    r.GetFloat(4),
                    r.GetValue(5).ToString()
                ));
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
                DatabaseQueries.CREATE_USER_NOTIFICATIONS,
                courseID,
                userLoginID,
                tileID,
                status,
                activeHash);

            NonQuery(query);
        }

        public List<Notification> GetAllNotifications(
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

            SQLiteDataReader r = Query(query);
            List<Notification> notifications = new List<Notification>();

            while (r.Read())
            {
                notifications.Add(new Notification(
                    r.GetInt32(0),
                    r.GetValue(1).ToString(),
                    r.GetBoolean(2)
                ));
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

            SQLiteDataReader r = Query(query);
            List<Notification> notifications = new List<Notification>();

            while (r.Read())
            {
                notifications.Add(new Notification(
                    r.GetInt32(0),
                    r.GetValue(1).ToString(),
                    false
                ));
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

            SQLiteDataReader r = Query(query);
            List<TileEntry> entries = new List<TileEntry>();

            while (r.Read())
            {
                entries.Add(new TileEntry(
                    r.GetInt32(0),
                    r.GetInt32(1),
                    r.GetValue(2).ToString(),
                    r.GetValue(3).ToString()
                ));
            }

            return entries;
        }

        public int CreateTileEntry(TileEntry entry)
        {
            string query = String.Format(
                    DatabaseQueries.CREATE_TILE_ENTRY,
                    entry.TileID,
                    entry.Title,
                    entry.Type,
                    entry.Wildcard);
            return NonQuery(query);
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

            SQLiteDataReader r = Query(query);
            List<AcceptList> keys = new List<AcceptList>();

            while (r.Read())
            {
                keys.Add(
                    new AcceptList(
                        r.GetValue(0).ToString(),
                        r.GetBoolean(1)
                    ));
            }

            return keys;
        }

        public List<string> GetEntryMetaKeys(int entryID)
        {
            string query = String.Format(
                DatabaseQueries.QUERY_TILE_ENTRY_META_KEYS,
                entryID);

            SQLiteDataReader r = Query(query);
            List<string> keys = new List<string>();

            while (r.Read())
            {
                keys.Add(r.GetValue(0).ToString());
            }

            return keys;
        }

        public Dictionary<string, string> GetEntryMeta(int entryID)
        {
            string query = String.Format(
                DatabaseQueries.QUERY_TILE_ENTRY_SUBMISSION_META,
                entryID);

            SQLiteDataReader r = Query(query);
            Dictionary<string, string> meta = new Dictionary<string, string>();

            while (r.Read())
            {
                meta.Add(r.GetValue(0).ToString(), r.GetValue(1).ToString());
            }

            return meta;
        }

        public Tile UpdateTile(int courseID, Tile newTile)
        {
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

            return this.GetTile(courseID, newTile.ID);
        }

        public List<Tile> GetTiles(int courseID, bool autoLoadEntries = false)
        {
            string query = String.Format(
                    DatabaseQueries.QUERY_TILES,
                    courseID
            );


            SQLiteDataReader r = Query(query);
            List<Tile> tiles = new List<Tile>();

            while (r.Read())
            {
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
                    courseID
            );

            SQLiteDataReader r = Query(query);
            List<LayoutTileGroup> tileGroups = new List<LayoutTileGroup>();

            while (r.Read())
            {
                LayoutTileGroup row = new LayoutTileGroup(
                    r.GetInt32(0),
                    courseID,
                    r.GetValue(1).ToString(),
                    r.GetInt32(2),
                    r.GetInt32(3)
                );
                tileGroups.Add(row);
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

            SQLiteDataReader r = Query(query);
            List<AppAssignment> assignments = new List<AppAssignment>();

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

            SQLiteDataReader r = Query(query);
            List<AppDiscussion> discussions = new List<AppDiscussion>();

            while (r.Read())
            {
                AppDiscussion row = new AppDiscussion(
                    r.GetInt32(0),
                    r.GetInt32(1),
                    r.GetInt32(2),
                    r.GetValue(3).ToString(),
                    r.GetValue(4).ToString(),
                    r.GetValue(5).ToString(),
                    r.GetValue(6).ToString()
                );
                discussions.Add(row);
            }

            return discussions;
        }

        public List<AppDiscussion> GetDiscussions(
            int courseID,
            int tileID,
            string userLoginID = null,
            string hash = null)
        {
            string activeHash = hash ?? this.GetCurrentHash(courseID);
            if (activeHash == null) return new List<AppDiscussion>() { };

            string query = null;

            if (userLoginID == null)
            {
                query = String.Format(
                    DatabaseQueries.QUERY_TILE_DISCUSSIONS,
                    tileID,
                    activeHash
                );
            }
            else
            {
                User user = GetUser(courseID, userLoginID, activeHash);
                if (user == null) return new List<AppDiscussion>() { };

                query = String.Format(
                    DatabaseQueries.QUERY_TILE_DISCUSSIONS_FOR_USER,
                    tileID,
                    user.Name,
                    activeHash
                );
            }

            SQLiteDataReader r = Query(query);
            List<AppDiscussion> discussions = new List<AppDiscussion>();

            while (r.Read())
            {
                AppDiscussion row = new AppDiscussion(
                    r.GetInt32(0),
                    r.GetInt32(1),
                    r.GetInt32(2),
                    r.GetValue(3).ToString(),
                    r.GetValue(4).ToString(),
                    r.GetValue(5).ToString(),
                    r.GetValue(6).ToString()
                );
                discussions.Add(row);
            }

            return discussions;
        }

        public LayoutColumn CreateLayoutColumn(int courseID, string containerWidth, int position)
        {
            string query = String.Format(
                DatabaseQueries.REGISTER_LAYOUT_COLUMN,
                courseID, containerWidth, position
            );
            int id = NonQuery(query);
            return GetLayoutColumns(courseID).Find(c => c.ID == id);
        }

        public List<LayoutColumn> GetLayoutColumns(int courseID)
        {
            string query = String.Format(
                DatabaseQueries.QUERY_LAYOUT_COLUMNS,
                courseID
            );

            SQLiteDataReader r = Query(query);
            List<LayoutColumn> columns = new List<LayoutColumn>();

            while (r.Read())
            {
                LayoutColumn row = new LayoutColumn(
                    r.GetInt32(0), courseID, r.GetValue(1).ToString(), r.GetInt32(2)
                );
                columns.Add(row);
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
            command = connection.CreateCommand();
            command.CommandText = String.Format(
                "INSERT INTO `layout_tile_group` (`title`, `column_id`) VALUES('{0}', {1});",
                title, columnID
            );
            command.ExecuteNonQuery();
        }



        public Tile GetTile(int courseID, int tileID)
        {
            string query = String.Format(
                    @"SELECT `id`, `group_id`, `title`, `position`, `tile_type`, `content_type`, `visible`, `notifications`, `graph_view`, `wildcard`
                    FROM `tile` WHERE `id`={0}",
                    tileID
            );

            SQLiteDataReader r = Query(query);
            Tile tile = null;

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
                    DatabaseQueries.CREATE_TILE,
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
            int id = NonQuery(query);
            return GetTile(courseID, id);
        }

        public void AddTileEntry(int courseID, int tileID, string type,
            string title, bool wildcard = false)
        {
            command = connection.CreateCommand();
            command.CommandText = String.Format(
                    @"INSERT INTO `tile_entry` ( 
                       `course_id`,
                       `tile_id`,
                       `type`,
                       `title`,
                       `wildcard`
                    ) VALUES ({0}, {1}, '{2}', '{3}', {4})",
                    courseID, tileID, type, title, wildcard
            );
            command.ExecuteNonQuery();
        }

        public List<TileEntry> GetTileEntries(int tileID)
        {
            string query = String.Format(
                "SELECT `id`, `tile_id`, `title`, `type`, `wildcard` from `tile_entry` WHERE `tile_id`={0}",
                tileID
            );

            SQLiteDataReader r = Query(query);
            List<TileEntry> entries = new List<TileEntry>();

            while (r.Read())
            {
                entries.Add(new TileEntry(
                    r.GetInt32(0),
                    r.GetInt32(1),
                    r.GetValue(2).ToString(),
                    r.GetValue(3).ToString()
                ));
            }

            return entries;
        }

        public void DeleteTile(int tileID)
        {
            command = connection.CreateCommand();
            command.CommandText = String.Format(
                    @"DELETE FROM `tile` WHERE `id` = {0};",
                    tileID
            );
            command.ExecuteNonQuery();
        }

        public void SetConsent(ConsentData data)
        {

            if (GetConsent(data.CourseID, data.UserLoginID) == -1)
            {
                command = connection.CreateCommand();
                command.CommandText = String.Format(
                    "INSERT INTO consent (`course_id`, `user_id`, `user_login_id`, `user_name`, `granted`) VALUES('{0}', '{1}', '{2}', '{3}', '{4}');",
                    data.CourseID, data.UserID, data.UserLoginID, data.UserName.Replace("'", ""), data.Granted
                );
                command.ExecuteNonQuery();
            }
            else
            {
                command = connection.CreateCommand();
                command.CommandText = String.Format(
                    "UPDATE consent SET `granted` = {0} WHERE `course_id` = {1} AND `user_id` = {2};",
                    data.Granted, data.CourseID, data.UserID
                );
                command.ExecuteNonQuery();
            }

        }

        public int GetConsent(int CourseID, int UserID)
        {
            string query = String.Format(
                "SELECT `user_login_id`, `granted` from `consent` WHERE `course_id`={0} AND `user_id`={1}",
                CourseID, UserID
            );

            SQLiteDataReader r = Query(query);

            if (r.Read()) return Convert.ToInt32(r["granted"]);
            else return -1;
        }

        public int GetConsent(int CourseID, string UserLoginID)
        {
            string query = String.Format(
                "SELECT `user_login_id`, `granted` from `consent` WHERE `course_id`={0} AND `user_login_id`='{1}'",
                CourseID, UserLoginID
            );

            SQLiteDataReader r = Query(query);

            if (r.Read())
            {
                return Convert.ToInt32(r["granted"]);
            }
            else return -1;
        }

        public ConsentData[] GetGrantedConsents(int CourseID)
        {
            try
            {
                string query = String.Format(
                "SELECT `user_id`, `user_login_id`, `user_name` from `consent` WHERE `course_id`={0} AND `granted`=1",
                CourseID
            );

                SQLiteDataReader r = Query(query);
                List<ConsentData> consents = new List<ConsentData>();

                while (r.Read())
                {
                    consents.Add(new ConsentData(CourseID, r.GetInt32(0), r.GetValue(1).ToString(), r.GetValue(2).ToString(), 1));
                }

                return consents.ToArray();
            }
            catch (Exception _)
            {
                return new ConsentData[0] { };
            }

        }

        public void AddExternalData(int courseID, ExternalData[] entries)
        {
            foreach (var entry in entries)
            {
                command = connection.CreateCommand();
                command.CommandText = String.Format(
                    "INSERT INTO external_data (`course_id`, `tile_id`, `title`, `grade`, `user_login_id`) VALUES('{0}', '{1}', '{2}', '{3}', '{4}');",
                    courseID, entry.TileID, entry.Title, entry.Grade, entry.UserLoginID
                );
                command.ExecuteNonQuery();
            }
        }

        public ExternalData[] GetExternalData(int courseID, int tileID, string userLoginID)
        {

            string query = "";

            if (tileID == -1)
            {
                query =
                    String.Format(
                        "SELECT `user_login_id`, `title`, `grade` from `external_data` WHERE `course_id`={0} AND `user_login_id`='{1}'",
                        courseID, userLoginID
                    );
            }
            else
            {
                query = userLoginID != null ?
                    String.Format(
                        "SELECT `user_login_id`, `title`, `grade` from `external_data` WHERE `course_id`={0} AND `tile_id`={1} AND `user_login_id`='{2}'",
                        courseID, tileID, userLoginID
                    ) : String.Format(
                        "SELECT `user_login_id`, `title`, `grade` from `external_data` WHERE `course_id`={0} AND `tile_id`={1}",
                        courseID, tileID
                    );
            }


            SQLiteDataReader r = Query(query);
            List<ExternalData> submissions = new List<ExternalData>();

            while (r.Read())
            {
                ExternalData submission = new ExternalData(courseID, r.GetValue(0).ToString(), tileID, r.GetValue(1).ToString(), r.GetValue(2).ToString());
                submissions.Add(submission);
            }

            return submissions.ToArray();
        }

    }
}
