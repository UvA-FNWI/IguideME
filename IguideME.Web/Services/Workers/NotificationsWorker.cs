using System;
using System.Collections.Generic;

using IguideME.Web.Models;
using IguideME.Web.Models.App;
using IguideME.Web.Models.Impl;

using Microsoft.Extensions.Logging;

namespace IguideME.Web.Services.Workers
{
    /// <summary>
    /// Class <a>NotificationsWorker</a> models a worker that handles the sending of performance notifications.
    /// </summary>
    public class NotificationsWorker
    {
        readonly private ILogger<SyncManager> _logger;
        readonly private CanvasHandler _canvasHandler;
        readonly private int _courseID;
        readonly private string _hashCode;

        readonly private bool _send_notifications;

        /// <summary>
        /// This constructor initializes the new NotificationsWorker to
        /// (<paramref name="courseID"/>, <paramref name="hashCode"/>, <paramref name="canvasHandler"/>, <paramref name="send_notifications"/>, <paramref name="logger"/>).
        /// </summary>
        /// <param name="courseID">the id of the course.</param>
        /// <param name="hashCode">the hash code associated to the current sync.</param>
        /// <param name="canvasHandler">a reference to the class managing the connection with canvas.</param>
        /// <param name="send_notifications">wether or not to send notifications this sync.</param>
        /// <param name="logger">a reference to the logger used for the sync.</param>
        public NotificationsWorker(
            int courseID,
            string hashCode,
            CanvasHandler canvasHandler,
            bool send_notifications,
            ILogger<SyncManager> logger)
        {
            _logger = logger;
            this._courseID = courseID;
            this._hashCode = hashCode;
            this._canvasHandler = canvasHandler;
            this._send_notifications = send_notifications;
        }

        /// <summary>
        /// Creates and sends a canvas message to a user with a performance notification.
        /// </summary>
        /// <param name="student">the student to send the notification to.</param>
        private void SendNotificationsToStudent(User student)
        {
            List<Notification> notifications = DatabaseManager.Instance.GetPendingNotifications(this._courseID, student.UserID);

            _logger.LogInformation("Student {ID} has {Count} notifications queued up.", student.UserID, notifications.Count);

            // Create lists of tiles where the student is outperformin/closing the gap/more effort is required.
            string outperforming = "";
            string closing = "";
            string moreEffort = "";
            foreach (Notification notification in notifications)
            {
                Tile tile = DatabaseManager.Instance.GetTile(this._courseID, notification.TileID);
                switch (notification.Status)
                {
                    case "outperforming peers":
                        outperforming += $"    - {tile.Title}\n";
                        break;
                    case "closing the gap":
                        closing += $"    - {tile.Title}\n";
                        break;
                    case "more effort required":
                        moreEffort += $"    - {tile.Title}\n";
                        break;
                }
            }

            // Add titles to each list in the body of the message.
            string body = "";
            if (!string.IsNullOrEmpty(outperforming))
                body += "You are outperforming your peers in:\n" + outperforming + "\n";
            if (!string.IsNullOrEmpty(closing))
                body += "You are closing the gap to your peers in:\n" + closing + "\n";
            if (!string.IsNullOrEmpty(moreEffort))
                body += "You have to put more effort in:\n" + moreEffort + "\n";

            if (!string.IsNullOrEmpty(body)) {
                body = "You are using IguideME, please find your personal feedback below. Visit IguideME in your course for more detailed information.\n\n" + body;
                _logger.LogInformation("Sending notification to {ID}: {Body}", student.UserID, body);
                _canvasHandler.SendMessage(student.UserID,
                "IguideME",
                body
                );
            }

            _logger.LogInformation("Marking notifications as sent...");

            DatabaseManager.Instance.MarkNotificationsSent(this._courseID, student.UserID);

        }

        /// <summary>
        /// Starts the notifications worker.
        /// </summary>
        public void Start()
        {
            _logger.LogInformation("Starting notifications sync...");

            if (!_send_notifications) {
                _logger.LogInformation("Not sending notifications this sync");
                return;
            }

            List<User> students = DatabaseManager.Instance.GetUsers(this._courseID, "student", this._hashCode);

            foreach (User student in students)
            {
                if (!DatabaseManager.Instance.GetNotificationEnable(this._courseID, student.UserID)) {
                    _logger.LogInformation("Not sending to {ID}, they have notifications disabled", student.UserID);
                }
                this.SendNotificationsToStudent(student);
            }

            _logger.LogInformation("All notifications processed.");
        }
    }
}
