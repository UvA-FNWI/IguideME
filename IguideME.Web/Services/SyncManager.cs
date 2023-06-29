using System;
using System.Collections.Generic;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using System.Threading;
using System.Threading.Tasks;
using IguideME.Web.Models.Service;

namespace IguideME.Web.Services
{
    public class SyncManager : IHostedService, IDisposable
    {
        private int _executionCount = 0;
        private readonly CanvasHandler _canvasHandler;
        private readonly ILogger<SyncManager> _logger;
        private readonly IComputationJobStatusService _computationJobStatus;
        private readonly IQueuedBackgroundService _queuedBackgroundService;
        private Timer _timer;

        public SyncManager(
            ILogger<SyncManager> logger,
            IComputationJobStatusService computationJobStatus,
            IQueuedBackgroundService queuedBackgroundService,
            CanvasHandler canvasHandler)
        {
            _logger = logger;
            this._canvasHandler = canvasHandler;
            this._computationJobStatus = computationJobStatus;
            this._queuedBackgroundService = queuedBackgroundService;
        }

        public Task StartAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("Synchronization manager running.");
            _timer = new Timer(TimeSync, null, TimeSpan.Zero, TimeSpan.FromMinutes(30));

            return Task.CompletedTask;
        }

        private async void TimeSync(object state)
        {
            Interlocked.Increment(ref _executionCount);

            // check every half hour if it's 3:00AM
            var now = DateTime.UtcNow;
            Console.WriteLine("Time is {0}", now.ToString());

            if (DatabaseManager.getInstance() != null && now.Hour == 3 && now.Minute <= 30)
            {
                new CanvasSyncService(
                    this._computationJobStatus,
                    this._canvasHandler,
                    _logger
                );

                List<int> course_ids = DatabaseManager.getInstance().GetCourseIds();

                foreach (int id in course_ids) {
                    JobParametersModel parameters = new()
                    {
                            CourseID = id,
                            Notifications_bool = true
                    };
                    await this._queuedBackgroundService.PostWorkItemAsync(parameters).ConfigureAwait(false);
                    _logger.LogInformation("Execute");
                }
            }
        }

        public Task StopAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("Synchronization manager is stopping.");
            _timer?.Change(Timeout.Infinite, 0);

            return Task.CompletedTask;
        }

        public void Dispose()
        {
            _timer?.Dispose();
        }
    }
}
