using System.Net;
using System.Threading.Tasks;
using IguideME.Web.Services;
using IguideME.Web.Services.Data;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.AspNetCore.Server.Kestrel.Core;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using StackExchange.Redis;

namespace IguideME.Web
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        public void ConfigureServices(IServiceCollection services)
        {

            var useRedisCache = Configuration.GetValue<bool>(
                "UnsecureApplicationSettings:UseRedisCache");
            var redisCacheConnectionString = Configuration.GetValue<string>(
                "UnsecureApplicationSettings:RedisCacheConnectionString");

            // work object, where the computations are done.
            services.AddTransient<ICanvasSyncService, CanvasSyncService>();

            // QueuedBackgroundService is a dual-purpose service
            services.AddHostedService<QueuedBackgroundService>();
            services.AddTransient<IQueuedBackgroundService, QueuedBackgroundService>();

            services.AddHostedService<SyncManager>();

            // Manages jobs
            services.AddTransient<IComputationJobStatusService, ComputationJobStatusService>();

            if (useRedisCache && !string.IsNullOrWhiteSpace(redisCacheConnectionString))
            {
                // setup redis cache for horizontally scaled services
                services.AddSingleton<IConnectionMultiplexer>(
                    ConnectionMultiplexer.Connect(redisCacheConnectionString));
                // job status service, CRUD operations on jobs stored in redis cache.
                services.AddTransient<IJobStorageService, RedisCacheJobStorageService>();
            }
            else
            {
                // strictly for testing purposes
                services.AddTransient<IJobStorageService, MemoryCacheJobStorageService>();
            }

            // we need SameSite = None for the cookie to be stored when running in a Canvas iframe
            services
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

            services.AddAuthorization(options =>
            {
                // allow all instructors to access the admin panel of their course
                options.AddPolicy("IsInstructor",
                     policy => policy.RequireRole("instructor"));
            });

            services.Configure<ForwardedHeadersOptions>(opt =>
            {
                opt.ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto;
                opt.KnownNetworks.Clear();
                opt.KnownProxies.Clear();
            });

            services.Configure<KestrelServerOptions>(options =>
            {
                options.AllowSynchronousIO = true;
            });

            // If using IIS:
            services.Configure<IISServerOptions>(options =>
            {
                options.AllowSynchronousIO = true;
            });

            services.AddControllersWithViews();
            services.AddSingleton<CanvasTest>();

            services.AddHttpClient();

            services.AddControllers()
                .AddJsonOptions(options =>
                    options.JsonSerializerOptions.PropertyNamingPolicy = null);


            services.AddControllers().AddNewtonsoftJson();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env, ILogger<Startup> logger)
        {
            if (env.IsDevelopment())
            {
                logger.LogInformation("In Development.");
                app.UseDeveloperExceptionPage();
            }
            else
            {
                logger.LogInformation("In Production.");
                app.UseExceptionHandler("/Error");
            }

            DatabaseManager.Initialize(env.IsDevelopment());

            app.UseDefaultFiles();
            app.UseStaticFiles();

            app.UseForwardedHeaders();

            app.UseRouting();

            app.UseAuthentication();
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllerRoute(
                    name: "default",
                    pattern: "{controller}/{action=Index}/{id?}");
            });
        }
    }
}
