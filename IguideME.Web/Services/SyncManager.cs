using System;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using System.Threading;
using System.Threading.Tasks;

namespace IguideME.Web.Services
{
    public class SyncManager : IHostedService, IDisposable
    {
        private int executionCount = 0;
        private readonly CanvasTest canvasTest;
        private readonly ILogger<SyncManager> _logger;
        private readonly IComputationJobStatusService computationJobStatus;
        private readonly IQueuedBackgroundService queuedBackgroundService;
        private readonly IComputationJobStatusService computationJobStatusService;
        private Timer _timer;

        public SyncManager(
            ILogger<SyncManager> logger,
            IComputationJobStatusService computationJobStatus,
            IQueuedBackgroundService queuedBackgroundService,
            IComputationJobStatusService computationJobStatusService,
            CanvasTest canvasTest)
        {
            _logger = logger;
            this.canvasTest = canvasTest;
            this.computationJobStatus = computationJobStatus;
            this.queuedBackgroundService = queuedBackgroundService;
            this.computationJobStatusService = computationJobStatusService;
        }

        public Task StartAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("Synchronization manager running.");
            _timer = new Timer(TimeSync, null, TimeSpan.Zero, TimeSpan.FromMinutes(1));

            return Task.CompletedTask;
        }

        private async void TimeSync(object state)
        {
            var count = Interlocked.Increment(ref executionCount);

            // check every minute if it's 3:00AM
            var now = DateTime.UtcNow;
            Console.WriteLine("Time is {0}", now.ToString());

            if (now.Hour == 3 && now.Minute == 0)
            {
                var sync = new CanvasSyncService(
                    this.computationJobStatus,
                    this.canvasTest,
                _logger);


                await this.queuedBackgroundService.PostWorkItemAsync(null).ConfigureAwait(false);
                _logger.LogInformation("Execute");
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
