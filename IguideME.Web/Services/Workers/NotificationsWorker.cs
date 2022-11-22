using System;
using IguideME.Web.Models;
using Microsoft.Extensions.Logging;

namespace IguideME.Web.Services.Workers
{
    public class NotificationsWorker
    {
        private readonly ILogger<SyncManager> _logger;
        private readonly CanvasTest _canvasTest;
        private readonly int _courseID;
        private readonly string _hashCode;
        private readonly bool _send_notifications;

        public NotificationsWorker(
            int courseID,
            string hashCode,
            CanvasTest canvasTest,
            bool send_notifications,
            ILogger<SyncManager> logger)
        {
            _logger = logger;
            this._courseID = courseID;
            this._hashCode = hashCode;
            this._canvasTest = canvasTest;
            this._send_notifications = send_notifications;
        }

        public void Register()
        {
            _logger.LogInformation("Starting notifications sync...");

            if (!_send_notifications) {
                _logger.LogInformation("Not sending notifications today");
                return;
            }

            foreach (var user in DatabaseManager.Instance.GetUsers(this._courseID))
            {
                var notifications = DatabaseManager.Instance.GetPendingNotifications(this._courseID, user.LoginID);

                _logger.LogInformation("Student " + user.LoginID + ", " + user.UserID + " has " + notifications.Count + " notifications queued up.");

                string outperforming = "";
                string closing = "";
                string moreEffort = "";
                foreach (var notification in notifications)
                {
                    Tile tile = DatabaseManager.Instance.GetTile(this._courseID, notification.TileID);
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
                if (!string.IsNullOrEmpty(outperforming))
                    body += @$"You are outperforming your peers in:
                               {outperforming}
                               ";
                if (!string.IsNullOrEmpty(closing))
                    body += @$"You are closing the gap to your peers in:
                               {closing}
                               ";
                if (!string.IsNullOrEmpty(moreEffort))
                    body += @$"You have to put more effort in:
                               {moreEffort}
                               ";

                if (!string.IsNullOrEmpty(body)) {
                    _logger.LogInformation($"Sending notification to {user.LoginID}, {user.UserID}: {body}");
                    _canvasTest.SendMessage(user.UserID,
                    "IGuideME",
                    @$"You are using IguideME, please find your personal feedback below. Visit IguideME in your course for more detailed information.

                       {body}"
                    );
                }

                _logger.LogInformation("Marking notifications as sent...");

                DatabaseManager.Instance.MarkNotificationsSent(this._courseID, user.LoginID);
            }

            _logger.LogInformation("All notifications processed.");
        }
    }
}
