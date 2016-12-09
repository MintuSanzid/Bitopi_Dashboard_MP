using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(Dashboard_WebApp.Startup))]
namespace Dashboard_WebApp
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
