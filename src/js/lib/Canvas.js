/* global define */

define("lib/Canvas", [], function () {
    "use strict";

    return {
        /**
         * @param w
         * @param h
         * @returns {HTMLElement}
         */
        createEmptyCanvas: function (w, h) {
            var canvas = document.createElement("canvas");
            canvas.width = w;
            canvas.height = h;

            return canvas;
        },

        /**
         * @param image
         * @returns {*}
         */
        convertImageToCanvas: function (image) {
            var canvas = this.createEmptyCanvas(image.width, image.height);
            canvas.getContext("2d").drawImage(image, 0, 0);

            return canvas;
        },

        /**
         * @param canvas
         * @param callback
         */
        convertCanvasToImage: function (canvas, callback) {
            var image = new Image();

            image.onload = function () {
                callback(image);
            };

            image.src = canvas.toDataURL("image/png");
        }
    };
});