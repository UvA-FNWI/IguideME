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
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.AspNetCore.Server.Kestrel.Core;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Tokens;
using StackExchange.Redis;
using UvA.LTI;

// //======================== Builder configuration =========================//


//    /------------------------- Create builder --------------------------/

// Create a new WebApplicationBuilder for setting up the application.
WebApplicationBuilder builder = WebApplication.CreateBuilder(
    new WebApplicationOptions
    {
        Args = args, // command-line arguments passed to the app
        WebRootPath = "wwwroot/build" // specifies the path to the web root directory
    }
);

//    /------------------------ Read appsettings.json -------------------------/

Backends lms;
if (!Backends.TryParse(builder.Configuration.GetSection("LMS:Backend").Value, out lms))
{
    // Console.WriteLine();
    throw new Exception("Incorrect settings for LMS:Backend");
}

// "UnsecureApplicationSettings:UseRedisCache" - indicates whether to use Redis cache or not.
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
    options.AddPolicy("IsInstructor", policy => policy.RequireRole("Teacher"))
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
builder.Services.AddHttpClient();

builder
    .Services.AddControllers()
    .AddJsonOptions(options => options.JsonSerializerOptions.PropertyNamingPolicy = null);

builder.Services.AddControllers().AddNewtonsoftJson();

// //========================== App configuration ===========================//


WebApplication app = builder.Build();

var ltiConfig = builder.Configuration.GetSection("LTI");
app.UseForwardedHeaders();

app.UseLti(
    new LtiOptions
    {
        ClientId = ltiConfig["ClientId"] ?? throw new Exception("Client id not set"),
        AuthenticateUrl =
            ltiConfig["AuthenticateUrl"] ?? throw new Exception("Authenticate url not set"),
        JwksUrl = ltiConfig["JwksUrl"] ?? throw new Exception("Jwks url not set"),
        SigningKey = key,
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
            return new Dictionary<string, object>
            {
                [ClaimTypes.NameIdentifier] = p.NameIdentifier!.Split("_").Last(),
                ["contextLabel"] = p.Context.Label,
                ["courseName"] = p.Context.Title,
                ["user_name"] = p.Name,
                ["courseid"] = courseID,
                ["userid"] = p.CustomClaims?.GetProperty("userid").ToString(),
                [ClaimTypes.Role] = p.Roles.Any(e =>
                    e.Contains("http://purl.imsglobal.org/vocab/lis/v2/membership#Instructor")
                )
                    ? "Teacher"
                    : "Student",
                [ClaimTypes.Email] = p.Email,
            };
        }
    }
);

if (app.Environment.IsDevelopment())
{
    Console.WriteLine("In Development.");
    app.UseDeveloperExceptionPage();
}
else
{
    Console.WriteLine("In Production.");
    app.UseExceptionHandler("/Error");
}

DatabaseManager.Initialize(app.Environment.IsDevelopment());

app.UseDefaultFiles();
app.UseStaticFiles();

app.UseRouting();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllerRoute(name: "default", pattern: "{controller}/{action=Index}/{id?}");

// //=============================== Run app ================================//

app.Run();
