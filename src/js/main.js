require.config({
    paths: {
        underscore: "//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.8.3/underscore-min",
        backbone:   "//cdnjs.cloudflare.com/ajax/libs/backbone.js/1.1.2/backbone-min",
        jquery:     "//cdnjs.cloudflare.com/ajax/libs/jquery/2.1.3/jquery.min",
        bootstrap:  "//maxcdn.bootstrapcdn.com/bootstrap/3.3.4/js/bootstrap.min",
        share:      "//yastatic.net/share/share"
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
    "models/TriangleCross",
    "models/TriangleCube",
    "models/TriangleCubeSimple",
    "collections/Generator",
    "views/Wizard",
    "bootstrap",
    "share",
    "lib/Fileinput"
], function ($,
             TriangleCrossModel,
             TriangleCubeModel,
             TriangleCubeSimpleModel,
             GeneratorCollection,
             WizardView) {
    "use strict";

    $(function () {
        $(document).on("click", "a[href=#]", function (e) {
            e.preventDefault();
        });

        // navbar fixes
        $("footer").css("background-color", $("body > nav").css("background-color"));
        $("footer *").css("color", $(".navbar-default .navbar-nav > li > a").css("color"));

        if ("undefined" === typeof FileReaderd || !$.isFunction(FileReader)) {
            $("#old-browser").fadeIn("slow");
            return;
        } else {
            $("#wizard").show();
        }

        $(":file").filestyle({buttonText: "", buttonName: "btn-primary"});

        var generators = new GeneratorCollection([
            new TriangleCrossModel,
            new TriangleCubeModel,
            new TriangleCubeSimpleModel
        ]);

        new WizardView({
            collection: generators
        });
    });
});
