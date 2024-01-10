
using System.Collections.Generic;

using IguideME.Web.Models.App;
using IguideME.Web.Models.Impl;

namespace IguideME.Web.Services.LMSHandlers
{

    public enum Backends
    {
        Canvas,
        Brightspace
    }

    public interface ILMSHandler
    {

        /// <summary>
        /// Takes care of any setup required before the sync e.g. refreshing connections.
        /// </summary>
		void SyncInit();

        /// <summary>
        /// Sends a message to a user.
        /// </summary>
        /// <param name="userID">The id of the user to send the message to.</param>
        /// <param name="subject">The subject of the conversation.</param>
        /// <param name="body">The message to be send.</param>
        public void SendMessage(string userID, string subject, string body);

        /// <summary>
        /// Get a user for a course.
        /// </summary>
        /// <param name="courseID">The course to get the user from.</param>
        /// <param name="userID">The id of the user.</param>
        /// <returns>The requested user if found.</returns>
		string[] GetUserIDs(int courseID, string userID);

        /// <summary>
        /// Get all the users with the student role for a course.
        /// </summary>
        /// <param name="courseID">The id of the course.</param>
        /// <returns>A list of students for the course.</returns>
		IEnumerable<User> GetStudents(int courseID);

        /// <summary>
        /// Get all the users with the admin role for a course.
        /// </summary>
        /// <param name="courseID">The id of the course.</param>
        /// <returns>A list of administrators for the course.</returns>
		IEnumerable<User> GetAdministrators(int courseID);

        /// <summary>
        /// Gets all the non null assignments for a course from the LMS.
        /// </summary>
        /// <param name="courseID">The id of the course the assignments are from.</param>
        /// <returns>An iterable with assignments for the course.</returns>
		IEnumerable<AppAssignment> GetAssignments(int courseID);

        /// <summary>
        /// Gets all the quizzes for a course.
        /// </summary>
        /// <param name="courseID">The id of the course the quizzes are from.</param>
        /// <returns>A list of quizzes.</returns>
		IEnumerable<(AppAssignment, IEnumerable<AssignmentSubmission>)> GetQuizzes(int courseID);

        /// <summary>
        /// Gets all the submissions for a list of (consented) students for a course from the LMS.
        /// </summary>
        /// <param name="courseID">The id of the course the assignments are from.</param>
        /// <param name="userIDs">The list of student ids that have given consent that the submissions are from.</param>
        /// <returns>An iterable with submissions for the course.</returns>
		IEnumerable<AssignmentSubmission> GetSubmissions(int courseID, string[] userIDs);

        /// <summary>
        /// Gets all the Discussions for a course.
        /// </summary>
        /// <param name="courseID">The id of the course the quizzes are from.</param>
        /// <returns>A list of discussions.</returns>
		IEnumerable<AppDiscussion> GetDiscussions(int courseID);
    }
}
