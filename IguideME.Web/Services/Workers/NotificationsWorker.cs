using System;
using IguideME.Web.Models;
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

                string outperforming = "";
                string closing = "";
                string moreEffort = "";
                foreach (var notification in notifications)
                {
                    Tile tile = DatabaseManager.Instance.GetTile(this.courseID, notification.TileID);
                    switch (notification.Status) {
                        case "outperforming peers":
                            outperforming += $" - {tile.Title}\n";
                            break;
                        case "closing the gap":
                            closing += $" - {tile.Title}\n";
                            break;
                        case "more effort required":
                            moreEffort += $" - {tile.Title}\n";
                            break;
                    }
                }

                string body = "";
                if (outperforming != "")
                    body += $"You are outperforming your peers in:\n{outperforming}\n";
                if (closing != "")
                    body += $"You are closing the gap to your peers in:\n{closing}\n";
                if (moreEffort != "")
                    body += $"You have to put more effort in:\n{moreEffort}";

                if (body != "") {
                    _logger.LogInformation($"Sending notification to {user.LoginID}, {user.UserID}: {body}");
                    canvasTest.sendMessage(user.UserID,
                    "IGuideME",
                    "You are using IguideME, please find your personal feedback below. Visit IguideME in your course for more detailed information.\n\n" + body
                    );
                }

                _logger.LogInformation("Marking notifications as sent...");

                DatabaseManager.Instance.MarkNotificationsSent(this.courseID, user.LoginID);
            }

            _logger.LogInformation("All notifications processed.");
        }
    }
}
