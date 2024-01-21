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
using Microsoft.Extensions.Configuration;

namespace IguideME.Web.Services
{

    public sealed class BrightspaceHandler : ILMSHandler
    {
        // private static BrightspaceManager s_instance;
        private readonly string _connection_string;
        private readonly ILogger _logger;

        public BrightspaceHandler(IConfiguration config, ILogger<SyncManager> logger)
        {
            // s_instance = this;
            // _connection_string = isDev ? "Data Source=brightspace.db;Version=3;New=False;Compress=True;"
            //                           : "Data Source=/data/IguideME.db;Version=3;New=False;Compress=True;";
            _connection_string = config["LMS:Brightspace:Connection"];
            _logger = logger;
            this.SyncInit();
        }

        // public static BrightspaceManager GetInstance(bool isDev = false)
        // {

        //     s_instance ??= new BrightspaceManager(isDev);

        //     return s_instance;
        // }

        public void SyncInit()
        {
            _logger.LogInformation("Initializing handler for Brightspace.");
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

        // -------------------------- QUERIES ------------------------------------ //

        // TODO: when we start doing multiple courses we need to put this in the lms interface.
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
                    courses.Add(new Course(
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
                    return new User(
                        r.GetValue(0).ToString(),
                        -1, // we receive the user's data to store in our DB, which are not course specific
                        r.GetInt32(1),
                        r.GetValue(2).ToString() + " " + r.GetValue(3).ToString() + " " + r.GetValue(4).ToString(),
                        r.GetValue(2).ToString() + ", " + r.GetValue(4).ToString(), // Last name contains "van", "van der" etc.
                        (int)UserRoles.student
                    );
            }
            return null;
        }

        // This function is used to map the Grading type values provided by Brightspace to our local enum
        private AppGradingType mapGradingType(int type_id)
        {
            switch (type_id)
            {
                case 1:
                case 5:
                case 7:
                case 8:
                    return AppGradingType.Points;
                case 2:
                    return AppGradingType.PassFail;
                case 4:
                    return AppGradingType.Letters;
                default:
                    _logger.LogWarning("Grade format {Type} is not supported, treating as not graded...", type_id);
                    return AppGradingType.NotGraded;
            }
        }

        ///////////////////////////////////////////////////////////////////////////////////////////////////

        public void SendMessage(string userID, string subject, string body)
        {
            throw new NotImplementedException();
        }

        /// <inheritdoc />
        public string[] GetUserIDs(int courseID, string userID)
        {
            _logger.LogInformation("Trying to get user\ncourseID: {courseID}, userID: {userID}", courseID, userID);
            string[] userIDs = new string[3];
            using (SQLiteDataReader r =
                Query(@"SELECT  `username`,
                                `user_id`,
                                `org_defined_id`
                        FROM    `users`
                        WHERE   `username` = @userID",
                    new SQLiteParameter("userID", userID)                    
                    ))
            {
                if (r.Read()) 
                {
                    try 
                    {
                        userIDs[0] = r.GetValue(0).ToString();
                        userIDs[1] = r.GetValue(1).ToString();
                        userIDs[2] = r.GetValue(2).ToString();
                    } 
                    catch (Exception e)
                    {
                        PrintQueryError("BrigtspaceHandler.GetUserIDs", 0, r, e);
                    }
                    
                }
                return userIDs;
            }
        }

        /// <inheritdoc />
        public IEnumerable<User> GetStudents(int courseID)
        {
            _logger.LogInformation("Trying to get all students for \ncourseID: {courseID}", courseID);
            List<User> students = new List<User>();
            using (SQLiteDataReader r =
                Query(@"SELECT      `users`.`username`,
                                    `users`.`user_id`,
                                    `users`.`first_name`,
                                    `users`.`middle_name`,
                                    `users`.`last_name`
                        FROM        `users`
                        INNER JOIN  `user_enrollments`
                            ON      `users`.`user_id` = `user_enrollments`.`user_id`
                        WHERE       `user_enrollments`.`org_unit_id` = @courseID
                        AND        (`user_enrollments`.`role_id` = 110
                        OR          `user_enrollments`.`role_id` = 130
                        OR          `user_enrollments`.`role_id` = 134)",
                    new SQLiteParameter("courseID", courseID)
                    ))
            {
                while (r.Read())
                    try 
                    {
                        students.Add(new User(
                            r.GetValue(0).ToString(),
                            courseID,
                            r.GetInt32(1),
                            r.GetValue(2).ToString() + " " + r.GetValue(3).ToString() + " " + r.GetValue(4).ToString(),
                            r.GetValue(4).ToString() + ", " + r.GetValue(2).ToString() + " " + r.GetValue(3).ToString(),
                            (int)UserRoles.student
                        ));
                    } 
                    catch (Exception e)
                    {
                        PrintQueryError("BrigtspaceHandler.GetStudents", 0, r, e);
                    }
                    

                return students;
            }
        }

        /// <inheritdoc />
        public IEnumerable<User> GetAdministrators(int courseID)
        {
            _logger.LogInformation("Trying to get all teachers for \ncourseID: {courseID}", courseID);
            List<User> teachers = new List<User>();
            using (SQLiteDataReader r =
                Query(@"SELECT      `users`.`username`,
                                    `users`.`user_id`,
                                    `users`.`first_name`,
                                    `users`.`middle_name`,
                                    `users`.`last_name`
                        FROM        `users`
                        INNER JOIN  `user_enrollments`
                            ON      `users`.`user_id` = `user_enrollments`.`user_id`
                        WHERE       `user_enrollments`.`org_unit_id` = @courseID
                        AND        (`user_enrollments`.`role_id` = 109
                        OR          `user_enrollments`.`role_id` = 117)",
                    new SQLiteParameter("courseID", courseID)
                    ))
            {
                while (r.Read())
                {
                    try 
                    {
                        teachers.Add(new User(
                            r.GetValue(0).ToString(),
                            courseID,
                            r.GetInt32(1),
                            r.GetValue(2).ToString() + " " + r.GetValue(3).ToString() + " " + r.GetValue(4).ToString(),
                            r.GetValue(4).ToString() + ", " + r.GetValue(2).ToString() + " " + r.GetValue(3).ToString(),
                            (int)UserRoles.instructor
                        ));
                    } 
                    catch (Exception e)
                    {
                        PrintQueryError("BrigtspaceHandler.GetAdministrators", 0, r, e);
                    }
                }
                return teachers;
            }
        }

        /// <inheritdoc />
        public IEnumerable<AppAssignment> GetAssignments(int courseID)
        {
            _logger.LogInformation("Trying to get all assignments for \ncourseID: {courseID}", courseID);
            List<AppAssignment> assignments = new List<AppAssignment>();
            using (SQLiteDataReader r =
                Query(@"SELECT  `grade_object_id`,
                                `org_unit_id`,
                                `name`,
                                `end_date`,
                                `max_points`,
                                `type_name`,
                                `grade_object_type_id`
                        FROM    `grade_objects`
                        WHERE   `org_unit_id` = @courseID
                        AND    (`grade_object_type_id` = 1
                        OR      `grade_object_type_id` = 2
                        OR      `grade_object_type_id` = 4)",
                    new SQLiteParameter("courseID", courseID)
                    ))
            {
                while (r.Read())
                {
                    try 
                    {
                        assignments.Add(new AppAssignment(
                            r.GetInt32(0),
                            r.GetInt32(1),
                            r.GetValue(2).ToString(),
                            true, //bool published,
                            false, //bool muted,
                            r.GetValue(3) is not null ? ((DateTimeOffset)r.GetValue(3)).ToUnixTimeMilliseconds() : 0,
                            r.GetDouble(4),
                            mapGradingType(r.GetInt32(6)) // This is mapped to our local enum
                        ));
                    } 
                    catch (Exception e)
                    {
                        PrintQueryError("BrigtspaceHandler.GetAssignments", 0, r, e);
                    }
                }

                return assignments;
            }
        }

        /// <inheritdoc />
        public IEnumerable<AssignmentSubmission> GetSubmissions(int courseID, string[] userIDs)
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
                        WHERE   `org_unit_id` = @courseID
                        AND     `user_id`
                            IN  (@allIDs)",
                    new SQLiteParameter("courseID", courseID),
                    new SQLiteParameter("allIDs", string.Join(",", userIDs))                    
                    ))
            {
                while (r.Read())
                {
                    try 
                    {
                        string rawGrade = r.GetValue(4).ToString();
                        if (rawGrade.IsNullOrEmpty())
                            submissions.Add(new AssignmentSubmission(
                                -1, //-1 cause at this point we haven't stored the data in our DB, so a submission id doesn't exist
                                r.GetInt32(0),
                                r.GetValue(1).ToString(),
                                r.GetInt32(2) / r.GetInt32(3),
                                ((DateTimeOffset)r.GetValue(5)).ToUnixTimeMilliseconds()
                            ));
                        else
                            submissions.Add(new AssignmentSubmission(
                                -1, //-1 cause at this point we haven't stored the data in our DB, so a submission id doesn't exist
                                r.GetInt32(0),
                                r.GetValue(1).ToString(),
                                r.GetInt32(2) / r.GetInt32(3),
                                rawGrade,
                                ((DateTimeOffset)r.GetValue(5)).ToUnixTimeMilliseconds()
                            ));
                    } 
                    catch (Exception e)
                    {
                        PrintQueryError("BrigtspaceHandler.GetSubmissions", 0, r, e);
                    }
                }
                return submissions;
            }
        }

        /// <inheritdoc />
        public IEnumerable<(AppAssignment, IEnumerable<AssignmentSubmission>)> GetQuizzes(int courseID)
        {
            // Return an empty collection as brightspace doesn't separate quizzes and assignments.
            return new List<(AppAssignment, IEnumerable<AssignmentSubmission>)>();
        }

        /// <inheritdoc />
        public IEnumerable<AppDiscussion> GetDiscussions(int courseID)
        {
            // Return an empty collection as brightspace doesn't have discussions
            return new List<AppDiscussion>();
        }
    }
}
