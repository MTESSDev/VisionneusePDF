using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Runtime.Serialization;
using System.Runtime.Serialization.Formatters.Binary;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using System.Web;
using System.Web.Hosting;
using System.Web.Mvc;
using System.Web.Mvc.Html;
using System.Web.Routing;
using YamlDotNet.Serialization;
using YamlDotNet.Serialization.NamingConventions;

namespace SAI.Auth.PR.Extra.Commun
{
    public static class ConfigVisionneuse
    {
        public static DonneesVisionneuse Config()
        {
            var deserializer = new DeserializerBuilder()
                  .WithNamingConvention(CamelCaseNamingConvention.Instance)
                  .IgnoreUnmatchedProperties()
                  .Build();

            return deserializer.Deserialize<DonneesVisionneuse>(File.ReadAllText("config"));
        }

        public static DonneesVisionneuse Config(EquipeDocument equipeDocument)
        {
            var deserializer = new DeserializerBuilder()
                  .WithNamingConvention(CamelCaseNamingConvention.Instance)
                  .IgnoreUnmatchedProperties()
                  .Build();

            var cfg = deserializer.Deserialize<DonneesVisionneuse>(File.ReadAllText("config"));

            cfg.ConfigDocumentCourant = cfg.Documents?.FirstOrDefault(d => d.Id == equipeDocument.Document);

            return cfg;
        }


    }

    public class EquipeDocument
    {
        public EquipeDocument(string id)
        {
            var s = id.Split('@');
            Equipe = s[0];
            Document = s[1];
        }
        public string Equipe { get; set; }
        public string Document { get; set; }
    }

    public class DonneesVisionneuse
    {
        public Document[] Documents { get; set; }
        public Document ConfigDocumentCourant { get; internal set; }
        public Dictionary<string, string> Donnees { get; internal set; }
        public string Template(string template)
        {
            //Donnees.TryGetValue(element, out var val);
            return Nustache.Core.Render.StringToString(template, Donnees);
        }
    }

    public class Document
    {
        public string Id { get; set; }
        public string Equipe { get; set; }
        public string UrlPdf { get; set; }
        public string UrlSoumissionForm { get; set; }
        public string UrlEnregistrementForm { get; set; }
        public string UrlTelechargementForm { get; set; }
        public string UrlCss { get; set; }
        public string UrlConfirmation { get; set; }
        public string Ide { get; set; }
        public DocumentCourriel[] Courriels { get; set; }
        public DocumentMessage[] Messages { get; set; }
        public DocumentMessage Message(string id) { return Messages?.FirstOrDefault(m => m.Id.ToLower() == id.ToLower()); }
        public DocumentCourriel Courriel(string id) { return Courriels?.FirstOrDefault(m => m.Id.ToLower() == id.ToLower()); }
    }

    public class DocumentMessage
    {
        public string Id { get; set; }
        public string Titre { get; set; }
        public string Texte1 { get; set; }
        public string Texte2 { get; set; }
        public bool AfficherBoutonImpression { get; set; }
        public string HtmlCustom { get; set; }
    }

    public class DocumentCourriel
    {
        public string Id { get; set; }
        public string A { get; set; }
        public string RetourA { get; set; }
        public string De { get; set; }
        public string Objet { get; set; }
        public string Corps { get; set; }
        public string NomPieceJointe { get; set; }
        public string EvenementAffaire { get; set; }
    }

    /*public class MultiLangue
    {
        public string Fr { get; set; }
        public string En { get; set; }
        public string ToString(Lang langue) { return (langue == Lang.fr ? Fr : En); }
    }*/

    public enum Lang
    {
        fr, en
    }
}