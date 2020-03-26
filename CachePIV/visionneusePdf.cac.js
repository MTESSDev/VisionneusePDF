function ajouterSpinnerElement(element) {
    element.setAttribute('disabled', 'disabled');
    $(element).append('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>');
};


function retirerSpinnerElement(element) {
    element.removeAttribute('disabled');
    $(element).find('.spinner-border').remove();
};



/*======================================================================================================================*/
/* FENÊTRE DE MESSAGE
/*======================================================================================================================*/
/**
 * Affiche une fenêtre de message (dialog).
 * @param {Object} parametres Paramètres.
 * @param {Object} parametres.modeleAffichage Modèle d'affichage du message ("" = défaut/base, "scg", "nice" uniquement pour l'instant, autres modèles à venir). Défaut "" (base).
 * @param {Object} parametres.type Type de message ("avertissement-confirmation", "erreur-confirmation", "information" uniquement pour l'instant, autres types à venir). Défaut "avertissement-confirmation".
 * @param {Object} parametres.titre Titre du message. Texte brut ou HTML (ex. Annuler les modifications) Défaut "". 
 * @param {Object} parametres.corps Corps du message. Texte brut ou HTML (ex. Désirez-vous annuler les modifications ou poursuivre?.) Défaut "".
 * @param {Object} parametres.texteBoutonPrimaire Texte du bouton primaire. (Celui en orange situé au bout à droite). Si vide n'est pas affiché.
 * @param {Object} parametres.texteBoutonSecondaire Texte du bouton secondaire. (Situé à la gauche du bouton primaire). Si vide n'est pas affiché.
 * @param {Object} parametres.forcerBoutons Forcer l'utilisateur à utiliser le bouton primaire ou secondaire pour fermer la fenêtre de message. Défaut false.
 * @param {Object} parametres.afficherBoutonFermer Afficher le bouton pour fermer la fenêtre de message. Défaut true.
 * @param {Object} parametres.afficherBoutonSecondaire Afficher le bouton secondaire. Défaut true.
 * @returns {Object} Une promesse jQuery qui contiendra éventuellement un objet contenant la raison de fermeture. (ex. objet.primaire ou objet.secondaire)
 * @example afficherMessage(parametres)
            .done(function (resultat) {
                if (resultat.primaire) {
                    alert("Très bon choix! Poursuivre aurait pu causer une rupture du continuum espace temps!");
                } else if (resultat.secondaire) {
                    alert("Mauvais choix! Vous auriez-du poursuivre. À cause de vous le continuum espace temps risque de se briser!");
                } else {
                    alert("Vous vous êtes contenté de fermer la fenêtre sans faire de choix... La prochaine fois assumez-vous! L'avenir du monde est entre vos mains!");
                }
            });
 */
function afficherMessage(parametres) {

    var valeursDefaut = {
        modeleAffichage: "",
        type: "avertissement-confirmation",
        titre: "",
        corps: "",
        texteBoutonPrimaire: "",
        texteBoutonSecondaire: "",
        forcerBoutons: false,
        afficherBoutonFermer: false,
        afficherBoutonSecondaire: parametres.type && parametres.type !== "information"
    };

    parametres = $.extend({}, valeursDefaut, parametres);

    var htmlMessage = afficherMessage_obtenirHtml(parametres);

    $("body").append(htmlMessage);

    var fenetreMessage = $(".modal:last");
    if (parametres.forcerBoutons) {
        fenetreMessage.modal({ backdrop: 'static', keyboard: false, show: true });
    }
    else {
        fenetreMessage.modal("show");
    }

    conserverFocusElement(fenetreMessage.get(0));

    //Affecter la raison de fermeture de la fenêtre modale au click d'un bouton
    fenetreMessage.find(".modal-footer, .pied").find("button").on("click", function () {
        fenetreMessage.data("raison-fermeture", $(this).data("raison-fermeture"));
    });

    //Définir une promesse qui sera résolue à la fermeture de la fenêtre.
    var dfd = $.Deferred();
    afficherMessage_definirEvenementFermeture(fenetreMessage, dfd);

    return dfd.promise();
};

function afficherMessage_obtenirHtml(parametres) {

    var classeIcone = parametres.type;

    var html = ('\
        <div class="fenetre-message modal {0} {1}" tabindex="-1" role="dialog">\
          <div class="modal-dialog" role="document">\
            <div class="modal-content">\
              <div class="modal-header d-flex align-items-center">\
                <div class="icone" aria-hidden="true"></div>\
                <h1 class="modal-title ml-3">{2}</h1>'

        + (parametres.afficherBoutonFermer ?
            '<button type="button" class="close" data-dismiss="modal" data-raison-fermeture="fermeture" aria-label="Close">\
                    <span aria-hidden="true">&times;</span>\
                </button>' : '<span class="close"> </span>') +

        '</div>\
              <div class="modal-body">\
                {3}\
              </div>\
              <div class="modal-footer pied">'
        + (parametres.afficherBoutonSecondaire ? '<button type="button" class="btn btn-secondaire" data-raison-fermeture="secondaire" data-dismiss="modal">{4}</button>' : '') +
        '<button type="button" class="btn btn-secondaire ml-2" data-raison-fermeture="primaire" data-dismiss="modal">{5}</button>\
              </div>\
            </div>\
          </div>\
        </div>').format(parametres.modeleAffichage, parametres.type, parametres.titre, parametres.corps, parametres.texteBoutonSecondaire, parametres.texteBoutonPrimaire);
    return html;
};

