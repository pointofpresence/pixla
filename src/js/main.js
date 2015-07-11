require.config({
    paths: {
        underscore: "//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.8.3/underscore-min",
        backbone:   "//cdnjs.cloudflare.com/ajax/libs/backbone.js/1.1.2/backbone-min",
        jquery:     "//cdnjs.cloudflare.com/ajax/libs/jquery/2.1.3/jquery.min",
        bootstrap:  "//maxcdn.bootstrapcdn.com/bootstrap/3.3.4/js/bootstrap.min",
        share:      "//yastatic.net/share/share",
        sortable:   "//cdnjs.cloudflare.com/ajax/libs/Sortable/1.2.0/Sortable.min",
        fabric:     "/vendor/fabric.min"
    },

    shim:        {
        underscore: {
            exports: "_"
        },

        backbone: {
            exports: "Backbone",
            deps:    ["jquery", "underscore"]
        },

        bootstrap: {
            deps: ["jquery"]
        }
    },
    waitSeconds: 60
});

require([
    "jquery",
    "views/Wizard",
    "bootstrap",
    "share",
    "lib/Fileinput"
], function ($, WizardView) {
    "use strict";

    $(function () {
        // # fix
        $(document).on("click", "a[href=#]", function (e) {
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
            size: "sm"
        });

        new WizardView;
    });
});
