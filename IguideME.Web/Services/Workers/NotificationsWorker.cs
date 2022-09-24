using System;
using Microsoft.Extensions.Logging;

namespace IguideME.Web.Services.Workers
{
    public class NotificationsWorker
    {
        private readonly ILogger<SyncManager> _logger;
        private CanvasTest canvasTest;
        private int courseID;
        private string hashCode;

        public NotificationsWorker(
            int courseID,
            string hashCode,
            CanvasTest canvasTest,
            ILogger<SyncManager> logger)
        {
            _logger = logger;
            this.courseID = courseID;
            this.hashCode = hashCode;
            this.canvasTest = canvasTest;
        }

        public void Register()
        {
            _logger.LogInformation("Starting notifications sync...");

            foreach (var user in DatabaseManager.Instance.GetUsers(this.courseID))
            {
                var notifications = DatabaseManager.Instance.GetPendingNotifications(this.courseID, user.LoginID);

                _logger.LogInformation("Student " + user.LoginID + ", " + user.UserID + " has " + notifications.Count + " notifications queued up.");

                foreach (var notification in notifications)
                {
                    _logger.LogInformation("Sending message to " + user.LoginID + ", " + user.UserID + ": " + notification.Status);

                    canvasTest.sendMessage(user.UserID,
                    "IGuideME",
                    notification.Status);
                }

                _logger.LogInformation("Marking notifications as sent...");

                DatabaseManager.Instance.MarkNotificationsSent(this.courseID, user.LoginID);
            }

            _logger.LogInformation("All notifications processed.");
        }
    }
}
