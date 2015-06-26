/**
 * @module models/TriangleAbstract
 */
define("models/TriangleAbstract", [
    "backbone",
    "underscore",
    "lib/Canvas"
], function (Backbone, _, Canvas) {
    "use strict";

    //noinspection JSValidateJSDoc
    return Backbone.Model.extend({
        defaults: {
            name:        "Abstract Generator",
            description: "Abstract Model for Generators"
        },

        options: {},

        w: 0,
        h: 0,

        clone: function (data) {
            return _.map(data, _.clone);
        },

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
            data = this.grab(data, x, y, w, h);

            this.w = w;
            this.h = h;

            return data;
        },

        /**
         * @param data
         * @param x
         * @param y
         * @param w
         * @param h
         * @returns {CanvasPixelArray}
         */
        grab: function (data, x, y, w, h) {
            var tempCvs = Canvas.createEmptyCanvas(this.w, this.h),
                tempCtx = tempCvs.getContext("2d"),
                tempIData = tempCtx.createImageData(this.w, this.h);

            tempIData.data.set(data);
            tempCtx.putImageData(tempIData, 0, 0);

            return tempCtx.getImageData(x, y, w, h).data;
        },

        draw: function (srcData, destData, destX, destY, srcW, srcH) {
            var tempCvs = Canvas.createEmptyCanvas(this.w, this.h),
                tempCtx = tempCvs.getContext("2d"),
                tempSrcIData = tempCtx.createImageData(srcW, srcH),
                tempDestIData = tempCtx.createImageData(this.w, this.h);

            tempDestIData.data.set(destData);
            tempCtx.putImageData(tempDestIData, 0, 0);

            tempSrcIData.data.set(srcData);
            tempCtx.putImageData(tempSrcIData, destX, destY);

            return tempCtx.getImageData(0, 0, this.w, this.h).data;
        },

        /**
         * @param {Uint8ClampedArray} data
         * @param {number} w
         * @param {number} h
         */
        flipX: function (data, w, h) {
            var tempData = this.clone(data),
                i, flip, x, y, c;

            for (y = 0; y < h; y++) {
                for (x = 0; x < w; x++) {
                    // RGB
                    i = (y * w + x) * 4;
                    flip = (y * w + (w - x - 1)) * 4;

                    for (c = 0; c < 4; c++) {
                        tempData[i + c] = data[flip + c];
                    }
                }
            }

            return tempData;
        },

        flipY: function (data, w, h) {
            var tempData = this.clone(data),
                i, flip, x, y, c;

            for (y = 0; y < h; y++) {
                for (x = 0; x < w; x++) {
                    // RGB
                    i = (y * w + x) * 4;
                    flip = ((h - y - 1) * w + x) * 4;

                    for (c = 0; c < 4; c += 1) {
                        tempData[i + c] = data[flip + c];
                    }
                }
            }

            return tempData;
        },

        rotate: function (data, w, h) {
            var tempData = this.clone(data),
                i, flip, x, y, c;

            for (y = 1; y < h - 1; y += 1) {
                for (x = 1; x < w - 1; x += 1) {
                    // RGB
                    i = (y * w + x) * 4;
                    flip = (x * w + (w - y)) * 4;

                    for (c = 0; c < 4; c += 1) {
                        tempData[i + c] = data[flip + c];
                    }
                }
            }

            return tempData;
        },

        /**
         * @param data Uint8ClampedArray
         * @returns Uint8ClampedArray
         */
        grayscale: function (data) {
            for (var i = 0; i < data.length; i += 4) {
                var r = data[i];
                var g = data[i + 1];
                var b = data[i + 2];

                // CIE luminance for the RGB
                // The human eye is bad at seeing red and blue, so we de-emphasize them.
                var v = 0.2126 * r + 0.7152 * g + 0.0722 * b;
                data[i] = data[i + 1] = data[i + 2] = v;
            }

            return data;
        },

        monochrome: function (data) {
            for (var i = 0; i < data.length; i += 4) {
                var r = data[i];
                var g = data[i + 1];
                var b = data[i + 2];

                var v = Math.floor((r + g + b) / 3);
                data[i] = data[i + 1] = data[i + 2] = (v > 127 ? 255 : 0);
                data[i + 3] = 255;
            }

            return data;
        },

        /**
         * @param data
         * @param adjustment
         * @returns {*}
         */
        brightness: function (data, adjustment) {
            for (var i = 0; i < data.length; i += 4) {
                data[i] += adjustment;
                data[i + 1] += adjustment;
                data[i + 2] += adjustment;
            }

            return data;
        },

        /**
         * @param data
         * @param threshold
         * @returns {*}
         */
        threshold: function (data, threshold) {
            for (var i = 0; i < data.length; i += 4) {
                var r = data[i];
                var g = data[i + 1];
                var b = data[i + 2];
                var v = (0.2126 * r + 0.7152 * g + 0.0722 * b >= threshold) ? 255 : 0;
                data[i] = data[i + 1] = data[i + 2] = v
            }

            return data;
        },

        /**
         * @param data
         * @returns {*}
         */
        sepia: function (data) {
            for (var i = 0; i < data.length; i += 4) {
                var r = data[i];
                var g = data[i + 1];
                var b = data[i + 2];

                data[i] = (r * 0.393) + (g * 0.769) + (b * 0.189);      // red
                data[i + 1] = (r * 0.349) + (g * 0.686) + (b * 0.168);  // green
                data[i + 2] = (r * 0.272) + (g * 0.534) + (b * 0.131);  // blue
            }

            return data;
        },

        /**
         * @param data
         * @returns {*}
         */
        red: function (data) {
            for (var i = 0; i < data.length; i += 4) {
                var r = data[i];
                var g = data[i + 1];
                var b = data[i + 2];

                data[i] = (r + g + b) / 3;     // apply average to red channel
                data[i + 1] = data[i + 2] = 0; // zero out green and blue channel
            }

            return data;
        },

        /**
         * @param data
         * @returns {*}
         */
        green: function (data) {
            for (var i = 0; i < data.length; i += 4) {
                var r = data[i];
                var g = data[i + 1];
                var b = data[i + 2];

                data[i + 1] = (r + g + b) / 3;
                data[i] = data[i + 2] = 0;
            }

            return data;
        },

        /**
         * @param data
         * @returns {*}
         */
        blue: function (data) {
            for (var i = 0; i < data.length; i += 4) {
                var r = data[i];
                var g = data[i + 1];
                var b = data[i + 2];

                data[i + 2] = (r + g + b) / 3;
                data[i] = data[i + 1] = 0;
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

        convolve3x3: function (data, w, m, divisor, offset) {
            if (!divisor) {
                divisor = m.reduce(function (a, b) {
                    return a + b;
                }) || 1; // sum
            }

            //noinspection JSUnresolvedFunction
            var newData = new Uint8ClampedArray(data.length),
                len = newData.length,
                res = 0;

            for (var i = 0; i < len; i++) {
                if ((i + 1) % 4 === 0) {
                    newData[i] = data[i];
                    continue;
                }

                res = 0;

                var these = [
                    data[i - w * 4 - 4] || data[i],
                    data[i - w * 4] || data[i],
                    data[i - w * 4 + 4] || data[i],
                    data[i - 4] || data[i],
                    data[i],
                    data[i + 4] || data[i],
                    data[i + w * 4 - 4] || data[i],
                    data[i + w * 4] || data[i],
                    data[i + w * 4 + 4] || data[i]
                ];

                for (var j = 0; j < 9; j++) {
                    res += these[j] * m[j];
                }

                res /= divisor;

                if (offset) {
                    res += offset;
                }

                newData[i] = res;
            }

            return newData;
        },

        sobel: function (data, w) {
            var grayscale = this.grayscale(data);

            var vertical = this.convolve3x3(grayscale, w,
                [
                    -1, 0, 1,
                    -2, 0, 2,
                    -1, 0, 1
                ]);

            var horizontal = this.convolve3x3(grayscale, w,
                [
                    -1, -2, -1,
                    0, 0, 0,
                    1, 2, 1
                ]);

            //noinspection JSUnresolvedFunction
            var newData = new Uint8ClampedArray(data.length);

            for (var i = 0; i < data.length; i += 4) {
                // make the vertical gradient red
                var v = Math.abs(vertical[i]);
                newData[i] = v;

                // make the horizontal gradient green
                var h = Math.abs(horizontal[i]);
                newData[i + 1] = h;

                // and mix in some blue for aesthetics
                newData[i + 2] = (v + h) / 4;
                newData[i + 3] = 255; // opaque alpha
            }

            return newData;
        },

        convolute: function (data, w, h, weights, opaque) {
            var side = Math.round(Math.sqrt(weights.length)),
                halfSide = Math.floor(side / 2);

            // pad output by the convolution matrix
            //noinspection JSUnresolvedFunction
            var dst = new Uint8ClampedArray(data.length);

            // go through the destination image pixels
            var alphaFac = opaque ? 1 : 0;

            for (var y = 0; y < h; y++) {
                for (var x = 0; x < w; x++) {
                    var sy = y,
                        sx = x,
                        dstOff = (y * w + x) * 4;

                    // calculate the weighed sum of the source image pixels that
                    // fall under the convolution matrix
                    var r = 0,
                        g = 0,
                        b = 0,
                        a = 0;

                    for (var cy = 0; cy < side; cy++) {
                        for (var cx = 0; cx < side; cx++) {
                            var scy = sy + cy - halfSide,
                                scx = sx + cx - halfSide;

                            if (scy >= 0 && scy < h && scx >= 0 && scx < w) {
                                var srcOff = (scy * w + scx) * 4,
                                    wt = weights[cy * side + cx];

                                r += data[srcOff] * wt;
                                g += data[srcOff + 1] * wt;
                                b += data[srcOff + 2] * wt;
                                a += data[srcOff + 3] * wt;
                            }
                        }
                    }

                    dst[dstOff] = r;
                    dst[dstOff + 1] = g;
                    dst[dstOff + 2] = b;
                    dst[dstOff + 3] = a + alphaFac * (255 - a);
                }
            }

            return dst;
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
                Math.floor(oc[0] * n2 + blendColor[0] * n),
                Math.floor(oc[1] * n2 + blendColor[1] * n),
                Math.floor(oc[2] * n2 + blendColor[2] * n),
                oc[3]
            ]);
        }
        ,

        centerKaleidoskope: function (data, w, h) {
            data = this.grab(data, 0, 0, w * 2, h * 2);
            this.w = w * 2;
            this.h = h * 2;

            var block = this.grab(data, 0, 0, w, h);

            data = this.draw(block, data, 0, 0, w, h);

            block = this.flipX(block, w, h);
            data = this.draw(block, data, w, 0, w, h);

            block = this.flipY(block, w, h);
            data = this.draw(block, data, w, h, w, h);

            block = this.flipX(block, w, h);
            data = this.draw(block, data, 0, h, w, h);

            return data;
        }
        ,

        centerOutsideKaleidoskope: function (data, w, h) {
            data = this.grab(data, 0, 0, w * 2, h * 2);
            this.w = w * 2;
            this.h = h * 2;

            var block = this.grab(data, 0, 0, w, h);

            data = this.draw(block, data, 0, 0, w, h);

            block = this.flipY(block, w, h);
            data = this.draw(block, data, w, 0, w, h);

            block = this.flipX(block, w, h);
            data = this.draw(block, data, w, h, w, h);

            block = this.flipY(block, w, h);
            data = this.draw(block, data, 0, h, w, h);

            return data;
        }
        ,

        outsideKaleidoskope: function (data, w, h) {
            data = this.grab(data, 0, 0, w * 2, h * 2);
            this.w = w * 2;
            this.h = h * 2;

            var block = this.grab(data, 0, 0, w, h);

            block = this.flipX(block, w, h);
            data = this.draw(block, data, 0, 0, w, h);

            block = this.flipX(block, w, h);
            data = this.draw(block, data, w, 0, w, h);

            block = this.flipY(block, w, h);
            data = this.draw(block, data, w, h, w, h);

            block = this.flipX(block, w, h);
            data = this.draw(block, data, 0, h, w, h);

            return data;
        }
        ,

        vertKaleidoskope: function (data, w, h) {
            data = this.grab(data, 0, 0, w * 2, h * 2);
            this.w = w * 2;
            this.h = h * 2;

            var block = this.grab(data, 0, 0, this.w, h);
            data = this.draw(block, data, 0, 0, this.w, h);

            block = this.flipY(block, this.w, h);
            data = this.draw(block, data, 0, h, this.w, h);

            return data;
        }
        ,

        cardKaleidoskope: function (data, w, h) {
            data = this.grab(data, 0, 0, w * 2, h * 2);
            this.w = w * 2;
            this.h = h * 2;

            var block = this.grab(data, 0, 0, this.w, h);
            data = this.draw(block, data, 0, 0, this.w, h);

            block = this.flipY(block, this.w, h);
            block = this.flipX(block, this.w, h);
            data = this.draw(block, data, 0, h, this.w, h);

            return data;
        }
        ,

        horizKaleidoskope: function (data, w, h) {
            data = this.grab(data, 0, 0, w * 2, h * 2);
            this.w = w * 2;
            this.h = h * 2;

            var block = this.grab(data, 0, 0, w, this.h);
            data = this.draw(block, data, 0, 0, w, this.h);

            block = this.flipX(block, w, this.h);
            data = this.draw(block, data, w, 0, w, this.h);

            return data;
        }
    });
})
;