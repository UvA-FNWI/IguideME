using System;
using System.Net;
using StackExchange.Redis;
using System.Threading.Tasks;
using IguideME.Web.Services;
using IguideME.Web.Services.Data;
using Microsoft.Extensions.Hosting;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.AspNetCore.Server.Kestrel.Core;
using Microsoft.AspNetCore.Authentication.Cookies;

// //======================== Builder configuration =========================//

WebApplicationBuilder builder = WebApplication.CreateBuilder(
    new WebApplicationOptions{
      Args = args,
      WebRootPath = "wwwroot/build"
    });

// /------------------------ Read appsettings ------------------------/

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

// we need SameSite = None for the cookie to be stored when running in a Canvas iframe
builder.Services
    .AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
    .AddCookie(opt =>
    {
        opt.Cookie.SameSite = Microsoft.AspNetCore.Http.SameSiteMode.None;
        opt.Events.OnRedirectToAccessDenied = context =>
        {
            context.Response.StatusCode = (int)HttpStatusCode.Unauthorized;
            return Task.CompletedTask;
        };
    });

builder.Services.AddAuthorization(options =>
    // allow all instructors to access the admin panel of their course
    options.AddPolicy("IsInstructor",
            policy => policy.RequireRole("instructor")));

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

if (app.Environment.IsDevelopment())
{
    Console.WriteLine("In Development.");
    app.UseDeveloperExceptionPage();
}
else
{
    Console.WriteLine("In Production.");

    // logger.LogInformation("In Production.");
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
