using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Hosting;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;

namespace SAI.Auth.PR.Extra
{
    public class MvcApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {
            AreaRegistration.RegisterAllAreas();
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            GlobalConfiguration.Configure(WebApiConfig.Register);
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            BundleConfig.RegisterBundles(BundleTable.Bundles);
            MvcHandler.DisableMvcResponseHeader = true;
        }

        private void Application_BeginRequest()
        {
            //On crée un objet EntityFramework par requête faite au serveur.
            //HttpContext.Current.Items[SAI.Auth.PR.Extra.Models.Contexte.CLE_CONTEXTE] = null; /* new TODO AJOUTER CONTEXTE ENTITYFRAMEWORK */
        }

        private void Application_EndRequest()
        {
            //Une fois la requête terminée, on dispose de l'objet EntityFramework proprement.
            //IDisposable c = (IDisposable)HttpContext.Current.Items[SAI.Auth.PR.Extra.Models.Contexte.CLE_CONTEXTE];
            //if (c != null)
            //{
            //    c.Dispose();
            //}
        }

        protected void Application_AuthenticateRequest(object sender, EventArgs e)
        {
         
        }
    }
}
