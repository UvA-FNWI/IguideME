using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using IguideME.Web.Services;
using IguideME.Web.Services.Data;
using IguideME.Web.Services.LMSHandlers;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Headers;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.AspNetCore.Server.Kestrel.Core;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Tokens;
using Microsoft.Net.Http.Headers;
using StackExchange.Redis;
using UvA.LTI;
using UserRoles = IguideME.Web.Models.Impl.UserRoles;

// //======================== Builder configuration =========================//


//    /------------------------- Create builder --------------------------/

const string FRONTEND_PREFIX = "/front";

// Create a new WebApplicationBuilder for setting up the application.
WebApplicationBuilder builder = WebApplication.CreateBuilder(
// new WebApplicationOptions
// {
//     Args = args, // command-line arguments passed to the app
//     WebRootPath = "wwwroot/dist" // specifies the path to the web root directory
// }
);
builder.Services.AddSpaStaticFiles(configuration =>
{
    configuration.RootPath = "wwwroot/dist";
});
builder.Services.AddHttpLogging(o => { });
//    /------------------------ Read appsettings.json -------------------------/

// "UnsecureApplicationSettings:UseRedisCache" - indicates whether to use Redis cache or not.
Backends lms;
if (!Backends.TryParse(builder.Configuration.GetSection("LMS:Backend").Value, out lms))
{
    // Console.WriteLine();
    throw new Exception("Incorrect settings for LMS:Backend");
}

bool useRedisCache = bool.Parse(
    builder.Configuration.GetSection("UnsecureApplicationSettings:UseRedisCache").Value
);

// "UnsecureApplicationSettings:RedisCacheConnectionString" - contains the Redis cache connection string.
string redisCacheConnectionString = builder
    .Configuration.GetSection("UnsecureApplicationSettings:RedisCacheConnectionString")
    .Value;

// "LTI:SigningKey" - is the key used for LTI authentication and to generate own key.
string key = builder.Configuration.GetSection("LTI:SigningKey").Value;

// Use the specified key to create a symmetric security key for own authorization using JWTs.
SymmetricSecurityKey signingKey = new(Encoding.ASCII.GetBytes(key));

//    /----------------------- Configure services ------------------------/

// Add Razor pages (just index.cshtml)
// builder.Serices.AddRazorPages();

// work object, where the computations are done.
builder.Services.AddTransient<ICanvasSyncService, CanvasSyncService>();

// QueuedBackgroundService is a dual-purpose service
builder.Services.AddHostedService<QueuedBackgroundService>();
builder.Services.AddTransient<IQueuedBackgroundService, QueuedBackgroundService>();

builder.Services.AddHostedService<SyncManager>();

// Manages jobs
builder.Services.AddTransient<IComputationJobStatusService, ComputationJobStatusService>();

if (useRedisCache && !string.IsNullOrWhiteSpace(redisCacheConnectionString))
{
    // setup redis cache for horizontally scaled services
    builder.Services.AddSingleton<IConnectionMultiplexer>(
        ConnectionMultiplexer.Connect(redisCacheConnectionString)
    );

    // job status service, CRUD operations on jobs stored in redis cache.
    builder.Services.AddTransient<IJobStorageService, RedisCacheJobStorageService>();
}
else
{
    // strictly for testing purposes
    builder.Services.AddTransient<IJobStorageService, MemoryCacheJobStorageService>();
}

// Add authorization (validating the JWT)
builder
    .Services.AddAuthorization()
    .AddAuthentication(opt =>
        opt.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme
    )
    .AddJwtBearer(opt =>
    {
        opt.TokenValidationParameters.ValidateAudience = false;
        opt.TokenValidationParameters.ValidIssuer = "lti";
        opt.TokenValidationParameters.IssuerSigningKey = signingKey;
    });

// Add a policy that checks whether a user is an admin.
builder.Services.AddAuthorization(options =>
    options.AddPolicy("IsInstructor", policy => policy.RequireRole(UserRoles.instructor.ToString()))
);

builder.Services.Configure<ForwardedHeadersOptions>(opt =>
{
    opt.ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto;
    opt.KnownNetworks.Clear();
    opt.KnownProxies.Clear();
});

builder.Services.Configure<KestrelServerOptions>(options => options.AllowSynchronousIO = true);

// If using IIS:
builder.Services.Configure<IISServerOptions>(options => options.AllowSynchronousIO = true);

builder.Services.AddControllersWithViews();

switch (lms)
{
    case Backends.Brightspace:
        builder.Services.AddSingleton<ILMSHandler, BrightspaceHandler>();
        break;
    case Backends.Canvas:
        builder.Services.AddSingleton<ILMSHandler, CanvasHandler>();
        break;
}
builder.Services.AddSingleton<DatabaseManager>(_ => DatabaseManager.GetInstance());

