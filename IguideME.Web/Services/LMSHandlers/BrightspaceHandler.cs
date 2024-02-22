using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using IguideME.Web.Models.App;
using IguideME.Web.Models.Impl;
using IguideME.Web.Services.LMSHandlers;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using Npgsql;

namespace IguideME.Web.Services
{
    public sealed class BrightspaceHandler : ILMSHandler
    {
        // private static BrightspaceManager s_instance;
        private readonly string _connection_string;
        private readonly ILogger _logger;

        public BrightspaceHandler(IConfiguration config, ILogger<SyncManager> logger)
        {
            _connection_string =
                "Host = "
                + config["LMS:Brightspace:Connection:Host"]
                + ";Port = "
                + config["LMS:Brightspace:Connection:Port"]
                + ";Database = "
                + config["LMS:Brightspace:Connection:Database"]
                + ";User ID = "
                + config["LMS:Brightspace:Connection:UserID"]
                + ";Password = "
                + config["LMS:Brightspace:Connection:Password"]
                + ";Search Path = "
                + config["LMS:Brightspace:Connection:SearchPath"]
                + ";"
                + config["LMS:Brightspace:Connection:Rest"];
            _logger = logger;
            this.SyncInit();
        }

        public void SyncInit()
        {
            _logger.LogInformation("Initializing handler for Brightspace.");
        }

        private NpgsqlConnection GetConnection() => new(_connection_string);

