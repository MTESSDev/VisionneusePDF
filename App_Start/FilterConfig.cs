using System.Web;
using System.Web.Mvc;

namespace SAI.Auth.PR.Extra
{
    public class FilterConfig
    {
        public static void RegisterGlobalFilters(GlobalFilterCollection filters)
        {
            filters.Add(new HandleErrorAttribute());
        }
    }
}
