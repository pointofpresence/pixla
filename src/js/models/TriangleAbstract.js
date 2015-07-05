/**
 * @module models/TriangleAbstract
 */
define("models/TriangleAbstract", [
    "backbone",
    "underscore",
    "lib/Canvas",
    "lib/Dithering"
], function (Backbone, _, Canvas, Dithering) {
    "use strict";

    //noinspection JSValidateJSDoc,JSUnusedGlobalSymbols
    return Backbone.Model.extend({
        defaults: {
            name:        "Abstract Generator",
            description: "Abstract Model for Generators",
            sort:        0
        },

        w: 0,
        h: 0,

        initialize: function () {
            this.options = {
                mirror:       {
                    name:    "Отражение",
                    type:    "Select",
                    options: [
                        {text: "Нет"},
                        {text: "По оси X", cb: this.cbMirrorX},
                        {text: "По оси Y", cb: this.cbMirrorY},
                        {text: "По оси X и Y", cb: this.cbMirrorXY}
                    ]
                },
                kaleidoscope: {
                    name:    "Калейдоскоп",
                    type:    "Select",
                    options: [
                        {text: "Нет"},
                        {text: "К центру", cb: this.centerKaleidoskope},
                        {text: "В стороны", cb: this.outsideKaleidoskope},
                        {text: "К центру и в стороны", cb: this.centerOutsideKaleidoskope},
                        {text: "По горизонтали", cb: this.horizKaleidoskope},
                        {text: "По вертикали", cb: this.vertKaleidoskope},
                        {text: "Игральная карта", cb: this.cardKaleidoskope}
                    ]
                },
                colors:       {
                    name:    "Цвет",
                    type:    "Select",
                    options: [
                        {text: "Нет"},
                        {text: "Монохром", cb: this.monochrome},
                        {text: "Градации серого", cb: this.grayscale},
                        {text: "Сепия", cb: this.sepia},
                        {text: "Красный", cb: this.red},
                        {text: "Зеленый", cb: this.green},
                        {text: "Синий", cb: this.blue}
                    ]
                },
                brightness:   {
                    name: "Яркость",
                    type: "Slider",
                    min:  0,
                    max:  200,
                    cb:   this.brightness
                },
                threshold:    {
                    name: "Порог",
                    type: "Slider",
                    min:  0,
                    max:  200,
                    cb:   this.threshold
                },
                blur:         {
                    name: "Размытие",
                    type: "Slider",
                    min:  0,
                    max:  3
                },
                sharpen:      {
                    name: "Резкость",
                    type: "Slider",
                    min:  0,
                    max:  10
                },
                edge:         {
                    name: "Поиск края",
                    type: "Slider",
                    min:  0,
                    max:  2
                },
                emboss:       {
                    name: "Рельеф",
                    type: "Slider",
                    min:  0,
                    max:  2
                },
                sobel:        {
                    name: "Оператор Собеля",
                    type: "Slider",
                    min:  0,
                    max:  1
                },
                thin:         {
                    name: "Контур",
                    type: "Slider",
                    min:  0,
                    max:  1
                },
                dither:       {
                    name:    "Дизеринг",
                    type:    "Select",
                    options: this.buildDitherList()
                },
                zhangSuen:    {
                    name: "Скелет",
                    type: "Slider",
                    min:  0,
                    max:  1
                }, invert:    {
                    name: "Инверсия",
                    type: "Slider",
                    min:  0,
                    max:  1
                }
            };
        },

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
            return this.getPixel(data, Math.floor(y * this.w + x));
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

        zhangSuen: function (data, w, h) {
            var self = this;

            function Image2Bool(img, width, height) {
                var s = [];

                for (var y = 0; y < height; y++) {
                    var sx = [];

                    for (var x = 0; x < width; x++) {
                        var p = self.getPixelXY(img, x, y);

                        if (x == 0 || y == 0 || x == width - 1 || y == height - 1) {
                            sx.push(false);
                        } else {
                            var v = Math.floor((p[0] + p[1] + p[2]) / 3);
                            sx.push(v < 32);
                        }

                    }

                    s.push(sx);
                }

                return s;
            }

            function Bool2Image(s, width, height) {
                var bmp = new Uint8ClampedArray(width * height * 4);

                for (var y = 0; y < height; y++) {
                    for (var x = 0; x < width; x++) {
                        if (s[y][x]) {
                            self.setPixelXY(bmp, x, y, [0, 0, 0, 255]);
                        } else {
                            self.setPixelXY(bmp, x, y, [255, 255, 255, 255]);
                        }
                    }
                }

                return bmp;
            }

            /**
             * @return {number}
             */
            function NumberOfNonZeroNeighbors(x, y, s) {
                var count = 0;

                if (s[x - 1][y])     count++;
                if (s[x - 1][y + 1]) count++;
                if (s[x - 1][y - 1]) count++;
                if (s[x][y + 1])     count++;
                if (s[x][y - 1])     count++;
                if (s[x + 1][y])     count++;
                if (s[x + 1][y + 1]) count++;
                if (s[x + 1][y - 1]) count++;

                return count;
            }

            /**
             * @return {number}
             */
            function NumberOfZeroToOneTransitionFromP9(x, y, s) {
                var p2 = s[x][y - 1];
                var p3 = s[x + 1][y - 1];
                var p4 = s[x + 1][y];
                var p5 = s[x + 1][y + 1];
                var p6 = s[x][y + 1];
                var p7 = s[x - 1][y + 1];
                var p8 = s[x - 1][y];
                var p9 = s[x - 1][y - 1];

                return (+(!p2 && p3)) + (+(!p3 && p4))
                    + (+(!p4 && p5)) + (+(!p5 && p6))
                    + (+(!p6 && p7)) + (+(!p7 && p8))
                    + (+(!p8 && p9)) + (+(!p9 && p2));
            }

            /**
             * @return {boolean}
             */
            function SuenThinningAlg(x, y, s, even) {
                var p2 = s[x][y - 1];
                var p4 = s[x + 1][y];
                var p6 = s[x][y + 1];
                var p8 = s[x - 1][y];

                var bp1 = NumberOfNonZeroNeighbors(x, y, s);

                if (bp1 >= 2 && bp1 <= 6) {
                    if (NumberOfZeroToOneTransitionFromP9(x, y, s) == 1) {
                        if (even) {
                            if (!((p2 && p4) && p8)) {
                                if (!((p2 && p6) && p8)) {
                                    return true;
                                }
                            }
                        } else {
                            if (!((p2 && p4) && p6)) {
                                if (!((p4 && p6) && p8)) {
                                    return true;
                                }
                            }
                        }
                    }
                }

                return false;
            }

            function step(stepNo, temp, s) {
                var count = 0;

                for (var a = 1; a < temp.length - 1; a++) {
                    for (var b = 1; b < temp[0].length - 1; b++) {
                        if (SuenThinningAlg(a, b, temp, stepNo == 2)) {
                            // still changes happening?
                            if (s[a][b]) {
                                count++;
                            }

                            s[a][b] = false;
                        }
                    }
                }

                return count;
            }

            function ZhangSuenThinning(img, width, height) {
                var s = Image2Bool(img, width, height);

                var temp;
                var count = 0;

                do {
                    temp = self.clone(s);
                    count = step(1, temp, s);

                    temp = self.clone(s);
                    count += step(2, temp, s);
                } while (count > 0);

                return Bool2Image(s, width, height);
            }

            return ZhangSuenThinning(data, w, h);
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

            return tempCtx.getImageData(
                Math.floor(x),
                Math.floor(y),
                Math.floor(w),
                Math.floor(h)
            ).data;
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
        },

        mixColors: function (color1, color2) {
            var n = 0.5;

            var R = Math.round((color2[0] - color1[0]) * n) + color1[0];
            var G = Math.round((color2[1] - color1[1]) * n) + color1[1];
            var B = Math.round((color2[2] - color1[2]) * n) + color1[2];
            var A = Math.round((color2[3] - color1[3]) * n) + color1[3];

            return [
                R, G, B, A
            ];
        },

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
        },

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
        },

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
        },

        vertKaleidoskope: function (data, w, h) {
            data = this.grab(data, 0, 0, w * 2, h * 2);
            this.w = w * 2;
            this.h = h * 2;

            var block = this.grab(data, 0, 0, this.w, h);
            data = this.draw(block, data, 0, 0, this.w, h);

            block = this.flipY(block, this.w, h);
            data = this.draw(block, data, 0, h, this.w, h);

            return data;
        },

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
        },

        /**
         * @param data
         * @param w
         * @param h
         * @returns {*}
         */
        horizKaleidoskope: function (data, w, h) {
            data = this.grab(data, 0, 0, w * 2, h * 2);
            this.w = w * 2;
            this.h = h * 2;

            var block = this.grab(data, 0, 0, w, this.h);
            data = this.draw(block, data, 0, 0, w, this.h);

            block = this.flipX(block, w, this.h);
            data = this.draw(block, data, w, 0, w, this.h);

            return data;
        },

        //// UTILS ////////////////////////////////////////////////////////////

        format: function () {
            var theString = arguments[0];

            for (var i = 1; i < arguments.length; i++) {
                var regEx = new RegExp("\\{" + (i - 1) + "\\}", "gm");
                theString = theString.replace(regEx, arguments[i]);
            }

            return theString;
        },

        ucfirst: function (str) {
            if (str.length) {
                str = str.charAt(0).toUpperCase() + str.slice(1);
            }

            return str;
        },

        //// DITHERING ////////////////////////////////////////////////////////

        buildDitherList: function () {
            var options = [
                {text: "Нет"}
            ];

            _.each(Dithering.PALETTE, function (obj, keyP) {
                var nameP = obj.name;

                _.each(Dithering.ALGORITHM, function (nameA, keyA) {
                    options.push(
                        {
                            text: this.format("{0} ({1})", nameP, nameA),
                            cb:   this[this.format("dither{0}_{1}", keyP, keyA)]
                        }
                    );
                }, this);
            }, this);

            return options;
        },

        /**
         * @param data
         * @param w
         * @param h
         * @returns {*}
         */
        ditherC64_REDUCE: function (data, w, h) {
            return Dithering.dither(data, w, h, {
                palette:   Dithering.PALETTE.C64,
                algorithm: Dithering.ALGORITHM.REDUCE
            });
        },

        /**
         * @param data
         * @param w
         * @param h
         * @returns {*}
         */
        ditherC64_ORDERED: function (data, w, h) {
            return Dithering.dither(data, w, h, {
                palette:   Dithering.PALETTE.C64,
                algorithm: Dithering.ALGORITHM.ORDERED
            });
        },

        /**
         * @param data
         * @param w
         * @param h
         * @returns {*}
         */
        ditherC64_ERROR: function (data, w, h) {
            return Dithering.dither(data, w, h, {
                palette:   Dithering.PALETTE.C64,
                algorithm: Dithering.ALGORITHM.ERROR
            });
        },

        /**
         * @param data
         * @param w
         * @param h
         * @returns {*}
         */
        ditherC64_ATKINSON: function (data, w, h) {
            return Dithering.dither(data, w, h, {
                palette:   Dithering.PALETTE.C64,
                algorithm: Dithering.ALGORITHM.ATKINSON
            });
        },

        /**
         * @param data
         * @param w
         * @param h
         * @returns {*}
         */
        ditherSPECTRUM_ATKINSON: function (data, w, h) {
            return Dithering.dither(data, w, h, {
                palette:   Dithering.PALETTE.SPECTRUM,
                algorithm: Dithering.ALGORITHM.ATKINSON
            });
        },

        /**
         * @param data
         * @param w
         * @param h
         * @returns {*}
         */
        ditherSPECTRUM_REDUCE: function (data, w, h) {
            return Dithering.dither(data, w, h, {
                palette:   Dithering.PALETTE.SPECTRUM,
                algorithm: Dithering.ALGORITHM.REDUCE
            });
        },

        /**
         * @param data
         * @param w
         * @param h
         * @returns {*}
         */
        ditherSPECTRUM_ORDERED: function (data, w, h) {
            return Dithering.dither(data, w, h, {
                palette:   Dithering.PALETTE.SPECTRUM,
                algorithm: Dithering.ALGORITHM.ORDERED
            });
        },

        /**
         * @param data
         * @param w
         * @param h
         * @returns {*}
         */
        ditherSPECTRUM_ERROR: function (data, w, h) {
            return Dithering.dither(data, w, h, {
                palette:   Dithering.PALETTE.SPECTRUM,
                algorithm: Dithering.ALGORITHM.ERROR
            });
        },

        /**
         * @param data
         * @param w
         * @param h
         * @returns {*}
         */
        ditherAMIGA_BRONZE_ATKINSON: function (data, w, h) {
            return Dithering.dither(data, w, h, {
                palette:   Dithering.PALETTE.AMIGA_BRONZE,
                algorithm: Dithering.ALGORITHM.ATKINSON
            });
        },

        /**
         * @param data
         * @param w
         * @param h
         * @returns {*}
         */
        ditherAMIGA_BRONZE_REDUCE: function (data, w, h) {
            return Dithering.dither(data, w, h, {
                palette:   Dithering.PALETTE.AMIGA_BRONZE,
                algorithm: Dithering.ALGORITHM.REDUCE
            });
        },

        /**
         * @param data
         * @param w
         * @param h
         * @returns {*}
         */
        ditherAMIGA_BRONZE_ORDERED: function (data, w, h) {
            return Dithering.dither(data, w, h, {
                palette:   Dithering.PALETTE.AMIGA_BRONZE,
                algorithm: Dithering.ALGORITHM.ORDERED
            });
        },

        /**
         * @param data
         * @param w
         * @param h
         * @returns {*}
         */
        ditherAMIGA_BRONZE_ERROR: function (data, w, h) {
            return Dithering.dither(data, w, h, {
                palette:   Dithering.PALETTE.AMIGA_BRONZE,
                algorithm: Dithering.ALGORITHM.ERROR
            });
        }, /**
         * @param data
         * @param w
         * @param h
         * @returns {*}
         */
        ditherMONO_ATKINSON:      function (data, w, h) {
            return Dithering.dither(data, w, h, {
                palette:   Dithering.PALETTE.MONO,
                algorithm: Dithering.ALGORITHM.ATKINSON
            });
        },

        /**
         * @param data
         * @param w
         * @param h
         * @returns {*}
         */
        ditherMONO_REDUCE: function (data, w, h) {
            return Dithering.dither(data, w, h, {
                palette:   Dithering.PALETTE.MONO,
                algorithm: Dithering.ALGORITHM.REDUCE
            });
        },

        /**
         * @param data
         * @param w
         * @param h
         * @returns {*}
         */
        ditherMONO_ORDERED: function (data, w, h) {
            return Dithering.dither(data, w, h, {
                palette:   Dithering.PALETTE.MONO,
                algorithm: Dithering.ALGORITHM.ORDERED
            });
        },

        /**
         * @param data
         * @param w
         * @param h
         * @returns {*}
         */
        ditherMONO_ERROR: function (data, w, h) {
            return Dithering.dither(data, w, h, {
                palette:   Dithering.PALETTE.MONO,
                algorithm: Dithering.ALGORITHM.ERROR
            });
        },

        /**
         * @param data
         * @param w
         * @param h
         * @returns {*}
         */
        ditherAMIGA_ORANGE_ATKINSON: function (data, w, h) {
            return Dithering.dither(data, w, h, {
                palette:   Dithering.PALETTE.AMIGA_ORANGE,
                algorithm: Dithering.ALGORITHM.ATKINSON
            });
        },

        /**
         * @param data
         * @param w
         * @param h
         * @returns {*}
         */
        ditherAMIGA_ORANGE_REDUCE: function (data, w, h) {
            return Dithering.dither(data, w, h, {
                palette:   Dithering.PALETTE.AMIGA_ORANGE,
                algorithm: Dithering.ALGORITHM.REDUCE
            });
        },

        /**
         * @param data
         * @param w
         * @param h
         * @returns {*}
         */
        ditherAMIGA_ORANGE_ORDERED: function (data, w, h) {
            return Dithering.dither(data, w, h, {
                palette:   Dithering.PALETTE.AMIGA_ORANGE,
                algorithm: Dithering.ALGORITHM.ORDERED
            });
        },

        /**
         * @param data
         * @param w
         * @param h
         * @returns {*}
         */
        ditherAMIGA_ORANGE_ERROR: function (data, w, h) {
            return Dithering.dither(data, w, h, {
                palette:   Dithering.PALETTE.AMIGA_ORANGE,
                algorithm: Dithering.ALGORITHM.ERROR
            });
        },

        /**
         * @param data
         * @param w
         * @param h
         * @returns {*}
         */
        ditherBASIC_ATKINSON: function (data, w, h) {
            return Dithering.dither(data, w, h, {
                palette:   Dithering.PALETTE.BASIC,
                algorithm: Dithering.ALGORITHM.ATKINSON
            });
        },

        /**
         * @param data
         * @param w
         * @param h
         * @returns {*}
         */
        ditherBASIC_REDUCE: function (data, w, h) {
            return Dithering.dither(data, w, h, {
                palette:   Dithering.PALETTE.BASIC,
                algorithm: Dithering.ALGORITHM.REDUCE
            });
        },

        /**
         * @param data
         * @param w
         * @param h
         * @returns {*}
         */
        ditherBASIC_ORDERED: function (data, w, h) {
            return Dithering.dither(data, w, h, {
                palette:   Dithering.PALETTE.BASIC,
                algorithm: Dithering.ALGORITHM.ORDERED
            });
        },

        /**
         * @param data
         * @param w
         * @param h
         * @returns {*}
         */
        ditherBASIC_ERROR: function (data, w, h) {
            return Dithering.dither(data, w, h, {
                palette:   Dithering.PALETTE.BASIC,
                algorithm: Dithering.ALGORITHM.ERROR
            });
        },

        //// POST EFFECTS CALLBACKS ///////////////////////////////////////////

        /**
         * @param data
         * @param w
         * @param h
         * @returns {*}
         */
        cbMirrorX: function (data, w, h) {
            return this.flipX(data, w, h);
        },

        cbMirrorY: function (data, w, h) {
            return this.flipY(data, w, h);
        },

        cbMirrorXY: function (data, w, h) {
            return this.flipY(this.flipX(data, w, h), w, h);
        },

        //// POST EFFECTS /////////////////////////////////////////////////////

        applyPost: function (out, options, tilesW, tilesH) {
            if (Object.getOwnPropertyNames(options).length === 0) {
                return out;
            }

            _.each(Object.keys(options), function (key) {
                out = this["post" + this.ucfirst(key)](options, out, tilesW, tilesH);
            }, this);

            return out;
        },

        postMirror: function (options, out) {
            if (options.mirror
                && this.options.mirror.options[options.mirror].cb
                && this.options.mirror.options[options.mirror]) {
                out = this.options.mirror.options[options.mirror].cb.call(this, out, this.w, this.h);
            }

            return out;
        },

        postInvert: function (options, out) {
            if (parseInt(options.invert)) {
                out = this.invert(out);
            }

            return out;
        },

        postDither: function (options, out) {
            if (options.dither
                && this.options.dither.options[options.dither].cb
                && this.options.dither.options[options.dither]) {
                out = this.options.dither.options[options.dither].cb.call(this, out, this.w, this.h);
            }

            return out;
        },

        postThin: function (options, out) {
            if (parseInt(options.thin)) {
                out = this.convolute(out, this.w, this.h, [
                    1, 1, 1,
                    1, -7, 1,
                    1, 1, 1
                ]);
            }

            return out;
        },

        postZhangSuen: function (options, out) {
            if (parseInt(options.zhangSuen)) {
                out = this.zhangSuen(out, this.w, this.h);
            }

            return out;
        },

        postSobel: function (options, out) {
            if (parseInt(options.sobel)) {
                out = this.sobel(out, this.w);
            }

            return out;
        },

        postEmboss: function (options, out) {
            if (parseInt(options.emboss)) {
                var eFac = parseInt(options.emboss),
                    eMtx = [];

                switch (eFac) {
                    case 1:
                        eMtx = [
                            1, 1, -1,
                            1, 3, -1,
                            1, -1, -1
                        ];

                        break;
                    case 2:
                        eMtx = [
                            2, 0, 0,
                            0, -1, 0,
                            0, 0, -1
                        ];

                        break;
                }

                out = this.convolve3x3(out, this.w, eMtx);
            }
            return out;
        },

        postEdge: function (options, out) {
            if (parseInt(options.edge)) {
                var edFac = parseInt(options.edge),
                    edMtx = [];

                switch (edFac) {
                    case 1:
                        edMtx = [
                            1, 1, 1,
                            1, -7, 1,
                            1, 1, 1
                        ];

                        break;
                    case 2:
                        edMtx = [
                            -5, 0, 0,
                            0, 0, 0,
                            0, 0, 5
                        ];

                        break;
                }

                out = this.convolve3x3(out, this.w, edMtx);
            }
            return out;
        },

        postSharpen: function (options, out) {
            if (parseInt(options.sharpen)) {
                var sFac = parseInt(options.sharpen),
                    sMtx = [];

                if (sFac < 2) {
                    sFac += 4;
                    sMtx = [
                        0, -1, 0,
                        -1, sFac, -1,
                        0, -1, 0
                    ];
                } else {
                    sFac += 7;

                    sMtx = [
                        -1, -1, -1,
                        -1, sFac, -1,
                        -1, -1, -1
                    ];
                }

                out = this.convolute(out, this.w, this.h, sMtx);
            }
            return out;
        },

        postBlur: function (options, out) {
            if (parseInt(options.blur)) {
                var bFac = parseInt(options.blur) + 7;

                out = this.convolute(out, this.w, this.h, [
                    1 / bFac, 1 / bFac, 1 / bFac,
                    1 / bFac, 1 / bFac, 1 / bFac,
                    1 / bFac, 1 / bFac, 1 / bFac
                ]);
            }
            return out;
        },

        postThreshold: function (options, out) {
            if (parseInt(options.threshold)
                && this.options.threshold.cb) {
                out = this.options.threshold.cb.call(this, out, parseInt(options.threshold));
            }
            return out;
        },

        postBrightness: function (options, out) {
            if (parseInt(options.brightness)
                && this.options.brightness.cb) {
                out = this.options.brightness.cb.call(this, out, parseInt(options.brightness));
            }
            return out;
        },

        postColors: function (options, out) {
            if (options.colors
                && this.options.colors.options[options.colors].cb
                && this.options.colors.options[options.colors]) {
                out = this.options.colors.options[options.colors].cb.call(this, out);
            }

            return out;
        },

        postKaleidoscope: function (options, out, tilesW, tilesH) {
            if (options.kaleidoscope
                && this.options.kaleidoscope.options[options.kaleidoscope].cb
                && this.options.kaleidoscope.options[options.kaleidoscope]) {
                out = this.options.kaleidoscope.options[options.kaleidoscope].cb.call(
                    this, out,
                    Math.floor(tilesW / 2) * this.TILE_WIDTH,
                    Math.floor(tilesH / 2) * this.TILE_HEIGHT
                );
            }
            return out;
        }
    });
});