"use strict";

global.jQuery = global.$ = require('jquery');
require('bootstrap');
//    "share",
require("./lib/Fileinput");

import WizardView from './views/Wizard';

$(function () {
    // # fix
    $(document).on("click", "a[href='#']", function (e) {
        e.preventDefault();
    });

    // navbar fixes
    $("footer").css("background-color", $("body > nav").css("background-color"));
    $("footer *").css("color", $(".navbar-default .navbar-nav > li > a").css("color"));

    if ("undefined" === typeof FileReader || !$.isFunction(FileReader)) {
        //noinspection JSUnresolvedFunction
        $("#old-browser").fadeIn("slow");
        return;
    }

    // bootstrap
    $('[data-toggle="tooltip"]').tooltip();

    $("#wizard").show();

    $(":file").filestyle({
        buttonText: "",
        buttonName: "btn-primary",
        size:       "sm"
    });

    new WizardView;
});