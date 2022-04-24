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
        }
    }
}
