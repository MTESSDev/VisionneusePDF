using SAI.Auth.PR.Extra.Commun;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http.Formatting;
using System.Web;
using System.Web.Mvc;

namespace SAI.Auth.PR.Extra.Controllers
{
    public class VisionneuseController : Controller
    {
        // GET: Visionneuse (ID = document a charger (equipe@document))
        public ActionResult Formulaire(string id)
        {
            var cfg = ConfigVisionneuse.Config(new EquipeDocument(id));
            return View(cfg);
        }
        public ActionResult Confirmation(string id, string data)
        {
            var test = StringCompression.Decompress(data);
            var dict = new FormDataCollection(test).ReadAsNameValueCollection().ToDictionary();

            var cfg = ConfigVisionneuse.Config(new EquipeDocument(id));
            cfg.Donnees = dict;
            return View(cfg);
        }

    }
}