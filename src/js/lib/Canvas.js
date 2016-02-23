"use strict";

module.exports = {
    /**
     * @param w
     * @param h
     * @param [id]
     * @returns {HTMLElement}
     */
    createEmptyCanvas: function (w, h, id) {
        var canvas    = document.createElement("canvas");
        canvas.width  = w;
        canvas.height = h;

        if (id) {
            canvas.id = id;
        }

        return canvas;
    },

    /**
     * @param image
     * @returns {HTMLElement}
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
    },

    /**
     * @param w
     * @param h
     * @returns {ImageData}
     */
    createEmptyBuffer: function (w, h) {
        var cvs    = document.createElement("canvas");
        cvs.width  = w;
        cvs.height = h;
        var ctx    = cvs.getContext("2d");
        return ctx.getImageData(0, 0, cvs.width, cvs.height);
    }
};