using System;
using System.Collections.Generic;
using System.Linq;

using IguideME.Web.Models;
using IguideME.Web.Models.App;
using IguideME.Web.Models.Impl;
using IguideME.Web.Services.LMSHandlers;
using Microsoft.Extensions.Logging;

namespace IguideME.Web.Services.Workers
{
    /// <summary>
    /// Class <a>NotificationsWorker</a> models a worker that handles the sending of performance notifications.
    /// </summary>
    public class NotificationsWorker : IWorker
    {
        readonly private ILogger<SyncManager> _logger;
        readonly private ILMSHandler _canvasHandler;
        readonly private DatabaseManager _databaseManager;

        readonly private bool _sendNotifications;

        readonly private int _courseID;
        readonly private long _syncID;

        /// <summary>
        /// This constructor initializes the new NotificationsWorker to
        /// (<paramref name="courseID"/>, <paramref name="syncID"/>, <paramref name="canvasHandler"/>, <paramref name="send_notifications"/>, <paramref name="logger"/>).
        /// </summary>
        /// <param name="courseID">the id of the course.</param>
        /// <param name="syncID">the hash code associated to the current sync.</param>
        /// <param name="canvasHandler">a reference to the class managing the connection with canvas.</param>
        /// <param name="send_notifications">wether or not to send notifications this sync.</param>
        /// <param name="logger">a reference to the logger used for the sync.</param>
        public NotificationsWorker(
            int courseID,
            long syncID,
            ILMSHandler canvasHandler,
            DatabaseManager databaseManager,
            bool sendNotifications,
            ILogger<SyncManager> logger)
        {
            _logger = logger;
            this._courseID = courseID;
            this._syncID = syncID;
            this._canvasHandler = canvasHandler;
            this._databaseManager = databaseManager;
            this._sendNotifications = sendNotifications;
        }

        /// <summary>
        /// Creates and sends a canvas message to a user with a performance notification.
        /// </summary>
        /// <param name="student">the student to send the notification to.</param>
        private void SendNotificationsToStudent(User student)
        {
            List<Notification> notifications = _databaseManager.GetPendingNotifications(this._courseID, student.UserID, _syncID);

            _logger.LogInformation("Student {ID} has {Count} notifications queued up.", student.UserID, notifications.Count);

            // Create lists of tiles where the student is outperformin/closing the gap/more effort is required.
            string outperforming = "";
            string closing = "";
            string falling = "";
            string moreEffort = "";
            foreach (Notification notification in notifications)
            {
                Tile tile = _databaseManager.GetTile(this._courseID, notification.TileID);
                switch (notification.Status)
                {
                    case Notification_Types.outperforming:
                        outperforming += $"    - {tile.Title}\n";
                        break;
                    case Notification_Types.closing_gap:
                        closing += $"    - {tile.Title}\n";
                        break;
                    case Notification_Types.falling_behind:
                        falling += $"    - {tile.Title}\n";
                        break;
                    case Notification_Types.more_effort:
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
            if (!string.IsNullOrEmpty(falling))
                body += "You are falling behind your peers in:\n" + falling + "\n";
            if (!string.IsNullOrEmpty(moreEffort))
                body += "You have to put more effort in:\n" + moreEffort + "\n";

            if (!string.IsNullOrEmpty(body))
            {
                body = "You are using IguideME, please find your personal feedback below. Visit IguideME in your course for more detailed information.\n\n" + body;
                _logger.LogInformation("Sending notification to {ID}: {Body}", student.UserID, body);
                _canvasHandler.SendMessage(student.StudentNumber.ToString(),
                "IguideME",
                body
                );
            }

            _logger.LogInformation("Marking notifications as sent...");

            _databaseManager.MarkNotificationsSent(this._courseID, student.UserID);

        }

        private bool CheckSend()
        {
            var notificationDates = _databaseManager.GetNotificationDates(_courseID);

            string selectedDates = notificationDates.selectedDates;
            if (string.IsNullOrEmpty(selectedDates)) return false;

            string[] dates = selectedDates.Split(new [] { ", " }, StringSplitOptions.RemoveEmptyEntries);
            DateTime today = DateTime.Now.Date;

            bool send = false;
            if (notificationDates.isRange)
            {
                string[] selectedDays = notificationDates.selectedDays.Split(new [] { ", " }, StringSplitOptions.RemoveEmptyEntries);
                string firstSelectedDate = dates[0];
                string lastSelectedDate = dates[^1];

                // Check if today is in the range of firstSelectedDate and lastSelectedDate
                if (today >= DateTime.Parse(firstSelectedDate) && today <= DateTime.Parse(lastSelectedDate))
                {
                    string todayDayOfWeek = today.DayOfWeek.ToString();
                    foreach (string selectedDay in selectedDays)
                    {
                        if (todayDayOfWeek == selectedDay)
                        {
                            send = true;
                            break;
                        }
                    }
                }
            }
            else
            {
                send = dates.Any(date => DateTime.Parse(date).Date == today);
            }

            return _sendNotifications && send;
        }

        /// <summary>
        /// Starts the notifications worker.
        /// </summary>
        public void Start()
        {
            _logger.LogInformation("Starting notifications sync...");

            if (!CheckSend())
            {
                _logger.LogInformation("Not sending notifications this sync");
                return;
            }

            List<User> students = _databaseManager.GetUsers(this._courseID, (int)UserRoles.student, this._syncID);

            foreach (User student in students)
            {
                _logger.LogInformation("Handling notifications for {} for course {}", student.UserID, _courseID);
                if (!_databaseManager.GetNotificationEnable(this._courseID, student.UserID, this._syncID))
                {
                    _logger.LogInformation("Not sending to {ID}, they have notifications disabled", student.UserID);
                }
                this.SendNotificationsToStudent(student);
            }

            _logger.LogInformation("All notifications processed.");
        }
    }
}
