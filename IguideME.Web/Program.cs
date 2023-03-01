using System;
using UvA.LTI;
using System.Text;
using System.Linq;
using StackExchange.Redis;
using System.Security.Claims;
using IguideME.Web.Services;
using IguideME.Web.Services.Data;
using System.Collections.Generic;
using Microsoft.Extensions.Hosting;
using Microsoft.AspNetCore.Builder;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.AspNetCore.Server.Kestrel.Core;
using Microsoft.AspNetCore.Authentication.JwtBearer;

// Key for LTI authorization.
string key = "blawlaekltjwelkrjtwlkejlekwjrklwejr32423";

// Key for own authorization using JWTs.
SymmetricSecurityKey signingKey = new(Encoding.ASCII.GetBytes(key));

// //======================== Builder configuration =========================//


//    /------------------------- Create builder --------------------------/

WebApplicationBuilder builder = WebApplication.CreateBuilder(
    new WebApplicationOptions{
      Args = args,
      WebRootPath = "wwwroot/build"
    });

//    /------------------------ Read appsettings -------------------------/

bool useRedisCache = bool.Parse(builder.Configuration.GetSection(
    "UnsecureApplicationSettings:UseRedisCache").Value);

string redisCacheConnectionString = builder.Configuration.GetSection(
    "UnsecureApplicationSettings:RedisCacheConnectionString").Value;


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
        ConnectionMultiplexer.Connect(redisCacheConnectionString));

    // job status service, CRUD operations on jobs stored in redis cache.
    builder.Services.AddTransient<IJobStorageService, RedisCacheJobStorageService>();
}
else
{
    // strictly for testing purposes
    builder.Services.AddTransient<IJobStorageService, MemoryCacheJobStorageService>();
}

// Add authorization (validating the jwt)
builder.Services
    .AddAuthorization()
    .AddAuthentication(opt => opt.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(opt =>
    {
        opt.TokenValidationParameters.ValidateAudience = false;
        opt.TokenValidationParameters.ValidIssuer = "lti";
        opt.TokenValidationParameters.IssuerSigningKey = signingKey;
    });

// Add a policy that checks whether a user is an admin.
builder.Services.AddAuthorization(options =>
    options.AddPolicy("IsInstructor",
            policy => policy.RequireRole("Teacher")));

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
builder.Services.AddSingleton<CanvasTest>();

builder.Services.AddHttpClient();

builder.Services.AddControllers()
    .AddJsonOptions(options =>
        options.JsonSerializerOptions.PropertyNamingPolicy = null);


builder.Services.AddControllers().AddNewtonsoftJson();


// //========================== App configuration ===========================//

WebApplication app = builder.Build();

app.UseLti(new LtiOptions
{
    ClientId = "104410000000000150",
    AuthenticateUrl = "https://uvadlo-dev.instructure.com/api/lti/authorize_redirect",
    JwksUrl = "https://canvas.instructure.com/api/lti/security/jwks",
    SigningKey = key,
    ClaimsMapping = p => new Dictionary<string, object>
    {
        [ClaimTypes.NameIdentifier] = p.NameIdentifier.Split("_").Last(),
        ["contextLabel"] = p.Context.Label,
        ["courseName"] = p.Context.Title,
        ["user_name"] = p.Name,
        ["courseid"] = p.CustomClaims?.GetProperty("courseid").ToString(),
        ["userid"] = p.CustomClaims?.GetProperty("userid").ToString(),
        [ClaimTypes.Role] = p.Roles.Any(e => e.Contains("http://purl.imsglobal.org/vocab/lis/v2/membership#Instructor"))
            ? "Teacher" : "Student",
        [ClaimTypes.Email] = p.Email,
    }

});


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

app.UseForwardedHeaders();

app.UseRouting();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllerRoute(
        name: "default",
        pattern: "{controller}/{action=Index}/{id?}");


// //=============================== Run app ================================//

app.Run();
