using System;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using System.Threading;
using System.Threading.Tasks;
using IguideME.Web.Models.Service;

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
            _timer = new Timer(TimeSync, null, TimeSpan.Zero, TimeSpan.FromMinutes(30));

            return Task.CompletedTask;
        }

        private async void TimeSync(object state)
        {
            var count = Interlocked.Increment(ref executionCount);

            // check every minute if it's 3:00AM
            var now = DateTime.UtcNow;
            Console.WriteLine("Time is {0}", now.ToString());

            if (now.Hour == 3 && now.Minute <= 30)
            {
                var sync = new CanvasSyncService(
                    this.computationJobStatus,
                    this.canvasTest,
                _logger);

                // TODO: fix hard code, somehow get and store courseID on the system after received from web.
                JobParametersModel parameters = new JobParametersModel();
                parameters.CourseID = 32173;

                await this.queuedBackgroundService.PostWorkItemAsync(parameters).ConfigureAwait(false);
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
