using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using IguideME.Web.Services;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using System.Net.Http;
using System;
using UvA.DataNose.Connectors.Canvas;

namespace IguideME.Web.Controllers
{
    [Authorize]
    [ApiController]
    [Route("[controller]")]
    public class DataController : ControllerBase
    {
        private readonly ILogger<DataController> logger;
        private readonly CanvasTest canvasTest;
        private static readonly HttpClient client = new HttpClient();

        public DataController(ILogger<DataController> logger, CanvasTest canvasTest)
        {
            this.logger = logger;
            this.canvasTest = canvasTest;
        }

        [HttpGet]
        public IEnumerable<string> Get()
            => canvasTest.GetStudents(994);

        [HttpGet]
        [Route("/Account")]
        public async Task<string> GetAccount()
        {
            var auth = await HttpContext.AuthenticateAsync();
            return auth.Principal.Identity.Name;
        }

        [HttpGet]
        [Route("/Quizzes")]
        public async Task<string> GetQuizzes()
        {
            var quizzes = canvasTest.GetQuizzes(994);
            var submissions = quizzes.Select(quiz => quiz.Submissions);
            var questions = new List<object>();

            // fetch questions per quiz submission
            for (int i = 0; i < submissions.Count(); i++)
            {
                var url = canvasTest.baseUrl + canvasTest.apiVersioning +
                    $"courses/{quizzes[i].CourseID}/quizzes/{quizzes[i].ID}" +
                    $"/questions?access_token={canvasTest.accessToken}";

                HttpResponseMessage response = await client.GetAsync(url);
                response.EnsureSuccessStatusCode();

                // refrain from QuizSubmission type because the answers field is required
                object[] quiz_submission_data = JsonConvert.DeserializeObject<object[]>(
                    await response.Content.ReadAsStringAsync()
                );

                // append quiz questions to the collection
                questions = questions.Concat(quiz_submission_data).ToList();
            }

            return JsonConvert.SerializeObject(questions);
        }

        [HttpGet]
        [Route("/Enrollments")]
        public async Task<string> GetEnrollments()
        {
            var url = canvasTest.baseUrl + canvasTest.apiVersioning +
                    $"courses/994/enrollments?access_token={canvasTest.accessToken}";

            HttpResponseMessage response = await client.GetAsync(url);
            response.EnsureSuccessStatusCode();

            // refrain from QuizSubmission type because the answers field is required
            var enrollment = JsonConvert.DeserializeObject<Enrollment[]>(
                await response.Content.ReadAsStringAsync()
            ).Where(enrollment => enrollment.CourseID == 994).First();

            return JsonConvert.SerializeObject(enrollment);
        }
    }
}