/**
 * Compléter la promesse indiquant de quelle façon la fenêtre s'est fermée et supprimer l'élément du DOM une fois qu'il n'est plus affiché.
 * @param {object} fenetreMessage Objet jQuery correspondant à la fenêtre de message.
 */
function afficherMessage_definirEvenementFermeture(fenetreMessage, promesse) {

    fenetreMessage.on('hidden.bs.modal', function (e) {
        var retour = {};
        var raisonFermeture = $(this).data("raison-fermeture");

        raisonFermeture = raisonFermeture || "fermeture";
        retour[raisonFermeture] = true;
        //$(this).modal('dispose')
        promesse.resolve(retour);

        $(this).remove();
    });
};

/**
 * Affiche une fenêtre de message qui confirme que l'enregistrement du formulaire a été effectué.
*/
function afficherMessageConfirmationEnregistrement(parametres) {
    var valeursDefaut = {
        type: "succes",
        titre: "Formulaire enregistré",
        corps: "Un lien vous permettant de compléter le formulaire vous a été transmis à l'adresse courriel spécifiée.",
        texteBoutonPrimaire: "Fermer",
        afficherBoutonSecondaire: false
    };
    parametres = $.extend({}, valeursDefaut, parametres);

    return afficherMessage(parametres);
};


/**
*  Bloque le scrolling du body lorsqu'une modal bootstrap est ouverte. 
   Permet également de conserver la position d'écran actuelle. (i.e. La modal est affichée sans provoquer un scroll au haut de l'écran, idem lorsqu'on la ferme.) */
function bloquerScrollModalsBootsrap() {
    $(window).on('show.bs.modal', function (e) {
        var scrollY = window.scrollY;
        document.body.style.position = 'fixed';
        document.body.style.top = '-{0}px'.format(scrollY);
    });

    $(window).on('hidden.bs.modal', function (e) {
        repositionnerEcranCommeAvantAffichageModal();
    });
};

function repositionnerEcranCommeAvantAffichageModal() {
    var scrollY = document.body.style.top;
    document.body.style.position = '';
    document.body.style.top = '';
    window.scrollTo(0, parseInt(scrollY || '0') * -1);
};

/**
* Conserve le focus dans l'objet javascript reçu en paramètre.
  @param { object } element Objet javascript dans lequel on veut conserver le focus.
*/
function conserverFocusElement(element) {
    var elementsFocusables = element.querySelectorAll('a[href]:not([disabled]), button:not([disabled]), textarea:not([disabled]), input[type="text"]:not([disabled]), input[type="radio"]:not([disabled]), input[type="checkbox"]:not([disabled]), select:not([disabled])');
    var premierElementFocusable = elementsFocusables[0];
    var dernierElementFocusable = elementsFocusables[elementsFocusables.length - 1];

    var CODE_TAB = 9;
    element.addEventListener('keydown', function (e) {
        var toucheTabAppuyee = (e.key === 'Tab' || e.keyCode === CODE_TAB);
        if (!toucheTabAppuyee) {
            return;
        }
        if (e.shiftKey) /* SHIFT + TAB */ {
            if (document.activeElement === premierElementFocusable) {
                if ($(dernierElementFocusable).is(':visible')) {
                    dernierElementFocusable.focus();
                    e.preventDefault();
                }
            }
        } else /* TAB */ {
            if (document.activeElement === dernierElementFocusable) {
                if ($(premierElementFocusable).is(':visible')) {
                    premierElementFocusable.focus();
                    e.preventDefault();
                }
            }
        }
    });
};

/**
 * Indique si une adresse courriel est valide ou non.
 * @param {any} courriel Adresse courriel à valider
 */
function estCourrielValide(courriel) {
    var pattern = /^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
    return pattern.test(courriel);
};


//====================================================================
//format
//
//Permet de modifier de façon dynamique le contenu d'une chaîne de caractères, exactement comme le fait string.format() en c#.
//
//Retourne : La chaîne de caractère formatée.
//
//Exemple(s) d'utilisation :
// var test = "Un petit texte avec insertion dynamique. Valeur dynamique1 = {0}. Valeur dynamique2 = {1}".format(maVariableContenantValeur, maVariableContenantValeur2);
//====================================================================
// Vérifier si la fontion est déjà implémentée, si ce n'est pas le cas on l'implémente.
if (!String.prototype.format) {
    String.prototype.format = function () {
        var args = arguments;
        return this.replace(/{(\d+)}/g, function (match, number) {
            return typeof args[number] != 'undefined'
                ? args[number]
                : match
                ;
        });
    };
}