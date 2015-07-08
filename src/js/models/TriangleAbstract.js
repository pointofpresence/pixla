/**
 * @module models/TriangleAbstract
 */
define("models/TriangleAbstract", [
    "backbone",
    "underscore",
    "lib/Canvas",
    "lib/Dithering",
    "lib/Filter",
    "lib/Mixin"
], function (Backbone, _, Canvas, Dithering, Filter) {
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
                        {text: "По оси X", cb: Filter.flipX},
                        {text: "По оси Y", cb: Filter.flipY},
                        {text: "По оси X и Y", cb: Filter.flipXY}
                    ]
                },
                kaleidoscope: {
                    name:    "Калейдоскоп",
                    type:    "Select",
                    options: [
                        {text: "Нет"},
                        {text: "К центру", cb: this.kaleidoskopeCenter},
                        {text: "В стороны", cb: this.kaleidoskopeOutside},
                        {text: "К центру и в стороны", cb: this.kaleidoskopeCenterOutside},
                        {text: "По горизонтали", cb: this.kaleidoskopeHoriz},
                        {text: "По вертикали", cb: this.kaleidoskopeVert},
                        {text: "Игральная карта", cb: this.kaleidoskopeCard}
                    ]
                },
                colors:       {
                    name:    "Цвет",
                    type:    "Select",
                    options: [
                        {text: "Нет"},
                        {text: "Монохром", cb: Filter.monochrome},
                        {text: "Градации серого", cb: Filter.grayscale},
                        {text: "Сепия", cb: Filter.sepia},
                        {text: "Красный", cb: Filter.red},
                        {text: "Зеленый", cb: Filter.green},
                        {text: "Синий", cb: Filter.blue}
                    ]
                },
                brightness:   {
                    name: "Яркость",
                    type: "Slider",
                    min:  0,
                    max:  200,
                    cb:   Filter.brightness
                },
                threshold:    {
                    name: "Порог",
                    type: "Slider",
                    min:  0,
                    max:  200,
                    cb:   Filter.threshold
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

        COLORS: {
            BLACK: [0, 0, 0, 255],
            WHITE: [255, 255, 255, 255]
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
            if (x >= this.w) {
                return;
            }

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
                    temp = _.deepClone(s);
                    count = step(1, temp, s);

                    temp = _.deepClone(s);
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

        rotate: function (data, w, h) {
            var tempData = _.deepClone(data),
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
            var grayscale = Filter.grayscale(data);

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

        kaleidoskopeCenter: function (data, w, h) {
            data = this.grab(data, 0, 0, w * 2, h * 2);
            this.w = w * 2;
            this.h = h * 2;

            var block = this.grab(data, 0, 0, w, h);

            data = this.draw(block, data, 0, 0, w, h);

            block = Filter.flipX(block, w, h);
            data = this.draw(block, data, w, 0, w, h);

            block = Filter.flipY(block, w, h);
            data = this.draw(block, data, w, h, w, h);

            block = Filter.flipX(block, w, h);
            data = this.draw(block, data, 0, h, w, h);

            return data;
        },

        kaleidoskopeCenterOutside: function (data, w, h) {
            data = this.grab(data, 0, 0, w * 2, h * 2);
            this.w = w * 2;
            this.h = h * 2;

            var block = this.grab(data, 0, 0, w, h);

            data = this.draw(block, data, 0, 0, w, h);

            block = Filter.flipY(block, w, h);
            data = this.draw(block, data, w, 0, w, h);

            block = Filter.flipX(block, w, h);
            data = this.draw(block, data, w, h, w, h);

            block = Filter.flipY(block, w, h);
            data = this.draw(block, data, 0, h, w, h);

            return data;
        },

        kaleidoskopeOutside: function (data, w, h) {
            data = this.grab(data, 0, 0, w * 2, h * 2);
            this.w = w * 2;
            this.h = h * 2;

            var block = this.grab(data, 0, 0, w, h);

            block = Filter.flipX(block, w, h);
            data = this.draw(block, data, 0, 0, w, h);

            block = Filter.flipX(block, w, h);
            data = this.draw(block, data, w, 0, w, h);

            block = Filter.flipY(block, w, h);
            data = this.draw(block, data, w, h, w, h);

            block = Filter.flipX(block, w, h);
            data = this.draw(block, data, 0, h, w, h);

            return data;
        },

        kaleidoskopeVert: function (data, w, h) {
            data = this.grab(data, 0, 0, w * 2, h * 2);
            this.w = w * 2;
            this.h = h * 2;

            var block = this.grab(data, 0, 0, this.w, h);
            data = this.draw(block, data, 0, 0, this.w, h);

            block = Filter.flipY(block, this.w, h);
            data = this.draw(block, data, 0, h, this.w, h);

            return data;
        },

        kaleidoskopeCard: function (data, w, h) {
            data = this.grab(data, 0, 0, w * 2, h * 2);
            this.w = w * 2;
            this.h = h * 2;

            var block = this.grab(data, 0, 0, this.w, h);
            data = this.draw(block, data, 0, 0, this.w, h);

            block = Filter.flipY(block, this.w, h);
            block = Filter.flipX(block, this.w, h);
            data = this.draw(block, data, 0, h, this.w, h);

            return data;
        },

        /**
         * @param data
         * @param w
         * @param h
         * @returns {*}
         */
        kaleidoskopeHoriz: function (data, w, h) {
            data = this.grab(data, 0, 0, w * 2, h * 2);
            this.w = w * 2;
            this.h = h * 2;

            var block = this.grab(data, 0, 0, w, this.h);
            data = this.draw(block, data, 0, 0, w, this.h);

            block = Filter.flipX(block, w, this.h);
            data = this.draw(block, data, w, 0, w, this.h);

            return data;
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
                            text: _.format("{0} ({1})", nameP, nameA),
                            cb:   Filter[_.format("dither{0}_{1}", keyP, keyA)]
                        }
                    );
                }, this);
            }, this);

            return options;
        },

        //// POST EFFECTS /////////////////////////////////////////////////////

        applyPost: function (out, options, tilesW, tilesH) {
            if (Object.getOwnPropertyNames(options).length === 0) {
                return out;
            }

            _.each(Object.keys(options), function (key) {
                out = this["post" + _.capitalize(key)](options, out, tilesW, tilesH);
            }, this);

            return out;
        },

        postMirror: function (options, out) {
            if (options.mirror
                && this.options.mirror.options[options.mirror].cb
                && this.options.mirror.options[options.mirror]) {
                out = this.options.mirror.options[options.mirror]
                    .cb.call(Filter, out, this.w, this.h);
            }

            return out;
        },

        postInvert: function (options, out) {
            if (parseInt(options.invert)) {
                out = Filter.invert(out);
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