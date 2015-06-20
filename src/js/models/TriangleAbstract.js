/**
 * @module models/TriangleAbstract
 */
define("models/TriangleAbstract", ["backbone"], function (Backbone) {
    "use strict";

    return Backbone.Model.extend({
        defaults: {
            name: "Abstract Generator",
            description: "Abstract Model for Generators"
        },

        w: 0,
        h: 0,

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
            return componentToHex(color[0]) + componentToHex(color[1]) + componentToHex(color[2]) + componentToHex(color[3]);
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