        private NpgsqlDataReader Query(string query, params NpgsqlParameter[] parameters)
        {
            NpgsqlConnection connection = GetConnection();
            try
            {
                connection.Open();
                using (NpgsqlCommand command = connection.CreateCommand())
                {
                    command.CommandText = query;
                    foreach (NpgsqlParameter param in parameters)
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

        private void PrintQueryError(string title, int rows, NpgsqlDataReader r, Exception e)
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

        // -------------------------- QUERIES ------------------------------------ //
        public void SendMessage(string userID, string subject, string body)
        {
            throw new NotImplementedException();
        }

        /// <inheritdoc />
        public User GetUser(int courseID, string userID)
        {
            _logger.LogInformation(
                "Trying to get user\ncourseID: {courseID}, userID: {userID}",
                courseID,
                userID
            );

            using (
                NpgsqlDataReader r = Query(
                    @"SELECT      users.username,
                                    users.user_id,
                                    users.first_name,
                                    users.middle_name,
                                    users.last_name
                        FROM        users
                        INNER JOIN  user_enrollments
                            ON      users.user_id = user_enrollments.user_id
                        WHERE       user_enrollments.org_unit_id = @courseID
                        AND         users.user_id= @userID",
                    new NpgsqlParameter("userID", int.Parse(userID)),
                    new NpgsqlParameter("courseID", courseID)
                )
            )
            {
                if (r.Read())
                {
                    try
                    {
                        return new User(
                            -1,
                            courseID,
                            r.GetInt32(1),
                            r.GetValue(0).ToString(),
                            r.GetValue(2).ToString()
                                + " "
                                + r.GetValue(3).ToString()
                                + " "
                                + r.GetValue(4).ToString(),
                            r.GetValue(4).ToString() + ", " + r.GetValue(2).ToString(),
                            "Student"
                        );
                    }
                    catch (Exception e)
                    {
                        PrintQueryError("BrigtspaceHandler.GetUserIDs", 0, r, e);
                    }
                }
            }

            _logger.LogWarning("Could not find user");
            return null;
        }

        /// <inheritdoc />
        public IEnumerable<User> GetStudents(int courseID)
        {
            _logger.LogInformation(
                "Trying to get all students for \ncourseID: {courseID}",
                courseID
            );
            List<User> students = new List<User>();
            using (
                NpgsqlDataReader r = Query(
                    @"SELECT        users.username,
                                    users.user_id,
                                    users.first_name,
                                    users.middle_name,
                                    users.last_name
                        FROM        users
                        INNER JOIN  user_enrollments
                            ON      users.user_id = user_enrollments.user_id
                        WHERE       user_enrollments.org_unit_id = @courseID
                        AND        (user_enrollments.role_id = 110
                        OR          user_enrollments.role_id = 130
                        OR          user_enrollments.role_id = 134)",
                    new NpgsqlParameter("courseID", courseID)
                )
            )
            {
                while (r.Read())
                    try
                    {
                        students.Add(
                            new User(
                                -1,
                                courseID,
                                r.GetInt32(1),
                                r.GetValue(0).ToString(),
                                r.GetValue(2).ToString()
                                    + " "
                                    + (
                                        r.GetValue(3).ToString().Equals("\\N")
                                            ? ""
                                            : r.GetValue(3).ToString() + " "
                                    )
                                    + r.GetValue(4).ToString(),
                                r.GetValue(4).ToString() + ", " + r.GetValue(2).ToString(),
                                "Student"
                            )
                        );
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
            _logger.LogInformation(
                "Trying to get all teachers for \ncourseID: {courseID}",
                courseID
            );
            List<User> teachers = new List<User>();
            using (
                NpgsqlDataReader r = Query(
                    @"SELECT      users.username,
                                    users.user_id,
                                    users.first_name,
                                    users.middle_name,
                                    users.last_name
                        FROM        users
                        INNER JOIN  user_enrollments
                            ON      users.user_id = user_enrollments.user_id
                        WHERE       user_enrollments.org_unit_id = @courseID
                        AND        (user_enrollments.role_id = 109
                        OR          user_enrollments.role_id = 117)",
                    new NpgsqlParameter("courseID", courseID)
                )
            )
            {
                while (r.Read())
                {
                    try
                    {
                        teachers.Add(
                            new User(
                                -1,
                                r.GetInt32(1),
                                courseID,
                                r.GetValue(0).ToString(),
                                r.GetValue(2).ToString()
                                    + " "
                                    + (
                                        r.GetValue(3).ToString().Equals("\\N")
                                            ? ""
                                            : r.GetValue(3).ToString() + " "
                                    )
                                    + r.GetValue(4).ToString(),
                                r.GetValue(4).ToString() + ", " + r.GetValue(2).ToString(),
                                "Teacher"
                            )
                        );
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
            _logger.LogInformation(
                "Trying to get all assignments for \ncourseID: {courseID}",
                courseID
            );
            List<AppAssignment> assignments = new List<AppAssignment>();
            using (
                NpgsqlDataReader r = Query(
                    @"SELECT  grade_object_id,
                                org_unit_id,
                                name,
                                end_date,
                                max_points,
                                type_name,
                                grade_object_type_id
                        FROM    grade_objects
                        WHERE   org_unit_id = @courseID
                        AND    (grade_object_type_id = 1
                        OR      grade_object_type_id = 2
                        OR      grade_object_type_id = 4)",
                    new NpgsqlParameter("courseID", courseID)
                )
            )
            {
                while (r.Read())
                {
                    try
                    {
                        assignments.Add(
                            new AppAssignment(
                                -1,
                                r.GetInt32(0),
                                r.GetInt32(1),
                                r.GetValue(2).ToString(),
                                true, //bool published,
                                false, //bool muted,
                                r.GetValue(3).ToString(),
                                r.GetDouble(4),
                                0, //Position
                                mapGradingType(r.GetInt32(6)), // This is mapped to our local enum,
                                "" //"Submission Type"
                            )
                        );
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
        public IEnumerable<AssignmentSubmission> GetSubmissions(
            int courseID,
            IEnumerable<User> users
        )
        {
            List<AssignmentSubmission> submissions = new List<AssignmentSubmission>();

            if (users.Count() == 0) // If there is no consented users, no need to search
                return submissions;

            NpgsqlParameter[] parameters = users
                .Select((user, index) => new NpgsqlParameter($"userID{index}", user.StudentNumber))
                .Concat(new[] { new NpgsqlParameter("courseID", courseID) })
                .ToArray();

            using (
                NpgsqlDataReader r = Query(
                    @$"SELECT  grade_object_id,
                                user_id,
                                points_numerator,
                                points_denominator,
                                grade_text,
                                grade_released_date
                        FROM    grade_results
                        WHERE   org_unit_id = @courseID
                        AND     user_id
                            IN  ({string.Join(",", users.Select((_, index) => $"@userID{index}"))})",
                    parameters
                )
            )
            {
                while (r.Read())
                {
                    try
                    {
                        string rawGrade = r.GetValue(4).ToString();
                        if (rawGrade.IsNullOrEmpty())
                        {
                            submissions.Add(
                                new AssignmentSubmission(
                                    -1,
                                    -1, ///// ????
                                    r.GetInt32(0),
                                    r.GetValue(1).ToString(),
                                    (r.IsDBNull(2) || r.IsDBNull(3))
                                        ? "0"
                                        : (r.GetDouble(2) / r.GetDouble(3)).ToString(),
                                    r.GetValue(5).ToString()
                                )
                            );
                        }
                        else
                        {
                            submissions.Add(
                                new AssignmentSubmission(
                                    -1,
                                    -1, ///// ???
                                    r.GetInt32(0),
                                    r.GetValue(1).ToString(),
                                    rawGrade,
                                    r.GetValue(5).ToString()
                                )
                            );
                        }
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
        public IEnumerable<(AppAssignment, IEnumerable<AssignmentSubmission>)> GetQuizzes(
            int courseID
        )
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

        /////////////////////// Helper Functions ////////////////////////////////
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
                    _logger.LogWarning(
                        "Grade format {Type} is not supported, treating as not graded...",
                        type_id
                    );
                    return AppGradingType.NotGraded;
            }
        }
    }
}
