$(function () {
    $('div.zone-deployable > div.panel-group > div.panel > div.panel-heading > div.panel-title > a').click(function (e) {    // Gestion de la flèche
        if ($(this).hasClass("collapsed")) {
            $(this).parent().css("background-image", "url('down-white-arrow.cac.svg')");
        } else if ($(this).hasClass("collapsed") == false) {
            $(this).parent().css("background-image", "url('right-white-arrow.cac.svg')");
        }
    });
});