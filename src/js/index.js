"use strict";

global.jQuery = require("jquery");
global.$      = jQuery;

var WizardView = require("./views/Wizard"),
    bootstrap  = require("bootstrap");

//    "share",
require("./lib/Fileinput");

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