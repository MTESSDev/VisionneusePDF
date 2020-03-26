$(function () {
    $(".tableau").each(function (index, value) {
        var listeTh = $(this).find('thead th:not(.aucunTri)');
        var estValide = true;

        if ($(this).parents(".dataTables_wrapper").find("table").length > 1) {
            if (!$(this).parents(".dataTables_scrollBody").length) {
                listeTh = $(this).find("thead th:not(.aucunTri)");
                $(this).parents(".dataTables_wrapper").find(".dataTables_scrollHead").addClass("correctifBarreDefilementHead");
                $(this).parents(".dataTables_wrapper").find(".dataTables_scrollBody").addClass("correctifBarreDefilementBody");
            }
            else
                estValide = false;      
        }

        if (estValide) {
            listeTh.click(function () {
                if ($(this).hasClass('triAsc') && $(this).hasClass('triActif') && !$(this).hasClass("aucunTri")) {
                    listeTh.each(function () {
                        $(this).removeClass('triAsc triDesc triActif triInactif').addClass('triAsc triInactif').attr("aria-sort", "none").attr("aria-label", $(this).text() + " - retour/espace pour trier ascendant");
                    });
                    $(this).removeClass('triAsc triInactif').addClass('triDesc triActif').attr("aria-sort", "descending").attr("aria-label", $(this).text() + " - retour/espace pour trier ascendant");
                } else if ($(this).hasClass('triAsc') && $(this).hasClass('triInactif') && !$(this).hasClass("aucunTri")) {
                    listeTh.each(function () {
                        $(this).removeClass('triAsc triDesc triActif triInactif').addClass('triDesc triInactif').attr("aria-sort", "none").attr("aria-label", $(this).text() + " - retour/espace pour trier ascendant");
                    });
                    $(this).removeClass('triDesc triInactif').addClass('triAsc triActif').attr("aria-sort", "ascending").attr("aria-label", $(this).text() + " - retour/espace pour trier descendant");
                } else if ($(this).hasClass('triDesc') && $(this).hasClass('triActif') && !$(this).hasClass("aucunTri")) {
                    listeTh.each(function () {
                        $(this).removeClass('triAsc triDesc triActif triInactif').addClass('triDesc triInactif').attr("aria-sort", "none").attr("aria-label", $(this).text() + " - retour/espace pour trier ascendant");
                    });
                    $(this).removeClass('triDesc triInactif').addClass('triAsc triActif').attr("aria-sort", "ascending").attr("aria-label", $(this).text() + " - retour/espace pour trier descendant");
                } else if ($(this).hasClass('triDesc') && $(this).hasClass('triInactif') && !$(this).hasClass("aucunTri")) {
                    listeTh.each(function () {
                        $(this).removeClass('triAsc triDesc triActif triInactif').addClass('triDesc triInactif').attr("aria-sort", "none").attr("aria-label", $(this).text() + " - retour/espace pour trier ascendant");
                    });
                    $(this).removeClass('triDesc triInactif').addClass('triAsc triActif').attr("aria-sort", "ascending").attr("aria-label", $(this).text() + " - retour/espace pour trier descendant");
                }
            });

            listeTh.keydown(function (e) {
                if (e.which === 13 || e.which === 32) {
                    this.click();
                    e.preventDefault();
                }
            });
        }
    });
});