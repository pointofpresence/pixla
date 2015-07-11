/* global define */

define("lib/Buffer", ["lib/Canvas"], function (Canvas) {
    "use strict";

    //noinspection JSValidateJSDoc
    return {
        COLORS: {
            BLACK: [0, 0, 0, 255],
            WHITE: [255, 255, 255, 255]
        },

        /**
         * @param {Uint8ClampedArray} data
         * @param {number} srcW
         * @param {number} srcH
         * @param {number} dstX
         * @param {number} dstY
         * @param {number} dstW
         * @param {number} dstH
         * @returns {Uint8ClampedArray}
         */
        grab: function (data, srcW, srcH, dstX, dstY, dstW, dstH) {
            var tempCvs = Canvas.createEmptyCanvas(srcW, srcH),
                tempCtx = tempCvs.getContext("2d"),
                tempIData = tempCtx.createImageData(srcW, srcH);

            tempIData.data.set(data);
            tempCtx.putImageData(tempIData, 0, 0);

            //noinspection JSValidateTypes
            return tempCtx.getImageData(
                Math.floor(dstX),
                Math.floor(dstY),
                Math.floor(dstW),
                Math.floor(dstH)
            ).data;
        },

        /**
         * @param srcData
         * @param srcW
         * @param srcH
         * @param destData
         * @param destX
         * @param destY
         * @param destW
         * @param destH
         * @returns {CanvasPixelArray}
         */
        draw: function (srcData, srcW, srcH, destData, destX, destY, destW, destH) {
            var tempCvs = Canvas.createEmptyCanvas(destW, destH),
                tempCtx = tempCvs.getContext("2d"),
                tempSrcIData = tempCtx.createImageData(srcW, srcH),
                tempDestIData = tempCtx.createImageData(destW, destH);

            tempDestIData.data.set(destData);
            tempCtx.putImageData(tempDestIData, 0, 0);

            tempSrcIData.data.set(srcData);
            tempCtx.putImageData(tempSrcIData, destX, destY);

            return tempCtx.getImageData(0, 0, destW, destH).data;
        },

        /**
         * @param data
         * @param index
         * @returns {*[]}
         */
        getPixel: function (data, index) {
            var i = index * 4;
            return [data[i], data[i + 1], data[i + 2], data[i + 3]];
        },

        /**
         * @param data
         * @param x
         * @param y
         * @param w
         * @returns {*}
         */
        getPixelXY: function (data, x, y, w) {
            return this.getPixel(data, Math.floor(y * w + x));
        },

        /**
         * @param data
         * @param index
         * @param color
         */
        setPixel: function (data, index, color) {
            var i = index * 4;
            data[i] = color[0];
            data[i + 1] = color[1];
            data[i + 2] = color[2];
            data[i + 3] = color[3];
        },

        /**
         * @param data
         * @param x
         * @param y
         * @param color
         * @param w
         * @returns {*}
         */
        setPixelXY: function (data, x, y, color, w) {
            if (x >= w) {
                return;
            }

            return this.setPixel(data, y * w + x, color);
        },

        /**
         * @param color1
         * @param color2
         * @param percent
         * @returns {*[]}
         */
        mixColors: function (color1, color2, percent) {
            var n = percent || 0.5;

            var R = Math.round((color2[0] - color1[0]) * n) + color1[0];
            var G = Math.round((color2[1] - color1[1]) * n) + color1[1];
            var B = Math.round((color2[2] - color1[2]) * n) + color1[2];
            var A = Math.round((color2[3] - color1[3]) * n) + color1[3];

            return [
                R, G, B, A
            ];
        },

        /**
         * @param data
         * @param x
         * @param y
         * @param blendColor
         * @param w
         */
        setMixPixel: function (data, x, y, blendColor, w) {
            var oc = this.getPixelXY(data, x, y, w);

            var n = blendColor[3] / 255.0;
            var n2 = 1.0 - n;

            this.setPixelXY(data, x, y, [
                Math.floor(oc[0] * n2 + blendColor[0] * n),
                Math.floor(oc[1] * n2 + blendColor[1] * n),
                Math.floor(oc[2] * n2 + blendColor[2] * n),
                oc[3]
            ], w);
        },

        /**
         *
         * @param data Uint8ClampedArray
         * @param x int
         * @param y int
         * @param percent float -1 to 1
         * @param blendColor RGBA array
         * @returns {string}
         * @param w
         */
        setShadeBlendPixel: function (data, x, y, percent, blendColor, w) {
            var oc = this.getPixelXY(data, x, y, w);

            var n = percent < 0 ? percent * -1 : percent;

            blendColor = blendColor ? blendColor : (percent < 0 ? [0, 0, 0, oc[3]] : [255, 255, 255, oc[3]]);

            var R = Math.round((blendColor[0] - oc[0]) * n) + oc[0];
            var G = Math.round((blendColor[1] - oc[1]) * n) + oc[1];
            var B = Math.round((blendColor[2] - oc[2]) * n) + oc[2];
            var A = Math.round((blendColor[3] - oc[3]) * n) + oc[3];

            this.setPixelXY(data, x, y, [
                    R, G, B, A
                ], w
            );
        },

        /**
         * @param {number} c
         * @returns {string}
         */
        componentToHex: function (c) {
            var hex = c.toString(16);
            return hex.length == 1 ? "0" + hex : hex;
        },

        /**
         * @param {Array} color
         * @returns {string}
         */
        rgbaToHex: function (color) {
            return this.componentToHex(color[0])
                + this.componentToHex(color[1])
                + this.componentToHex(color[2])
                + this.componentToHex(color[3]);
        }
    };
});