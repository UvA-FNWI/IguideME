using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using IguideME.Web.Services;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace IguideME.Web.Controllers
{
    [Authorize]
    [ApiController]
    [Route("[controller]")]
    public class DataController : ControllerBase
    {
        private readonly ILogger<DataController> logger;
        private readonly CanvasTest canvasTest;

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
    }
}
