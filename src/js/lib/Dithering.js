"use strict";

/**
 * @description Based on dpiccone/ditherjs
 */
module.exports = function () {
    //noinspection JSValidateJSDoc
    return {
        opt: {},

        ALGORITHM: {
            REDUCE:   "Reduce",
            ORDERED:  "Ordered",
            ERROR:    "Error diffusion",
            ATKINSON: "Atkinson"
        },

        PALETTE: {
            C64: {
                name: "C64",
                data: [
                    [0, 0, 0],
                    [102, 102, 204],
                    [102, 204, 204],
                    [153, 255, 153],
                    [204, 102, 102],
                    [204, 204, 102],
                    [255, 255, 255],
                    [51, 51, 153],
                    [102, 51, 0],
                    [102, 102, 102],
                    [102, 153, 51],
                    [153, 51, 51],
                    [153, 51, 153],
                    [153, 102, 51],
                    [153, 153, 153]
                ]
            },

            BASIC: {
                name: "Basic",
                data: [
                    [0, 0, 0],
                    [255, 0, 255],
                    [0, 255, 255],
                    [255, 255, 255]
                ]
            },

            SPECTRUM: {
                name: "ZX Spectrum",
                data: [
                    [0, 0, 0],
                    [0, 0, 255],
                    [0, 255, 0],
                    [0, 255, 255],
                    [255, 0, 0],
                    [255, 0, 255],
                    [255, 255, 0],
                    [255, 255, 255]
                ]
            },

            MONO: {
                name: "Monochrome",
                data: [
                    [0, 0, 0],
                    [255, 255, 255]
                ]
            },

            AMIGA_ORANGE: {
                name: "Amiga Orange",
                data: [
                    [0, 0, 0],
                    [0, 0, 51],
                    [0, 51, 51],
                    [102, 102, 204],
                    [102, 153, 255],
                    [204, 102, 51],
                    [204, 153, 51],
                    [204, 153, 153],
                    [204, 204, 204],
                    [255, 153, 102],
                    [255, 204, 102],
                    [255, 204, 153],
                    [255, 204, 204],
                    [51, 0, 0],
                    [51, 51, 0],
                    [51, 51, 51],
                    [51, 51, 102],
                    [51, 51, 153],
                    [51, 102, 102],
                    [51, 102, 153],
                    [102, 0, 0],
                    [102, 51, 0],
                    [102, 51, 51],
                    [102, 102, 51],
                    [102, 102, 102],
                    [153, 51, 0],
                    [153, 102, 51],
                    [153, 153, 153]
                ]
            },

            AMIGA_BRONZE: {
                name: "Amiga Bronze",
                data: [
                    [0, 0, 0],
                    [204, 102, 51],
                    [204, 153, 51],
                    [204, 153, 102],
                    [204, 153, 153],
                    [204, 204, 153],
                    [204, 204, 204],
                    [255, 153, 102],
                    [255, 204, 153],
                    [255, 204, 204],
                    [255, 255, 255],
                    [51, 0, 0],
                    [51, 51, 0],
                    [51, 51, 51],
                    [102, 51, 0],
                    [102, 51, 51],
                    [102, 102, 51],
                    [102, 102, 102],
                    [153, 51, 0],
                    [153, 102, 51],
                    [153, 102, 102],
                    [153, 153, 102],
                    [153, 153, 153]
                ]
            }
        },

        /**
         * @param data
         * @param w
         * @param h
         * @param opt
         * @returns {Uint8ClampedArray}
         */
        dither: function (data, w, h, opt) {
            opt = opt || {};

            this.opt.step = opt.step || 1; // works better with 1,3,5,7
            this.opt.algorithm = opt.algorithm || this.ALGORITHM.REDUCE;
            this.opt.palette = opt.palette.data || this.PALETTE.BASIC.data;

            this.w = w;
            this.h = h;

            switch (this.opt.algorithm) {
                case this.ALGORITHM.ERROR:
                    return this.errorDiffusionDither(data);
                case this.ALGORITHM.ORDERED:
                    return this.orderedDither(data);
                case this.ALGORITHM.ATKINSON:
                    return this.atkinsonDither(data);
                case this.ALGORITHM.REDUCE:
                    return this.reduceDither(data);
                default :
                    throw new Error("Not a valid algorithm");
            }
        },

        /**
         * Return a distance of two colors ina three dimensional space
         * @return number
         * @param {Array} a
         * @param {Array} b
         * */
        colorDistance: function (a, b) {
            return Math.sqrt(
                Math.pow(((a[0]) - (b[0])), 2)
                + Math.pow(((a[1]) - (b[1])), 2)
                + Math.pow(((a[2]) - (b[2])), 2)
            );
        },

        /**
         * Return the most closer color vs a common palette
         * @return i - the index of the closer color
         * @param {Array} color
         * */
        approximateColor: function (color) {
            var palette = this.opt.palette;

            var findIndex = function (fun, arg, list, min) {
                if (list.length == 2) {
                    if (fun(arg, min) <= fun(arg, list[1])) {
                        return min;
                    } else {
                        return list[1];
                    }
                } else {
                    var tl = list.slice(1);

                    if (fun(arg, min) <= fun(arg, list[1])) {
                        min = min;
                    } else {
                        min = list[1];
                    }
                    return findIndex(fun, arg, tl, min);
                }
            };

            return findIndex(this.colorDistance, color, palette, palette[0]);
        },

        /**
         * @description Threshold function
         * @param value
         * @returns {number}
         */
        threshold: function (value) {
            return value < 127 ? 0 : 255;
        },

        /**
         * @description Perform an ordered dither on the image
         * @param data
         * @returns {Uint8ClampedArray}
         */
        orderedDither: function (data) {
            // Create a new empty image
            //noinspection JSUnresolvedFunction
            var d = new Uint8ClampedArray(data),
                w = this.w,
                h = this.h;

            // Step
            var step = this.opt.step;

            // Ratio >= 1
            var ratio = 3;

            // Threshold Matrix
            var m = [
                [1, 9, 3, 11],
                [13, 5, 15, 7],
                [4, 12, 2, 10],
                [16, 8, 14, 6]
            ];

            for (var y = 0; y < h; y += step) {
                for (var x = 0; x < w; x += step) {
                    var i = (4 * x) + (4 * y * w);

                    // Define bytes
                    var r = i;
                    var g = i + 1;
                    var b = i + 2;

                    d[r] += m[x % 4][y % 4] * ratio;
                    d[g] += m[x % 4][y % 4] * ratio;
                    d[b] += m[x % 4][y % 4] * ratio;

                    var color = [d[r], d[g], d[b]];
                    var approx = this.approximateColor(color);
                    var tr = approx[0];
                    var tg = approx[1];
                    var tb = approx[2];

                    // Draw a block
                    for (var dx = 0; dx < step; dx++) {
                        for (var dy = 0; dy < step; dy++) {
                            var di = i + (4 * dx) + (4 * w * dy);

                            // Draw pixel
                            d[di] = tr;
                            d[di + 1] = tg;
                            d[di + 2] = tb;
                        }
                    }
                }
            }

            return d;
        },

        reduceDither: function (data) {
            // Create a new empty image
            //noinspection JSUnresolvedFunction
            var d = new Uint8ClampedArray(data),
                w = this.w,
                h = this.h;

            // Step
            var step = this.opt.step;

            for (var y = 0; y < h; y += step) {
                for (var x = 0; x < w; x += step) {
                    var i = (4 * x) + (4 * y * w);

                    // Define bytes
                    var r = i;
                    var g = i + 1;
                    var b = i + 2;

                    var color = [d[r], d[g], d[b]];
                    var approx = this.approximateColor(color);
                    var tr = approx[0];
                    var tg = approx[1];
                    var tb = approx[2];

                    // Draw a block
                    for (var dx = 0; dx < step; dx++) {
                        for (var dy = 0; dy < step; dy++) {
                            var di = i + (4 * dx) + (4 * w * dy);

                            // Draw pixel
                            d[di] = tr;
                            d[di + 1] = tg;
                            d[di + 2] = tb;
                        }
                    }
                }
            }

            return d;
        },

        /**
         * @description Perform an atkinson dither on the image
         * @param data
         * @returns {Uint8ClampedArray}
         */
        atkinsonDither: function (data) {
            // Create a new empty image
            //noinspection JSUnresolvedFunction
            var d = new Uint8ClampedArray(data),
                out = new Uint8ClampedArray(data),
                w = this.w,
                h = this.h;

            // Step
            var step = this.opt.step;

            // Ratio >= 1
            var ratio = 1 / 8;

            for (var y = 0; y < h; y += step) {
                for (var x = 0; x < w; x += step) {
                    var i = (4 * x) + (4 * y * w);

                    var $i = function (x, y) {
                        return (4 * x) + (4 * y * w);
                    };

                    // Define bytes
                    var r = i;
                    var g = i + 1;
                    var b = i + 2;

                    var color = [d[r], d[g], d[b]];
                    var approx = this.approximateColor(color);

                    var q = [];
                    q[r] = d[r] - approx[0];
                    q[g] = d[g] - approx[1];
                    q[b] = d[b] - approx[2];

                    // Diffuse the error for three colors
                    d[$i(x + step, y) + 0] += ratio * q[r];
                    d[$i(x - step, y + step) + 0] += ratio * q[r];
                    d[$i(x, y + step) + 0] += ratio * q[r];
                    d[$i(x + step, y + step) + 0] += ratio * q[r];
                    d[$i(x + (2 * step), y) + 0] += ratio * q[r];
                    d[$i(x, y + (2 * step)) + 0] += ratio * q[r];

                    d[$i(x + step, y) + 1] += ratio * q[r];
                    d[$i(x - step, y + step) + 1] += ratio * q[r];
                    d[$i(x, y + step) + 1] += ratio * q[r];
                    d[$i(x + step, y + step) + 1] += ratio * q[r];
                    d[$i(x + (2 * step), y) + 1] += ratio * q[r];
                    d[$i(x, y + (2 * step)) + 1] += ratio * q[r];

                    d[$i(x + step, y) + 2] += ratio * q[r];
                    d[$i(x - step, y + step) + 2] += ratio * q[r];
                    d[$i(x, y + step) + 2] += ratio * q[r];
                    d[$i(x + step, y + step) + 2] += ratio * q[r];
                    d[$i(x + (2 * step), y) + 2] += ratio * q[r];
                    d[$i(x, y + (2 * step)) + 2] += ratio * q[r];

                    var tr = approx[0];
                    var tg = approx[1];
                    var tb = approx[2];

                    // Draw a block
                    for (var dx = 0; dx < step; dx++) {
                        for (var dy = 0; dy < step; dy++) {
                            var di = i + (4 * dx) + (4 * w * dy);

                            // Draw pixel
                            out[di] = tr;
                            out[di + 1] = tg;
                            out[di + 2] = tb;

                        }
                    }
                }
            }

            return out;
        },

        /**
         * @description Perform an error diffusion dither on the image
         * @param data
         * @returns {Uint8ClampedArray}
         */
        errorDiffusionDither: function (data) {
            //noinspection JSUnresolvedFunction
            var d = new Uint8ClampedArray(data),
                out = new Uint8ClampedArray(data),
                w = this.w,
                h = this.h;

            // Step
            var step = this.opt.step;

            // Ratio >= 1
            var ratio = 1 / 16;

            for (var y = 0; y < h; y += step) {
                for (var x = 0; x < w; x += step) {
                    var i = (4 * x) + (4 * y * w);

                    var $i = function (x, y) {
                        return (4 * x) + (4 * y * w);
                    };

                    // Define bytes
                    var r = i;
                    var g = i + 1;
                    var b = i + 2;

                    var color = [d[r], d[g], d[b]];
                    var approx = this.approximateColor(color);

                    var q = [];
                    q[r] = d[r] - approx[0];
                    q[g] = d[g] - approx[1];
                    q[b] = d[b] - approx[2];

                    // Diffuse the error
                    d[$i(x + step, y)] = d[$i(x + step, y)] + 7 * ratio * q[r];
                    d[$i(x - step, y + 1)] = d[$i(x - 1, y + step)] + 3 * ratio * q[r];
                    d[$i(x, y + step)] = d[$i(x, y + step)] + 5 * ratio * q[r];
                    d[$i(x + step, y + step)] = d[$i(x + 1, y + step)] + 1 * ratio * q[r];

                    d[$i(x + step, y) + 1] = d[$i(x + step, y) + 1] + 7 * ratio * q[g];
                    d[$i(x - step, y + step) + 1] = d[$i(x - step, y + step) + 1] + 3 * ratio * q[g];
                    d[$i(x, y + step) + 1] = d[$i(x, y + step) + 1] + 5 * ratio * q[g];
                    d[$i(x + step, y + step) + 1] = d[$i(x + step, y + step) + 1] + 1 * ratio * q[g];

                    d[$i(x + step, y) + 2] = d[$i(x + step, y) + 2] + 7 * ratio * q[b];
                    d[$i(x - step, y + step) + 2] = d[$i(x - step, y + step) + 2] + 3 * ratio * q[b];
                    d[$i(x, y + step) + 2] = d[$i(x, y + step) + 2] + 5 * ratio * q[b];
                    d[$i(x + step, y + step) + 2] = d[$i(x + step, y + step) + 2] + 1 * ratio * q[b];

                    // Color
                    var tr = approx[0];
                    var tg = approx[1];
                    var tb = approx[2];

                    // Draw a block
                    for (var dx = 0; dx < step; dx++) {
                        for (var dy = 0; dy < step; dy++) {
                            var di = i + (4 * dx) + (4 * w * dy);

                            // Draw pixel
                            out[di] = tr;
                            out[di + 1] = tg;
                            out[di + 2] = tb;

                        }
                    }
                }
            }

            return out;
        }
    };
};