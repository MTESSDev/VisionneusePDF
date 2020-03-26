<%@ Page Language="C#" AutoEventWireup="true" %>


<%
  string user = null;
  if (System.Diagnostics.Debugger.IsAttached)
    user = Environment.UserDomainName + @"\" + Environment.UserName;
  else
    user = HttpContext.Current.User.Identity.Name;

  if (user == null)
    user = Request.Params["utilisateur"];

  if (!string.IsNullOrWhiteSpace(user))
  {
    HttpCookie myCookie = new HttpCookie("utilisateurTest", user);
    myCookie.Domain = System.Web.Configuration.WebConfigurationManager.AppSettings["CookieDomain"];
    myCookie.Expires = DateTime.Now.AddDays(2000);
    Response.Cookies.Add(myCookie);
    var url = Request.Params["urlretour"];
    if (string.IsNullOrWhiteSpace(url))
      url = "/";
    Response.Redirect(url);
  }
%>
<html>
<head>
    <title>Login de débug</title>
    <style>
        body {
            font: normal 14px verdana;
        }
    </style>
</head>
<body>
    <form action="login.aspx" method="GET">

        <label>
            Entrez votre Code NT du profil MGS : <br />
            <input type="text" name="utilisateur" value="<%= Request.Params["utilisateur"] %>" placeholder="mes\codnt01" />
            <input type="hidden" name="urlretour" value="<%= Request.Params["urlretour"] %>" />
        </label>
        <input type="submit" value="Sauvegarder" />
    </form>
</body>
</html>
