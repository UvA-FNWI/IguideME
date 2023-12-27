using System;
using System.Collections.Generic;
using System.Data.SQLite;
using System.Data;
using IguideME.Web.Models;
using IguideME.Web.Models.App;
using IguideME.Web.Models.Impl;
using Microsoft.Extensions.Logging;
using IguideME.Web.Services.LMSHandlers;
using Microsoft.IdentityModel.Tokens;

namespace IguideME.Web.Services
{

    public sealed class BrightspaceManager :  ILMSHandler
    {
        private static BrightspaceManager s_instance;
        private readonly string _connection_string;
        private readonly ILogger _logger;

        private BrightspaceManager(bool isDev = false)
        {
            s_instance = this;
            _connection_string = isDev ? "Data Source=brightspace.db;Version=3;New=False;Compress=True;"
                                      : "Data Source=/data/IguideME.db;Version=3;New=False;Compress=True;";

            ILoggerFactory factory = LoggerFactory.Create(builder => builder.AddConsole());
            _logger = factory.CreateLogger("BrightspaceManager");
        }

        public static BrightspaceManager GetInstance(bool isDev = false)
        {

            s_instance ??= new BrightspaceManager(isDev);

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

        // -------------------------- QUERIES ------------------------------------ //

        public List<Course> GetAllCourses()
        {
            List<Course> courses = new List<Course>();
            using (SQLiteDataReader r = 
                Query(@"SELECT  `org_unit_id`,
                                `name`,
                                `start_date`,
                                `end_date` 
                        FROM    `organizational_units`
                        WHERE   `type`='Course Offering'"
                ))
            {
                while (r.Read())
                    courses.Add( new Course(
                        r.GetInt32(0),
                        r.GetValue(1).ToString()
                        // r.GetValue(2).ToString(), //start and end dates need to be converted from text to float timestamps
                        // r.GetValue(3).ToString()
                    ));
            }
            return null;
        }

        public List<string> GetAllUsernames()
        {
            List<string> usernames = new List<string>();

            using (SQLiteDataReader r = Query("SELECT `username` FROM `users`"))
            {
                while (r.Read())
                    usernames.Add(r.GetValue(0).ToString());
                
                return usernames;
            }
        }

        /// <summary>
        /// This function is used as soon as the user accepts consent and we are allowed to store their data in our DB.
        /// </summary>
        /// <param name="username">The user's login username by which we query.</param>
        /// <returns> A User object with their data </returns>
        public User GetSingleUserData(string username)
        {
            using (SQLiteDataReader r = 
                Query(@"SELECT  `username`,
                                `user_id`,
                                `first_name`,
                                `middle_name`,
                                `last_name`
                        FROM    `users`
                        WHERE   `username` = '" + username + "'"
                    ))
            {   
                if (r.Read())
                    return new User (
                        r.GetValue(0).ToString(),
                        -1, // we receive the user's data to store in our DB, which are not course specific
                        r.GetInt32(1),
                        r.GetValue(2).ToString() + " " + r.GetValue(3).ToString() + " " + r.GetValue(4).ToString(),
                        r.GetValue(2).ToString() + ", " + r.GetValue(4).ToString(),
                        (int) UserRoles.student
                    );
            }
            return null;
        }

 ///////////////////////////////////////////////////////////////////////////////////////////////////
        
        void ILMSHandler.SyncInit()
        {
            throw new NotImplementedException();
        }

        void ILMSHandler.SendMessage(string userID, string subject, string body)
        {
            throw new NotImplementedException();
        }

        string[] ILMSHandler.GetUserIDs(int courseID, string userID)
        {
            _logger.LogInformation("Trying to get user\ncourseID: {courseID}, userID: {userID}", courseID, userID);
            throw new NotImplementedException();
        }

        IEnumerable<User> ILMSHandler.GetStudents(int courseID)
        {
            _logger.LogInformation("Trying to get all students for \ncourseID: {courseID}", courseID);
            // TODO: Add WHERE course=courseID
            List<User> students = new List<User>();
            using (SQLiteDataReader r = 
                Query(@"SELECT  `username`,
                                `user_id`,
                                `first_name`,
                                `middle_name`,
                                `last_name`
                        FROM    `users`
                        WHERE   `role_id` = 110
                        OR      `role_id` = 130
                        OR      `role_id` = 134"
                    ))
            {
                while (r.Read())
                    students.Add(new User (
                        r.GetValue(0).ToString(),
                        courseID,
                        r.GetInt32(1),
                        r.GetValue(2).ToString() + " " + r.GetValue(3).ToString() + " " + r.GetValue(4).ToString(),
                        r.GetValue(4).ToString() + ", " + r.GetValue(2).ToString() + " " + r.GetValue(3).ToString(),
                        (int) UserRoles.student
                    ));
                
                return students;
            }
        }

        IEnumerable<User> ILMSHandler.GetAdministrators(int courseID)
        {
            _logger.LogInformation("Trying to get all teachers for \ncourseID: {courseID}", courseID);
            // TODO: Add WHERE course=courseID
            List<User> teachers = new List<User>();
            using (SQLiteDataReader r = 
                Query(@"SELECT  `username`,
                                `user_id`,
                                `first_name`,
                                `middle_name`,
                                `last_name`
                        FROM    `users`
                        WHERE   `role_id` = 109
                        OR      `role_id` = 117"
                    ))
            {
                while (r.Read())
                    teachers.Add(new User (
                        r.GetValue(0).ToString(),
                        courseID,
                        r.GetInt32(1),
                        r.GetValue(2).ToString() + " " + r.GetValue(3).ToString() + " " + r.GetValue(4).ToString(),
                        r.GetValue(4).ToString() + ", " + r.GetValue(2).ToString() + " " + r.GetValue(3).ToString(),
                        (int) UserRoles.instructor
                    ));
                
                return teachers;
            }
        }

        IEnumerable<AppAssignment> ILMSHandler.GetAssignments(int courseID)
        {
            _logger.LogInformation("Trying to get all assignments for \ncourseID: {courseID}", courseID);
            List<AppAssignment> assignments = new List<AppAssignment>();
            using (SQLiteDataReader r = 
                Query(@"SELECT  `grade_object_id`,
                                `org_unit_id`,
                                `name`,
                                `end_date`,
                                `max_points`,students
                                `type_name`, `grade_object_type_id`
                        FROM    `grade_objects`
                        WHERE   `grade_object_type_id` = 1
                        OR      `grade_object_type_id` = 2
                        OR      `grade_object_type_id` = 4"
                    ))
            {
                while (r.Read()){
                    assignments.Add( new AppAssignment(
                        r.GetInt32(0),
                        r.GetInt32(1),
                        r.GetValue(2).ToString(),
                        true, //bool published,
                        true, //bool muted,
                        0, //int dueDate, -> r.getValue(3) it is text & needs to be float/int for timestamp
                        r.GetDouble(4),
                        r.GetInt32(6) // TODO SOS: THIS NEEDS TO BE MAPPED TO ENUM
                    ));
                }
                
                return assignments;
            }
        }

        IEnumerable<AssignmentSubmission> ILMSHandler.GetSubmissions(int courseID, string[] userIDs)
        {
            List<AssignmentSubmission> submissions = new List<AssignmentSubmission>();
            using (SQLiteDataReader r = 
                Query(@"SELECT  `grade_object_id`,
                                `user_id`,
                                `points_numerator`,
                                `points_denominator`,
                                `grade_text`,
                                `grade_released_date`
                        FROM    `grade_results`
                        WHERE   `org_unit_id` = " + courseID + @"
                        AND     `user_id` 
                            IN  (" + string.Join(",", userIDs) + ")"                        
                    ))
            {
                while (r.Read()){
                    string rawGrade = r.GetValue(4).ToString();
                    if (rawGrade.IsNullOrEmpty())
                        submissions.Add(new AssignmentSubmission(
                            -1, //-1 cause at this point we haven't stored the data in our DB, so a submission id doesn't exist
                            r.GetInt32(0),
                            r.GetValue(1).ToString(),
                            r.GetInt32(2) / r.GetInt32(3),
                            ((DateTime) r.GetValue(5)).ToFileTimeUtc()
                        ));
                    else
                        submissions.Add(new AssignmentSubmission(
                            -1, //-1 cause at this point we haven't stored the data in our DB, so a submission id doesn't exist
                            r.GetInt32(0),
                            r.GetValue(1).ToString(),
                            r.GetInt32(2) / r.GetInt32(3),
                            rawGrade,
                            ((DateTime) r.GetValue(5)).ToFileTimeUtc()
                        ));
                }
                
                return submissions;
            }
        }

        IEnumerable<(AppAssignment, IEnumerable<AssignmentSubmission>)> ILMSHandler.GetQuizzes(int courseID)
        {
            return new List<(AppAssignment, IEnumerable<AssignmentSubmission>)>();
        }

        IEnumerable<AppDiscussion> ILMSHandler.GetDiscussions(int courseID)
        {
            return new List<AppDiscussion>();
        }
    }
}