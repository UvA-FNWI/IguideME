using System;
using System.Collections.Generic;
using System.Data.SQLite;
using System.Text.Json;
using IguideME.Web.Models;

namespace IguideME.Web.Services
{
    public sealed class DatabaseManager
    {
        private static readonly DatabaseManager instance = new DatabaseManager();
        private readonly SQLiteConnection connection = new SQLiteConnection("Data Source=IguideME.db;Version=3;New=False;Compress=True;");
        private static SQLiteCommand command;

        static DatabaseManager() {}

        private DatabaseManager() {
            connection.Open();
            CreateTables();
        }

        public static DatabaseManager Instance
        {
            get
            {
                return instance;
            }
        }

        private void CreateTables()
        {
            SQLiteCommand command;
            var queries = new List<string>();

            queries.Add(
                String.Format(
                    @"CREATE TABLE IF NOT EXISTS consent (
                        id          INTEGER PRIMARY KEY AUTOINCREMENT,
                        course_id   INTEGER,
                        user_id     INTEGER,
                        granted     INTEGER
                    );"
                )
            );

            queries.Add(
                String.Format(
                    @"CREATE TABLE IF NOT EXISTS practice_sessions (
                        id              INTEGER PRIMARY KEY AUTOINCREMENT,
                        group_id        STRING,
                        course_id       INTEGER,
                        studentnaam     STRING,
                        grade           FLOAT
                    );"
                )
            );

            queries.Add(
                String.Format(
                    @"CREATE TABLE IF NOT EXISTS attendance (
                        id              INTEGER PRIMARY KEY AUTOINCREMENT,
                        group_id        STRING,
                        course_id       INTEGER,
                        studentnaam     STRING,
                        present         STRING
                    );"
                )
            );

            queries.Add(
                String.Format(
                    @"CREATE TABLE IF NOT EXISTS perusall (
                        id              INTEGER PRIMARY KEY AUTOINCREMENT,
                        group_id        STRING,
                        course_id       INTEGER,
                        studentnaam     STRING,
                        grade           FLOAT,
                        entry           STRING
                    );"
                )
            );

            foreach (var query in queries)
            {
                command = connection.CreateCommand();
                command.CommandText = query;
                command.ExecuteNonQuery();
            }
        }

        private SQLiteDataReader Query(string query)
        {
            SQLiteDataReader sqlite_datareader;

            command = connection.CreateCommand();
            command.CommandText = query;

            sqlite_datareader = command.ExecuteReader();
            return sqlite_datareader;
        }

        public void SetConsent(ConsentData data)
        {
            if (GetConsent(data.CourseID, data.UserID) == -1)
            {
                command = connection.CreateCommand();
                command.CommandText = String.Format(
                    "INSERT INTO consent (course_id, user_id, granted) VALUES('{0}', '{1}', '{2}');",
                    data.CourseID, data.UserID, data.Granted
                );
                command.ExecuteNonQuery();
            } else
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
                "SELECT `granted` from `consent` WHERE `course_id`={0} AND `user_id`={1}",
                CourseID, UserID
            );

            SQLiteDataReader r = Query(query);

            if (r.Read()) return r.GetInt32(0);
            else return -1;
        }

        public void AddAttendance(int CourseID, string Lecture, AttendanceData[] sessions)
        {
            foreach (var session in sessions)
            {
                command = connection.CreateCommand();
                command.CommandText = String.Format(
                    "INSERT INTO attendance (course_id, studentnaam, present, group_id) VALUES('{0}', '{1}', '{2}', '{3}');",
                    CourseID, session.UserName, session.Present, Lecture
                );
                command.ExecuteNonQuery();
            }
        }

        public AttendanceData[] GetAttendance(int CourseID, string UserName)
        {
            string query = UserName != null ?
                String.Format(
                    "SELECT `studentnaam`, `present`, `group_id` from `attendance` WHERE `course_id`={0} AND `studentnaam`='{1}'",
                    CourseID, UserName
                ) : String.Format(
                    "SELECT `studentnaam`, `present`, `group_id` from `attendance` WHERE `course_id`={0}",
                    CourseID
                );

            SQLiteDataReader r = Query(query);
            List<AttendanceData> attendances = new List<AttendanceData>();

            while (r.Read())
            {
                AttendanceData attendance = new AttendanceData(CourseID, r.GetString(0), r.GetString(1), r.GetString(2));
                attendances.Add(attendance);
            }

            return attendances.ToArray();
        }

        public void AddPracticeSession(int CourseID, String Session, PracticeSessionData[] Sessions)
        {
            foreach (var session in Sessions)
            {
                command = connection.CreateCommand();
                command.CommandText = String.Format(
                    "INSERT INTO practice_sessions (course_id, studentnaam, grade, group_id) VALUES('{0}', '{1}', '{2}', '{3}');",
                    CourseID, session.UserName, session.Grade, Session
                );
                command.ExecuteNonQuery();
            }
        }

        public PracticeSessionData[] GetPracticeSessions(int CourseID, string UserName)
        {
            string query = UserName != null ?
                String.Format(
                    "SELECT `studentnaam`, `grade`, `group_id` from `practice_sessions` WHERE `course_id`={0} AND `studentnaam`='{1}'",
                    CourseID, UserName
                ) : String.Format(
                    "SELECT `studentnaam`, `grade`, `group_id` from `practice_sessions` WHERE `course_id`={0}",
                    CourseID
                );

            SQLiteDataReader r = Query(query);
            List<PracticeSessionData> sessions = new List<PracticeSessionData>();

            while (r.Read())
            {
                PracticeSessionData session = new PracticeSessionData(CourseID, r.GetString(0), r.GetFloat(1), r.GetString(2));
                sessions.Add(session);
            }

            return sessions.ToArray();
        }

        public void AddPerusall(int CourseID, String Session, PerusallData[] Sessions)
        {
            foreach (var session in Sessions)
            {
                command = connection.CreateCommand();
                command.CommandText = String.Format(
                    "INSERT INTO perusall (course_id, studentnaam, grade, group_id, entry) VALUES('{0}', '{1}', '{2}', '{3}', '{4}');",
                    CourseID, session.UserName, session.Grade, Session, session.Entry
                );
                command.ExecuteNonQuery();
            }
        }

        public PerusallData[] GetPerusall(int CourseID, string UserName)
        {
            string query = UserName != null ?
                String.Format(
                    "SELECT `studentnaam`, `grade`, `entry`, `group_id` from `perusall` WHERE `course_id`={0} AND `studentnaam`='{1}'",
                    CourseID, UserName
                ) : String.Format(
                    "SELECT `studentnaam`, `grade`, `entry`, `group_id` from `perusall` WHERE `course_id`={0}",
                    CourseID
                );

            SQLiteDataReader r = Query(query);
            List<PerusallData> perusall = new List<PerusallData>();

            while (r.Read())
            {
                PerusallData row = new PerusallData(CourseID, r.GetString(0), r.GetFloat(1), r.GetString(2), r.GetString(3));
                perusall.Add(row);
            }

            return perusall.ToArray();
        }
    }
}
