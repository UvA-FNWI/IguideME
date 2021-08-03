using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Hosting;

namespace IguideME.Web
{
    public class Program
    {
        public static void Main(string[] args)
        {

            CreateHostBuilder(args).Build().Run();
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    //.UseSetting("https_port", "5001")
                    webBuilder.UseStartup<Startup>()
                        .UseWebRoot("wwwroot/build");
                });
    }
}