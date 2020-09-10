using IguideME.Web.LTI;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Extensions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace IguideME.Web.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class LtiController : ControllerBase
    {
        SignatureChecker signatureChecker;

        public LtiController(IConfiguration config)
        {
            signatureChecker = new SignatureChecker(config["LtiKey"]);
        }

        [HttpPost]
        public async Task<IActionResult> Login()
        {
            // Check the OAuth signature
            var formdata = await HttpContext.Request.ReadFormAsync();
            if (!signatureChecker.CheckSignature(HttpContext.Request.Method, HttpContext.Request.GetDisplayUrl(), formdata.ToDictionary(k => k.Key, k => (string)k.Value), formdata["oauth_signature"]))
                return Unauthorized();

            // Register user identity
            var claims = new List<Claim> {
                new Claim("user_name", formdata["lis_person_name_full"]),
                new Claim("user_id", formdata["custom_canvas_user_id"]),
                new Claim("user", formdata["custom_canvas_user_login_id"]),
                new Claim("course", formdata["custom_canvas_course_id"])
            };
            await HttpContext.SignInAsync(new ClaimsPrincipal(new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme, "user", null)));
            return Redirect("/");
        }
    }
}
