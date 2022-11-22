using IguideME.Web.LTI;
using IguideME.Web.Services;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Extensions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using System;
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
        readonly SignatureChecker _signatureChecker;

        public LtiController(IConfiguration config)
        {
            _signatureChecker = new SignatureChecker(config["LtiKey"]);
        }

        [HttpPost]
        public async Task<IActionResult> Login()
        {
            // Check the OAuth signature
            var formdata = await HttpContext.Request.ReadFormAsync();
            if (!_signatureChecker.CheckSignature(HttpContext.Request.Method, HttpContext.Request.GetDisplayUrl(), formdata.ToDictionary(k => k.Key, k => (string)k.Value), formdata["oauth_signature"]))
                return Unauthorized($"Signature check failed. Request url: {HttpContext.Request.GetDisplayUrl()}");

            // Register user identity
            var claims = new List<Claim> {
                new Claim("user_name", formdata["lis_person_name_full"]),
                new Claim("user_id", formdata["custom_canvas_user_id"]),
                new Claim("user", formdata["lis_person_sourcedid"]),
                new Claim("course", formdata["custom_canvas_course_id"]),
                new Claim("roles", formdata["roles"]),
                new Claim(ClaimTypes.Role, (formdata["lis_person_sourcedid"] == "evvliet1" || formdata["roles"].ToString().ToLower().Contains("instructor")) ? "instructor" : "student")
            };

            // Check if course is registered into database
            if (!DatabaseManager.Instance.IsCourseRegistered(
                Int32.Parse(formdata["custom_canvas_course_id"])))
            {
                // If not register the course.
                DatabaseManager.Instance.RegisterCourse(
                    Int32.Parse(formdata["custom_canvas_course_id"]),
                    formdata["context_title"]);
            }

            await HttpContext.SignInAsync(new ClaimsPrincipal(new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme, "user", null)));
            return Redirect("/");
        }
    }
}
