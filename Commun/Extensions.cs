using Microsoft.AspNet.Identity;
using Newtonsoft.Json;

using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Data;
using System.Linq;
using System.Security.Principal;
using System.Web;
using System.Web.Mvc;

namespace SAI.Auth.PR.Extra.Commun
{
    public static class Extensions
    {

        /// <summary>
        /// Convertir un dataset en SelectListItem
        /// </summary>
        /// <param name="table">Datset à convertir</param>
        /// <param name="cle">Nom de la clé</param>
        /// <param name="description">Description du champ à afficher dans l'interface</param>
        /// <returns>
        /// SelectListItem
        /// </returns>
        public static List<SelectListItem> ToSelectListItem(this DataTable table, string cle, string description)
        {
            List<SelectListItem> liste = new List<SelectListItem>();

            foreach (DataRow row in table.Rows)
            {
                liste.Add(new SelectListItem()
                {
                    Value = row[cle].ToString(),
                    Text = row[description].ToString()
                });
            }

            return liste;
        }

        public static Dictionary<string, string> ToDictionary(this NameValueCollection nvc)
        {
            return nvc.AllKeys.ToDictionary(k => k, k => nvc[k]);
        }
    }
}