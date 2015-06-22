/* global define */

define("lib/Canvas", [], function () {
    "use strict";

    return {
        createEmptyCanvas: function (w, h) {
            var cvs = document.createElement("canvas");
            cvs.width = w;
            cvs.height = h;
            return cvs;
        }
    };
});