builder.Services.AddHttpClient();

builder
    .Services.AddControllers()
    .AddJsonOptions(options => options.JsonSerializerOptions.PropertyNamingPolicy = null);

builder.Services.AddControllers().AddNewtonsoftJson();

// //========================== App configuration ===========================//


WebApplication app = builder.Build();

var ltiConfig = builder.Configuration.GetSection("LTI");
app.UseForwardedHeaders();

// Set the correct location for the database for prod/dev environments the first time the instance is created.
DatabaseManager db = DatabaseManager.GetInstance(app.Environment.IsDevelopment());

string GetUserID(string userid, string course)
{
    if (String.IsNullOrEmpty(userid))
    {
        throw new Exception("No userid in claims.");
    }
    int courseid = int.Parse(course);
    if (int.TryParse(userid, out int id))
    {
        string userID = db.GetUserID(id);
        if (userID != null)
        {
            return userID;
        }
    }
    // Try's to find the user in canvas.

    string[] ids = app.Services.GetService<ILMSHandler>().GetUserIDs(courseid, userid);

    foreach (string lms_id in ids)
    {
        if (!String.IsNullOrEmpty(lms_id))
        {
            return lms_id;
        }
    }

    return userid;
}

app.UseLti(
    new LtiOptions
    {
        ClientId = ltiConfig["ClientId"] ?? throw new Exception("Client id not set"),
        AuthenticateUrl =
            ltiConfig["AuthenticateUrl"] ?? throw new Exception("Authenticate url not set"),
        JwksUrl = ltiConfig["JwksUrl"] ?? throw new Exception("Jwks url not set"),
        SigningKey = key,
        RedirectUrl = FRONTEND_PREFIX,
        ClaimsMapping = p =>
        {
            string courseID;
            System.Text.Json.JsonElement r_courseID;
            if ((p.CustomClaims?.TryGetProperty("courseid", out r_courseID) ?? false))
            {
                courseID = r_courseID.ToString();
            }
            else
            {
                courseID = p.Context.Id;
            }
            string userid = p.CustomClaims?.GetProperty("userid").ToString();
            return new Dictionary<string, object>
            {
                [ClaimTypes.NameIdentifier] = p.NameIdentifier!.Split("_").Last(),
                ["contextLabel"] = p.Context.Label,
                ["courseName"] = p.Context.Title,
                ["user_name"] = p.Name,
                ["courseid"] = courseID,
                ["userid"] = GetUserID(userid, courseID),
                [ClaimTypes.Role] = p.Roles.Any(e =>
                    e.Contains("http://purl.imsglobal.org/vocab/lis/v2/membership#Instructor")
                )
                    ? UserRoles.instructor.ToString()
                    : UserRoles.student.ToString(),
                [ClaimTypes.Email] = p.Email,
            };
        }
    }
);
app.UseHttpLogging();

// app.UseHttpsRedirection();
app.UseDefaultFiles();
app.UseStaticFiles();

app.UseRouting();

app.UseAuthentication();
app.UseAuthorization();

// app.UseEndpoints(endpoints => endpoints.MapRazorPages());

app.MapControllerRoute(name: "default", pattern: "{controller}/{action=Index}/{id?}");

if (app.Environment.IsDevelopment())
{
    Console.WriteLine("In Development.");
    app.UseDeveloperExceptionPage();

    app.MapWhen(y => y.Request.Path.StartsWithSegments(FRONTEND_PREFIX), client =>
    {
        client.UseSpa(spa =>
        {
            spa.UseProxyToSpaDevelopmentServer("https://localhost:3000/");
        });
    });
}
else
{
    Console.WriteLine("In Production.");
    app.Map(new PathString(FRONTEND_PREFIX), client =>
       {
           client.UseSpaStaticFiles();
           client.UseSpa(spa =>
        {
            spa.Options.SourcePath = "wwwroot";

            // adds no-store header to index page to prevent deployment issues (prevent linking to old .js files)
            // .js and other static resources are still cached by the browser
            spa.Options.DefaultPageStaticFileOptions = new StaticFileOptions
            {
                OnPrepareResponse = ctx =>
                {
                    ResponseHeaders headers = ctx.Context.Response.GetTypedHeaders();
                    headers.CacheControl = new CacheControlHeaderValue
                    {
                        NoCache = true,
                        NoStore = true,
                        MustRevalidate = true
                    };
                }
            };
        });
       });
    app.UseExceptionHandler("/Error");
}

// //=============================== Run app ================================//

app.Run();
