using iTextSharp.text.pdf;
using Nustache.Core;
using SAI.Auth.PR.Extra.Commun;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.IO.Compression;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Formatting;
using System.Runtime.Serialization.Formatters.Binary;
using System.Text;
using System.Web;
using System.Web.Http;
using System.Web.Http.Results;

namespace SAI.Auth.PR.Extra.Controllers
{
    public class DocumentController : ApiController
    {
        /// <summary>
        /// Controleur en urgence pour l'AFDR 2020 (crise covid-19)
        /// </summary>
        /// <param name="formDataCollection">Liste de valeurs à remplacer</param>
        /// <param name="autre">Ici représente le nom du formulaire à traiter</param>
        /// <returns></returns>
        [HttpPost]
        public string Soumettre(FormDataCollection formDataCollection, string id)
        {
            var equipeDocument = new EquipeDocument(id);
            var cfg = ConfigVisionneuse.Config(equipeDocument);
            //Obtenir le fichier
            var pdfVierge = ObtenirPdf(equipeDocument);
            var fichierTemp = Path.GetTempFileName();
            var contenuUtilise = PreparerPDF(pdfVierge, formDataCollection, fichierTemp);

            var noDemande = 242215;

            //On créé un dictionnaire des valeurs du formulaire + des customs
            contenuUtilise.Add("ide", noDemande.ToString());
            contenuUtilise.Add("raw", string.Join("<br />", contenuUtilise.Select(x => x.Key + "&nbsp;=&nbsp;" + x.Value).ToArray()));

            EnvoyerCourriel(cfg.ConfigDocumentCourant.Courriel("boiteGenerique"),
                            noDemande.ToString(),
                            contenuUtilise,
                            fichierTemp);

            File.Delete(fichierTemp);

            //Préparer le retour
            contenuUtilise.Remove("raw");
            var retour = string.Join("&", contenuUtilise.Select(x => x.Key + "=" + x.Value).ToArray());
            //PBKDF2
            HttpContext.Current.Response.AppendHeader("Access-Control-Allow-Origin", "*");

            return StringCompression.Compress(retour);
        }

        private void EnvoyerCourriel(DocumentCourriel configCourriel,
                                    string noDemande,
                                    Dictionary<string, string> valeursRemplacement,
                                    string pathPieceJointe)
        {
           
        }

        [HttpPost]
        public string Enregistrer(FormDataCollection formDataCollection, string id, string email, string password)
        {
            var equipeDocument = new EquipeDocument(id);
            var cfg = ConfigVisionneuse.Config(equipeDocument);
            //Obtenir le fichier
            var pdfVierge = ObtenirPdf(equipeDocument);
            var fichierTemp = Path.GetTempFileName();
            var contenuUtilise = PreparerPDF(pdfVierge, formDataCollection, fichierTemp);

            var noDemande = 6346436;

            //On créé un dictionnaire des valeurs du formulaire + des customs
            contenuUtilise.Add("ide", noDemande.ToString());
            contenuUtilise.Add("raw", string.Join("<br />", contenuUtilise.Select(x => x.Key + "&nbsp;=&nbsp;" + x.Value).ToArray()));

            EnvoyerCourriel(cfg.ConfigDocumentCourant.Courriel("boiteGenerique"),
                            noDemande.ToString(),
                            contenuUtilise,
                            fichierTemp);

            File.Delete(fichierTemp);

            var retour = string.Join("&", contenuUtilise.Select(x => x.Key + "=" + x.Value).ToArray());
            //PBKDF2
            HttpContext.Current.Response.AppendHeader("Access-Control-Allow-Origin", "*");

            return StringCompression.Compress(retour);
        }

        /// <summary>
        /// Remplit un fichier PDF et fait l'épuration du javascript
        /// </summary>
        /// <param name="fichierARemplir"></param>
        /// <param name="formDataCollection"></param>
        /// <param name="pathFichierSortie"></param>
        /// <returns></returns>
        private Dictionary<string, string> PreparerPDF(byte[] fichierARemplir, IEnumerable<KeyValuePair<string, string>> formDataCollection, string pathFichierSortie)
        {
            var contenuUtilise = new Dictionary<string, string>();

            using (FileStream outFile = new FileStream(pathFichierSortie, FileMode.Create))
            {
                /* Section pour épurer le javascript des pdf */
                PdfReader pdfReader = new PdfReader(fichierARemplir);
                PdfStamper pdfStamper = new PdfStamper(pdfReader, outFile);
                AcroFields fields = pdfStamper.AcroFields;

                for (int i = 0; i <= pdfReader.XrefSize; i++)
                {
                    object o = pdfReader.GetPdfObject(i);
                    PdfDictionary pd = o as PdfDictionary;
                    if (pd != null)
                    {
                        pd.Remove(PdfName.AA);
                        pd.Remove(PdfName.JS);
                        pd.Remove(PdfName.JAVASCRIPT);
                    }
                }

                foreach (var formData in formDataCollection)
                {
                    contenuUtilise.Add(formData.Key, formData.Value);
                    if (formData.Value == "" || formData.Value == "false")
                        continue;

                    string trueValue = formData.Value;

                    if (formData.Value == "true")
                        trueValue = "On";
                    else if (formData.Value == "false")
                        trueValue = "Off";


                    fields.SetField(formData.Key, trueValue);
                }

                pdfStamper.FormFlattening = true;

                pdfStamper.Close();
                pdfReader.Close();
            }

            return contenuUtilise;
        }

        [HttpGet]
        public HttpResponseMessage Pdf(string id)
        {
            //Obtenir le fichier du dépot
            var pdfVierge = ObtenirPdf(new EquipeDocument(id));
            var dataStream = new MemoryStream(pdfVierge);

            HttpResponseMessage httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK);
            httpResponseMessage.Content = new StreamContent(dataStream);
            httpResponseMessage.Content.Headers.ContentDisposition = new System.Net.Http.Headers.ContentDispositionHeaderValue("attachment");
            httpResponseMessage.Content.Headers.ContentDisposition.FileName = id + ".pdf";
            httpResponseMessage.Content.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue("application/octet-stream");

            return httpResponseMessage;
        }

        private byte[] ObtenirPdf(EquipeDocument equipeDocument)
        {
            return File.ReadAllBytes("fichier.pdf");
        }

    }
}
