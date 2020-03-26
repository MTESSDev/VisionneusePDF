$(function () {

    /*
    *   This content is licensed according to the W3C Software License at
    *   https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
    *
    *   Simple accordion pattern example
    */

    'use strict';

    Array.prototype.slice.call(document.querySelectorAll('.nav-sidebar')).forEach(function (accordion) {

        // Allow for multiple accordion sections to be expanded at the same time
        var allowMultiple = accordion.hasAttribute('data-allow-multiple');
        // Allow for each toggle to both open and close individually
        var allowToggle = (allowMultiple) ? allowMultiple : accordion.hasAttribute('data-allow-toggle');

        // Create the array of toggle elements for the accordion group
        var triggers = Array.prototype.slice.call(accordion.querySelectorAll('.has-arrow'));
        //var panels = Array.prototype.slice.call(accordion.querySelectorAll('.Accordion-panel'));

        accordion.addEventListener('click', function (event) {
            var target = event.target;

            if (target.classList.contains('has-arrow')) {

                // Check if the current toggle is expanded.
                var isExpanded = target.getAttribute('aria-expanded') == 'true';
                var active = accordion.querySelector('[aria-expanded="true"]');

                // without allowMultiple, close the open accordion
                if (!allowMultiple && active && active !== target) {
                    // Set the expanded state on the triggering element
                    active.setAttribute('aria-expanded', 'false');
                    // Hide the accordion sections, using aria-controls to specify the desired section
                    //document.getElementById(active.getAttribute('aria-controls')).setAttribute('hidden', '');
                    //document.getElementById(active.getAttribute('aria-controls')).setAttribute('aria-hidden', 'false');
                    active.nextElementSibling.setAttribute('aria-hidden', 'false');
                    active.parentElement.classList.add("panel-expand");
                    // When toggling is not allowed, clean up disabled state
                    if (!allowToggle) {
                        active.removeAttribute('aria-disabled');
                    }
                }

                if (!isExpanded) {
                    // Set the expanded state on the triggering element
                    target.setAttribute('aria-expanded', 'true');
                    // Hide the accordion sections, using aria-controls to specify the desired section
                    //document.getElementById(target.getAttribute('aria-controls')).removeAttribute('hidden');
                    //document.getElementById(target.getAttribute('aria-controls')).setAttribute('aria-hidden', 'false');
                    target.nextElementSibling.setAttribute('aria-hidden', 'false');
                    target.parentElement.classList.add("panel-expand");

                    // If toggling is not allowed, set disabled state on trigger
                    if (!allowToggle) {
                        target.setAttribute('aria-disabled', 'true');
                    }
                }
                else if (allowToggle && isExpanded) {
                    // Set the expanded state on the triggering element
                    target.setAttribute('aria-expanded', 'false');
                    // Hide the accordion sections, using aria-controls to specify the desired section
                    //document.getElementById(target.getAttribute('aria-controls')).setAttribute('hidden', '');
                    //document.getElementById(target.getAttribute('aria-controls')).setAttribute('aria-hidden', 'true');
                    target.nextElementSibling.setAttribute('aria-hidden', 'true');
                    target.parentElement.classList.remove("panel-expand");

                }
                ajouterSousMenuOuvertDansCookie();

                //event.preventDefault();
            }
            else {

                var liActive = document.querySelectorAll(".nav-sidebar li.active > a");
                for (var i = 0; i < liActive.length; i++) {
                    liActive[i].parentElement.classList.remove('active');
                }

                var li = target.parentElement;
                li.classList.add('active')

                ajouterLienDansCookie();
            }
            //return false;
        });

        // Bind keyboard behaviors on the main accordion container
        accordion.addEventListener('keydown', function (event) {
            var target = event.target;
            var key = event.which.toString();
            // 33 = Page Up, 34 = Page Down
            var ctrlModifier = (event.ctrlKey && key.match(/33|34/));

            // Is this coming from an accordion header?
            if (target.classList.contains('has-arrow')) {
                // Up/ Down arrow and Control + Page Up/ Page Down keyboard operations
                // 38 = Up, 40 = Down
                if (key.match(/38|40/) || ctrlModifier) {
                    var index = triggers.indexOf(target);
                    var direction = (key.match(/34|40/)) ? 1 : -1;
                    var length = triggers.length;
                    var newIndex = (index + length + direction) % length;

                    while (triggers[newIndex].closest('ul').getAttribute('aria-hidden') == 'true') {
                        newIndex = newIndex + direction;
                    }
                    triggers[newIndex].focus();

                    event.preventDefault();
                }
                else if (key.match(/35|36/)) {
                    // 35 = End, 36 = Home keyboard operations
                    switch (key) {
                        // Go to first accordion
                        case '36':
                            triggers[0].focus();
                            break;
                            // Go to last accordion
                        case '35':
                            triggers[triggers.length - 1].focus();
                            break;
                    }

                    //event.preventDefault();
                }
                else if (key.match(/32|13/)) {
                    // 32 === spacebar, 13 === enter
                    event.preventDefault();
                    target.click();
                }
            } else if (key.match(/38|40/)) {
                
                var direction = (key.match(/34|40/)) ? 1 : -1;
                var length = triggers.length;
                var newIndex = (length + direction) % length;

                while (triggers[newIndex].closest('ul').getAttribute('aria-hidden') == 'true') {
                    newIndex = newIndex + direction;
                }
                triggers[newIndex].focus();

                event.preventDefault();
            }
            else if (key.match(/32|13/)) {
                // 32 === spacebar, 13 === enter
                event.preventDefault();
                target.click();
            }
            // else if (ctrlModifier) {
            // // Control + Page Up/ Page Down keyboard operations
            // // Catches events that happen inside of panels
            // panels.forEach(function (panel, index) {
            // if (panel.contains(target)) {

            // triggers[index].focus();

            // event.preventDefault();
            // }
            // });
            // }
        });

        // Minor setup: will set disabled state, via aria-disabled, to an
        // expanded/ active accordion which is not allowed to be toggled close
        if (!allowToggle) {
            // Get the first expanded/ active accordion
            var expanded = accordion.querySelector('[aria-expanded="true"]');

            // If an expanded/ active accordion is found, disable
            if (expanded) {
                expanded.setAttribute('aria-disabled', 'true');
            }
        }

    });

    function ajouterSousMenuOuvertDansCookie() {
        var elements = [];
        $(".nav-sidebar").find('a[aria-expanded="true"]').each(function () {
            elements.push($(this).attr('id'));
        });

        setCookie("sousMenuOuvert", elements.join(";"));
    }

    function ajouterLienDansCookie() {
        var elements = [];
        $(".nav-sidebar").find('li.active > a').each(function () {
            elements.push($(this).attr('id'));
        });

        setCookie("lienActif", elements.join(";"), undefined, "/", undefined, false);
    }

    function setCookie(nom, valeur, expire, chemin, domaine, securite) {
        document.cookie = nom + ' = ' + escape(valeur) + '  ' +
                  ((expire == undefined) ? '' : ('; expires = ' + expire.toGMTString())) +
                  ((chemin == undefined) ? '' : ('; path = ' + chemin)) +
                  ((domaine == undefined) ? '' : ('; domain = ' + domaine)) +
                  ((securite == true) ? '; secure' : '');
        return false;
    }

    function getCookie(sName) {
        var cookContent = document.cookie, cookEnd, i, j;
        var sName = sName + "=";

        for (i = 0, c = cookContent.length; i < c; i++) {
            j = i + sName.length;
            if (cookContent.substring(i, j) == sName) {
                cookEnd = cookContent.indexOf(";", j);
                if (cookEnd == -1) {
                    cookEnd = cookContent.length;
                }
                return decodeURIComponent(cookContent.substring(j, cookEnd));
            }
        }
        return null;
    }
});