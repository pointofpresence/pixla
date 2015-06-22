/**
 * @module models/TriangleAbstract
 */
define("models/TriangleAbstract", [
    "backbone",
    "lib/Canvas"
], function (Backbone, Canvas) {
    "use strict";

    return Backbone.Model.extend({
        defaults: {
            name:        "Abstract Generator",
            description: "Abstract Model for Generators"
        },

        options: {},

        w: 0,
        h: 0,

        readOptions: function () {
            return localStorage[this.cid]
                ? JSON.parse(localStorage[this.cid])
                : {};
        },

        setPixel: function (data, index, color) {
            var i = index * 4;
            data[i] = color[0];
            data[i + 1] = color[1];
            data[i + 2] = color[2];
            data[i + 3] = color[3];
        },

        getPixel: function (data, index) {
            var i = index * 4;
            return [data[i], data[i + 1], data[i + 2], data[i + 3]];
        },

        getPixelXY: function (data, x, y) {
            return this.getPixel(data, y * this.w + x);
        },

        setPixelXY: function (data, x, y, color) {
            return this.setPixel(data, y * this.w + x, color);
        },

        componentToHex: function (c) {
            var hex = c.toString(16);
            return hex.length == 1 ? "0" + hex : hex;
        },

        rgbaToHex: function (color) {
            return this.componentToHex(color[0])
                + this.componentToHex(color[1])
                + this.componentToHex(color[2])
                + this.componentToHex(color[3]);
        },

        /**
         *
         * @param data Uint8ClampedArray
         * @param x int
         * @param y int
         * @param percent float -1 to 1
         * @param blendColor RGBA array
         * @returns {string}
         */
        setShadeBlendPixel: function (data, x, y, percent, blendColor) {
            var oc = this.getPixelXY(data, x, y);

            var n = percent < 0 ? percent * -1 : percent;

            blendColor = blendColor ? blendColor : (percent < 0 ? [0, 0, 0, oc[3]] : [255, 255, 255, oc[3]]);

            var R = Math.round((blendColor[0] - oc[0]) * n) + oc[0];
            var G = Math.round((blendColor[1] - oc[1]) * n) + oc[1];
            var B = Math.round((blendColor[2] - oc[2]) * n) + oc[2];
            var A = Math.round((blendColor[3] - oc[3]) * n) + oc[3];

            this.setPixelXY(data, x, y, [
                    R, G, B, A
                ]
            );
        },

        /**
         * @param w
         * @param h
         * @returns {ImageData}
         */
        createEmptyBuffer: function (w, h) {
            var cvs = document.createElement("canvas");
            cvs.width = w;
            cvs.height = h;
            var ctx = cvs.getContext("2d");
            return ctx.getImageData(0, 0, cvs.width, cvs.height);
        },

        /**
         * @param data
         * @param x
         * @param y
         * @param w
         * @param h
         * @returns {CanvasPixelArray}
         */
        crop: function (data, x, y, w, h) {
            var tempCvs = Canvas.createEmptyCanvas(this.w, this.h),
                tempCtx = tempCvs.getContext("2d"),
                tempIData = tempCtx.createImageData(this.w, this.w);

            tempIData.data.set(data);
            tempCtx.putImageData(tempIData, 0, 0);

            this.w = w;
            this.h = h;

            return tempCtx.getImageData(x, y, w, h).data;
        },

        /**
         * @param data Uint8ClampedArray
         * @returns Uint8ClampedArray
         */
        grayscale: function (data) {
            for (var i = 0; i < data.length; i += 4) {
                var avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
                data[i] = avg;      // red
                data[i + 1] = avg;  // green
                data[i + 2] = avg;  // blue
            }

            return data;
        },

        /**
         * @param data Uint8ClampedArray
         * @returns Uint8ClampedArray
         */
        invert: function (data) {
            for (var i = 0; i < data.length; i += 4) {
                data[i] = 255 - data[i];            // red
                data[i + 1] = 255 - data[i + 1];    // green
                data[i + 2] = 255 - data[i + 2];    // blue
            }

            return data;
        },

        /**
         * @param data
         * @param x
         * @param y
         * @param blendColor
         */
        setMixPixel: function (data, x, y, blendColor) {
            var oc = this.getPixelXY(data, x, y);

            var n = blendColor[3] / 255.0;
            var n2 = 1.0 - n;

            this.setPixelXY(data, x, y, [
                parseInt(oc[0] * n2 + blendColor[0] * n),
                parseInt(oc[1] * n2 + blendColor[1] * n),
                parseInt(oc[2] * n2 + blendColor[2] * n),
                oc[3]
            ]);
        }
    });
});