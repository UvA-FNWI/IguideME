using System;
using System.Diagnostics;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using IguideME.Web.Models.Service;
using IguideME.Web.Services.Workers;

namespace IguideME.Web.Services
{
	public interface ICanvasSyncService
	{
		Task<JobResultModel> DoWorkAsync(string JobId, JobParametersModel work,
			CancellationToken cancellationToken);
	}

	public sealed class CanvasSyncService : ICanvasSyncService
	{
		private readonly IComputationJobStatusService _computationJobStatus;
		private readonly CanvasTest _canvasTest;

		public CanvasSyncService(
			IComputationJobStatusService computationJobStatus,
			CanvasTest canvasTest)
		{
			_computationJobStatus = computationJobStatus;
			_canvasTest = canvasTest;
		}

		public async Task<JobResultModel> DoWorkAsync(string jobId, JobParametersModel work,
			CancellationToken cancellationToken)
		{
			var result = new JobResultModel();
			Console.WriteLine(work.CourseID);
			var courseID = 25503;

			string characters = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
			StringBuilder _result = new StringBuilder(10);
			Random random = new Random();
			for (int i = 0; i < 10; i++)
			{
				_result.Append(characters[random.Next(characters.Length)]);
			}
			string hashCode = _result.ToString().ToUpper();
			DatabaseManager.Instance.RegisterSync(courseID, hashCode);
			Console.WriteLine("Sync hash: " + hashCode);

			var sw = new Stopwatch();
			sw.Start();

			new UserWorker(courseID, hashCode, _canvasTest).Register();
			await _computationJobStatus.UpdateJobProgressInformationAsync(
				jobId, $"tasks.students", 0
			).ConfigureAwait(false);

			new QuizWorker(courseID, hashCode, _canvasTest).Register();
			await _computationJobStatus.UpdateJobProgressInformationAsync(
				jobId, $"tasks.quizzes", 0
			).ConfigureAwait(false);

			new DiscussionWorker(courseID, hashCode, this._canvasTest).Load();
			await _computationJobStatus.UpdateJobProgressInformationAsync(
				jobId, $"tasks.discussions", 0
			).ConfigureAwait(false);

			new AssignmentWorker(courseID, hashCode, _canvasTest).Register();
			await _computationJobStatus.UpdateJobProgressInformationAsync(
				jobId, $"tasks.assignments", 0
			).ConfigureAwait(false);

			new GradePredictorWorker(courseID, hashCode).MakePredictions();
			await _computationJobStatus.UpdateJobProgressInformationAsync(
				jobId, $"tasks.grade-predictor", 0
			).ConfigureAwait(false);

			new PeerGroupWorker(courseID, hashCode).Create();
			await _computationJobStatus.UpdateJobProgressInformationAsync(
				jobId, $"tasks.peer-groups", 0
			).ConfigureAwait(false);

			await _computationJobStatus.UpdateJobProgressInformationAsync(
				jobId, $"tasks.done", 0
			).ConfigureAwait(false);

			long duration = sw.ElapsedMilliseconds;
			Console.WriteLine("Took: " + duration.ToString() + "ms");
			DatabaseManager.Instance.CompleteSync(hashCode);

			return result;
		}
	}
}