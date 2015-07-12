/* global define */

define("lib/Filter", [
    "underscore",
    "lib/Dithering",
    "lib/Buffer",
    "lib/Mixin"
], function (_, Dithering, Buffer) {
    "use strict";

    //noinspection JSValidateJSDoc
    return {
        //// EMBOSS ///////////////////////////////////////////////////////////

        /**
         * @param {Uint8ClampedArray} data
         * @param {number} w
         * @param {number} h
         * @param {number} bumpHeight
         * @param {number} angle
         * @param {number} elevation
         */
        emboss: function (data, w, h, bumpHeight, angle, elevation) {
            angle = angle || 135;
            elevation = elevation || 30;

            angle = angle / 180 * Math.PI;
            elevation = elevation / 180 * Math.PI;
            var width45 = 3 * bumpHeight;
            var pixelScale = 255.9;

            var bumpPixels = [];
            var bumpMapWidth = w;

            for (var i = 0; i < data.length; i += 4) {
                bumpPixels[i / 4] = (data[i] + data[i + 1] + data[i + 2]) / 3
            }

            var Nx, Ny, Nz, Lx, Ly, Lz, Nz2, NzLz, NdotL;
            var shade, background;

            Lx = Math.floor(Math.cos(angle) * Math.cos(elevation) * pixelScale);
            Ly = Math.floor(Math.sin(angle) * Math.cos(elevation) * pixelScale);
            Lz = Math.floor(Math.sin(elevation) * pixelScale);

            Nz = Math.floor(6 * 255 / width45);
            Nz2 = Nz * Nz;
            NzLz = Nz * Lz;
            background = Lz;

            var bumpIndex = 0;

            for (var y = 0; y < h; y++, bumpIndex += bumpMapWidth) {
                var s1 = bumpIndex,
                    s2 = s1 + bumpMapWidth,
                    s3 = s2 + bumpMapWidth;

                for (var x = 0; x < w; x++, s1++, s2++, s3++) {
                    var pixel = (y * w + x) * 4;

                    if (y != 0 && y < h - 2 && x != 0 && x < w - 2) {
                        Nx = bumpPixels[s1 - 1] + bumpPixels[s2 - 1] + bumpPixels[s3 - 1] - bumpPixels[s1 + 1] - bumpPixels[s2 + 1] - bumpPixels[s3 + 1];
                        Ny = bumpPixels[s3 - 1] + bumpPixels[s3] + bumpPixels[s3 + 1] - bumpPixels[s1 - 1] - bumpPixels[s1] - bumpPixels[s1 + 1];

                        if (Nx == 0 && Ny == 0) {
                            shade = background;
                        } else if ((NdotL = Nx * Lx + Ny * Ly + NzLz) < 0) {
                            shade = 0;
                        } else {
                            shade = Math.floor(
                                NdotL / Math.sqrt(Nx * Nx + Ny * Ny + Nz2)
                            );
                        }
                    } else {
                        shade = background;
                    }

                    data[pixel] = data[pixel + 1] = data[pixel + 2] = shade;
                }
            }

            return data;
        },

        //// SATURATION ///////////////////////////////////////////////////////

        /**
         * @param {Uint8ClampedArray} data
         * @param {number} w
         * @param {number} h
         * @param {number} amount
         * @returns {Uint8ClampedArray}
         */
        saturation: function (data, w, h, amount) {
            var RW = 0.3086,
                RG = 0.6084,
                RB = 0.0820;

            var a = (1 - amount) * RW + amount,
                b = (1 - amount) * RW,
                c = (1 - amount) * RW,
                d = (1 - amount) * RG,
                e = (1 - amount) * RG + amount,
                f = (1 - amount) * RG,
                g = (1 - amount) * RB,
                k = (1 - amount) * RB,
                i = (1 - amount) * RB + amount;

            for (var y = 0; y < h; y++) {
                for (var x = 0; x < w; x++) {
                    var pixel = (y * w + x) * 4;
                    data[pixel] = a * data[pixel] + d * data[pixel + 1] + g * data[pixel + 2];
                    data[pixel + 1] = b * data[pixel] + e * data[pixel + 1] + k * data[pixel + 2];
                    data[pixel + 2] = c * data[pixel] + f * data[pixel + 1] + i * data[pixel + 2];
                }
            }

            return data;
        },

        //// BLUR /////////////////////////////////////////////////////////////

        /**
         * @param {Uint8ClampedArray} data
         * @param {number} w
         * @param {number} h
         * @param {number} amount
         * @returns {Uint8ClampedArray}
         */
        blur: function (data, w, h, amount) {
            var width4 = w << 2, q;

            if (amount < 0.0) {
                amount = 0.0;
            }

            if (amount >= 2.5) {
                q = 0.98711 * amount - 0.96330;
            } else if (amount >= 0.5) {
                q = 3.97156 - 4.14554 * Math.sqrt(1.0 - 0.26891 * amount);
            } else {
                q = 2 * amount * (3.97156 - 4.14554 * Math.sqrt(1.0 - 0.26891 * 0.5));
            }

            var qq = q * q;
            var qqq = qq * q;
            var b0 = 1.57825 + (2.44413 * q) + (1.4281 * qq ) + (0.422205 * qqq);
            var b1 = ((2.44413 * q) + (2.85619 * qq) + (1.26661 * qqq)) / b0;
            var b2 = (-((1.4281 * qq) + (1.26661 * qqq))) / b0;
            var b3 = (0.422205 * qqq) / b0;
            var bigB = 1.0 - (b1 + b2 + b3);

            var index,
                indexLast,
                pixel,
                ppixel,
                pppixel,
                ppppixel,
                c;

            for (c = 0; c < 3; c++) {
                for (var y = 0; y < h; y++) {
                    index = y * width4 + c;
                    indexLast = y * width4 + ((w - 1) << 2) + c;
                    pixel = data[index];
                    ppixel = pixel;
                    pppixel = ppixel;
                    ppppixel = pppixel;

                    for (; index <= indexLast; index += 4) {
                        pixel = bigB * data[index] + b1 * ppixel + b2 * pppixel + b3 * ppppixel;
                        data[index] = pixel;
                        ppppixel = pppixel;
                        pppixel = ppixel;
                        ppixel = pixel;
                    }

                    index = y * width4 + ((w - 1) << 2) + c;
                    indexLast = y * width4 + c;
                    pixel = data[index];
                    ppixel = pixel;
                    pppixel = ppixel;
                    ppppixel = pppixel;

                    for (; index >= indexLast; index -= 4) {
                        pixel = bigB * data[index] + b1 * ppixel + b2 * pppixel + b3 * ppppixel;
                        data[index] = pixel;
                        ppppixel = pppixel;
                        pppixel = ppixel;
                        ppixel = pixel;
                    }
                }
            }

            for (c = 0; c < 3; c++) {
                for (var x = 0; x < w; x++) {
                    index = (x << 2) + c;
                    indexLast = (h - 1) * width4 + (x << 2) + c;
                    pixel = data[index];
                    ppixel = pixel;
                    pppixel = ppixel;
                    ppppixel = pppixel;

                    for (; index <= indexLast; index += width4) {
                        pixel = bigB * data[index] + b1 * ppixel + b2 * pppixel + b3 * ppppixel;
                        data[index] = pixel;
                        ppppixel = pppixel;
                        pppixel = ppixel;
                        ppixel = pixel;
                    }

                    index = (h - 1) * width4 + (x << 2) + c;
                    indexLast = (x << 2) + c;
                    pixel = data[index];
                    ppixel = pixel;
                    pppixel = ppixel;
                    ppppixel = pppixel;

                    for (; index >= indexLast; index -= width4) {
                        pixel = bigB * data[index] + b1 * ppixel + b2 * pppixel + b3 * ppppixel;
                        data[index] = pixel;
                        ppppixel = pppixel;
                        pppixel = ppixel;
                        ppixel = pixel;
                    }
                }
            }

            return data;
        },

        //// HUE //////////////////////////////////////////////////////////////

        /**
         * @param {Uint8ClampedArray} data
         * @param {number} w
         * @param {number} h
         * @param {number} amount -1.0 ... 1.0
         */
        hue: function (data, w, h, amount) {
            for (var y = 0; y < h; y++) {
                for (var x = 0; x < w; x++) {
                    var pixel = (y * w + x) * 4;

                    var hsv = Buffer.rgbToHsv(
                        data[pixel], data[pixel + 1], data[pixel + 2]
                    );

                    hsv[0] += amount;

                    while (hsv[0] < 0) {
                        hsv[0] += 360;
                    }

                    var rgb = Buffer.hsvToRgb(hsv[0], hsv[1], hsv[2]);

                    for (var i = 0; i < 3; i++) {
                        data[pixel + i] = rgb[i];
                    }
                }
            }

            return data;
        },

        //// CONTRAST /////////////////////////////////////////////////////////

        /**
         * @param {Uint8ClampedArray} data
         * @param {number} contrast
         * @returns {Uint8ClampedArray}
         */
        contrast: function (data, contrast) {
            var factor = (259 * (contrast + 255)) / (255 * (259 - contrast));

            for (var i = 0; i < data.length; i += 4) {
                data[i] = factor * (data[i] - 128) + 128;
                data[i + 1] = factor * (data[i + 1] - 128) + 128;
                data[i + 2] = factor * (data[i + 2] - 128) + 128;
            }

            return data;
        },

        //// ZHANG SUEN ///////////////////////////////////////////////////////

        /**
         * @param {Uint8ClampedArray} data
         * @param {number} w
         * @param {number} h
         * @returns {Uint8ClampedArray}
         */
        zhangSuen: function (data, w, h) {
            function Image2Bool(img, width, height) {
                var s = [];

                for (var y = 0; y < height; y++) {
                    var sx = [];

                    for (var x = 0; x < width; x++) {
                        var p = Buffer.getPixelXY(img, x, y, w);

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
                //noinspection JSUnresolvedFunction
                var bmp = new Uint8ClampedArray(width * height * 4);

                for (var y = 0; y < height; y++) {
                    for (var x = 0; x < width; x++) {
                        if (s[y][x]) {
                            Buffer.setPixelXY(bmp, x, y, Buffer.COLORS.BLACK, w);
                        } else {
                            Buffer.setPixelXY(bmp, x, y, Buffer.COLORS.WHITE, w);
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

        //// KALEIDOSKOPE /////////////////////////////////////////////////////

        /**
         * @param {Uint8ClampedArray} data
         * @param {number} srcW
         * @param {number} srcH
         * @returns {Uint8ClampedArray}
         */
        kaleidoskopeCenter: function (data, srcW, srcH) {
            data = Buffer.grab(data, srcW, srcH, 0, 0, srcW, srcH);

            var w = Math.floor(srcW / 2),
                h = Math.floor(srcH / 2);

            var block = Buffer.grab(data, srcW, srcH, 0, 0, w, h);

            data = Buffer.draw(block, w, h, data, 0, 0, srcW, srcH);

            block = this.flipX(block, w, h);
            data = Buffer.draw(block, w, h, data, w, 0, srcW, srcH);

            block = this.flipY(block, w, h);
            data = Buffer.draw(block, w, h, data, w, h, srcW, srcH);

            block = this.flipX(block, w, h);
            data = Buffer.draw(block, w, h, data, 0, h, srcW, srcH);

            return data;
        },

        /**
         * @param {Uint8ClampedArray} data
         * @param {number} srcW
         * @param {number} srcH
         * @returns {Uint8ClampedArray}
         */
        kaleidoskopeCenterOutside: function (data, srcW, srcH) {
            data = Buffer.grab(data, srcW, srcH, 0, 0, srcW, srcH);

            var w = Math.floor(srcW / 2),
                h = Math.floor(srcH / 2);

            var block = Buffer.grab(data, srcW, srcH, 0, 0, w, h);

            data = Buffer.draw(block, w, h, data, 0, 0, srcW, srcH);

            block = this.flipY(block, w, h);
            data = Buffer.draw(block, w, h, data, w, 0, srcW, srcH);

            block = this.flipX(block, w, h);
            data = Buffer.draw(block, w, h, data, w, h, srcW, srcH);

            block = this.flipY(block, w, h);
            data = Buffer.draw(block, w, h, data, 0, h, srcW, srcH);

            return data;
        },

        /**
         * @param {Uint8ClampedArray} data
         * @param {number} srcW
         * @param {number} srcH
         * @returns {Uint8ClampedArray}
         */
        kaleidoskopeOutside: function (data, srcW, srcH) {
            data = Buffer.grab(data, srcW, srcH, 0, 0, srcW, srcH);

            var w = Math.floor(srcW / 2),
                h = Math.floor(srcH / 2);

            var block = Buffer.grab(data, srcW, srcH, 0, 0, w, h);

            block = this.flipX(block, w, h);
            data = Buffer.draw(block, w, h, data, 0, 0, srcW, srcH);

            block = this.flipX(block, w, h);
            data = Buffer.draw(block, w, h, data, w, 0, srcW, srcH);

            block = this.flipY(block, w, h);
            data = Buffer.draw(block, w, h, data, w, h, srcW, srcH);

            block = this.flipX(block, w, h);
            data = Buffer.draw(block, w, h, data, 0, h, srcW, srcH);

            return data;
        },

        /**
         * @param {Uint8ClampedArray} data
         * @param {number} srcW
         * @param {number} srcH
         * @returns {Uint8ClampedArray}
         */
        kaleidoskopeVert: function (data, srcW, srcH) {
            data = Buffer.grab(data, srcW, srcH, 0, 0, srcW, srcH);

            var h = Math.floor(srcH / 2);

            var block = Buffer.grab(data, srcW, srcH, 0, 0, srcW, h);
            data = Buffer.draw(block, srcW, h, data, 0, 0, srcW, srcH);

            block = this.flipY(block, srcW, h);
            data = Buffer.draw(block, srcW, h, data, 0, h, srcW, srcH);

            return data;
        },

        /**
         * @param {Uint8ClampedArray} data
         * @param {number} srcW
         * @param {number} srcH
         * @returns {Uint8ClampedArray}
         */
        kaleidoskopeCard: function (data, srcW, srcH) {
            data = Buffer.grab(data, srcW, srcH, 0, 0, srcW, srcH);

            var h = Math.floor(srcH / 2);

            var block = Buffer.grab(data, srcW, srcH, 0, 0, srcW, h);
            data = Buffer.draw(block, srcW, h, data, 0, 0, srcW, srcH);

            block = this.flipY(block, srcW, h);
            block = this.flipX(block, srcW, h);
            data = Buffer.draw(block, srcW, h, data, 0, h, srcW, srcH);

            return data;
        },

        /**
         * @param {Uint8ClampedArray} data
         * @param {number} srcW
         * @param {number} srcH
         * @returns {Uint8ClampedArray}
         */
        kaleidoskopeHoriz: function (data, srcW, srcH) {
            data = Buffer.grab(data, srcW, srcH, 0, 0, srcW, srcH);

            var w = Math.floor(srcW / 2);

            var block = Buffer.grab(data, srcW, srcH, 0, 0, w, srcH);
            data = Buffer.draw(block, w, srcH, data, 0, 0, srcW, srcH);

            block = this.flipX(block, w, srcH);
            data = Buffer.draw(block, w, srcH, data, w, 0, srcW, srcH);

            return data;
        },

        //// SOBEL ///////////////////////////////////////////////////////////

        /**
         * @param {Uint8ClampedArray} data
         * @param {number} w
         * @returns {Uint8ClampedArray}
         */
        sobel: function (data, w) {
            var grayscale = this.grayscale(data);

            var vertical = this.convolve3x3(grayscale, w, [
                -1, 0, 1,
                -2, 0, 2,
                -1, 0, 1
            ]);

            var horizontal = this.convolve3x3(grayscale, w, [
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

        //// CONVOLUTION /////////////////////////////////////////////////////

        /**
         * @param {Uint8ClampedArray} data
         * @param {number} w
         * @param {number} h
         * @param {Array} weights
         * @param {boolean} opaque
         * @returns {Uint8ClampedArray}
         */
        convolute: function (data, w, h, weights, opaque) {
            opaque = opaque || false;

            var side = Math.round(Math.sqrt(weights.length)),
                halfSide = Math.floor(side / 2);

            // pad output by the convolution matrix
            //noinspection JSUnresolvedFunction
            var dst = new Uint8ClampedArray(data.length);

            // go through the destination image pixels
            var alphaFac = +opaque;

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
         * @param {Uint8ClampedArray} data
         * @param {number} w
         * @param {Array} m Kernel
         * @param {number} [divisor]
         * @param {number} [offset]
         * @returns {Uint8ClampedArray}
         */
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

        //// INVERSE /////////////////////////////////////////////////////////

        /**
         * @param {Uint8ClampedArray} data
         * @returns {Uint8ClampedArray}
         */
        invert: function (data) {
            for (var i = 0; i < data.length; i += 4) {
                data[i] = 255 - data[i];            // red
                data[i + 1] = 255 - data[i + 1];    // green
                data[i + 2] = 255 - data[i + 2];    // blue
            }

            return data;
        },

        //// MIRROR //////////////////////////////////////////////////////////

        /**
         * @param {Uint8ClampedArray} data
         * @param {number} w
         * @param {number} h
         * @returns {Uint8ClampedArray}
         */
        flipX: function (data, w, h) {
            var tempData = _.deepClone(data),
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

        /**
         * @param {Uint8ClampedArray} data
         * @param {number} w
         * @param {number} h
         * @returns {Uint8ClampedArray}
         */
        flipY: function (data, w, h) {
            var tempData = _.deepClone(data),
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

        /**
         * @param {Uint8ClampedArray} data
         * @param {number} w
         * @param {number} h
         * @returns {Uint8ClampedArray}
         */
        flipXY: function (data, w, h) {
            return this.flipY(
                this.flipX(data, w, h), w, h
            );
        },

        //// THRESHOLD ///////////////////////////////////////////////////////

        /**
         * @param {Uint8ClampedArray} data
         * @param {number} threshold
         * @returns {Uint8ClampedArray}
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

        //// BRIGHTNESS ///////////////////////////////////////////////////////

        /**
         * @param {Uint8ClampedArray} data
         * @param w
         * @param h
         * @param {number} amount
         * @returns {Uint8ClampedArray}
         */
        brightness: function (data, w, h, amount) {
            for (var y = 0; y < h; y++) {
                for (var x = 0; x < w; x++) {
                    var pixel = (y * w + x) * 4;

                    var hsv = Buffer.rgbToHsv(
                        data[pixel], data[pixel + 1], data[pixel + 2]
                    );

                    hsv[2] += amount;

                    if (hsv[2] < 0) {
                        hsv[2] = 0;
                    } else if (hsv[2] > 1) {
                        hsv[2] = 1;
                    }

                    var rgb = Buffer.hsvToRgb(hsv[0], hsv[1], hsv[2]);

                    for (var i = 0; i < 3; i++) {
                        data[pixel + i] = rgb[i];
                    }
                }
            }

            return data;
        },

        //// COLOR ////////////////////////////////////////////////////////////

        /**
         * @param {Uint8ClampedArray} data
         * @returns {Uint8ClampedArray}
         */
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
         * @param {Uint8ClampedArray} data
         * @returns {Uint8ClampedArray}
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

        /**
         * @param {Uint8ClampedArray} data
         * @returns {Uint8ClampedArray}
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
         * @param {Uint8ClampedArray} data
         * @returns {Uint8ClampedArray}
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
         * @param {Uint8ClampedArray} data
         * @returns {Uint8ClampedArray}
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
         * @param {Uint8ClampedArray} data
         * @returns {Uint8ClampedArray}
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

        //// DITHERING ////////////////////////////////////////////////////////

        /**
         * @param {Uint8ClampedArray} data
         * @param {number} w
         * @param {number} h
         * @returns {Uint8ClampedArray}
         */
        ditherC64_REDUCE: function (data, w, h) {
            return Dithering.dither(data, w, h, {
                palette:   Dithering.PALETTE.C64,
                algorithm: Dithering.ALGORITHM.REDUCE
            });
        },

        /**
         * @param {Uint8ClampedArray} data
         * @param {number} w
         * @param {number} h
         * @returns {Uint8ClampedArray}
         */
        ditherC64_ORDERED: function (data, w, h) {
            return Dithering.dither(data, w, h, {
                palette:   Dithering.PALETTE.C64,
                algorithm: Dithering.ALGORITHM.ORDERED
            });
        },

        /**
         * @param {Uint8ClampedArray} data
         * @param {number} w
         * @param {number} h
         * @returns {Uint8ClampedArray}
         */
        ditherC64_ERROR: function (data, w, h) {
            return Dithering.dither(data, w, h, {
                palette:   Dithering.PALETTE.C64,
                algorithm: Dithering.ALGORITHM.ERROR
            });
        },

        /**
         * @param {Uint8ClampedArray} data
         * @param {number} w
         * @param {number} h
         * @returns {Uint8ClampedArray}
         */
        ditherC64_ATKINSON: function (data, w, h) {
            return Dithering.dither(data, w, h, {
                palette:   Dithering.PALETTE.C64,
                algorithm: Dithering.ALGORITHM.ATKINSON
            });
        },

        /**
         * @param {Uint8ClampedArray} data
         * @param {number} w
         * @param {number} h
         * @returns {Uint8ClampedArray}
         */
        ditherSPECTRUM_ATKINSON: function (data, w, h) {
            return Dithering.dither(data, w, h, {
                palette:   Dithering.PALETTE.SPECTRUM,
                algorithm: Dithering.ALGORITHM.ATKINSON
            });
        },

        /**
         * @param {Uint8ClampedArray} data
         * @param {number} w
         * @param {number} h
         * @returns {Uint8ClampedArray}
         */
        ditherSPECTRUM_REDUCE: function (data, w, h) {
            return Dithering.dither(data, w, h, {
                palette:   Dithering.PALETTE.SPECTRUM,
                algorithm: Dithering.ALGORITHM.REDUCE
            });
        },

        /**
         * @param {Uint8ClampedArray} data
         * @param {number} w
         * @param {number} h
         * @returns {Uint8ClampedArray}
         */
        ditherSPECTRUM_ORDERED: function (data, w, h) {
            return Dithering.dither(data, w, h, {
                palette:   Dithering.PALETTE.SPECTRUM,
                algorithm: Dithering.ALGORITHM.ORDERED
            });
        },

        /**
         * @param {Uint8ClampedArray} data
         * @param {number} w
         * @param {number} h
         * @returns {Uint8ClampedArray}
         */
        ditherSPECTRUM_ERROR: function (data, w, h) {
            return Dithering.dither(data, w, h, {
                palette:   Dithering.PALETTE.SPECTRUM,
                algorithm: Dithering.ALGORITHM.ERROR
            });
        },

        /**
         * @param {Uint8ClampedArray} data
         * @param {number} w
         * @param {number} h
         * @returns {Uint8ClampedArray}
         */
        ditherAMIGA_BRONZE_ATKINSON: function (data, w, h) {
            return Dithering.dither(data, w, h, {
                palette:   Dithering.PALETTE.AMIGA_BRONZE,
                algorithm: Dithering.ALGORITHM.ATKINSON
            });
        },

        /**
         * @param {Uint8ClampedArray} data
         * @param {number} w
         * @param {number} h
         * @returns {Uint8ClampedArray}
         */
        ditherAMIGA_BRONZE_REDUCE: function (data, w, h) {
            return Dithering.dither(data, w, h, {
                palette:   Dithering.PALETTE.AMIGA_BRONZE,
                algorithm: Dithering.ALGORITHM.REDUCE
            });
        },

        /**
         * @param {Uint8ClampedArray} data
         * @param {number} w
         * @param {number} h
         * @returns {Uint8ClampedArray}
         */
        ditherAMIGA_BRONZE_ORDERED: function (data, w, h) {
            return Dithering.dither(data, w, h, {
                palette:   Dithering.PALETTE.AMIGA_BRONZE,
                algorithm: Dithering.ALGORITHM.ORDERED
            });
        },

        /**
         * @param {Uint8ClampedArray} data
         * @param {number} w
         * @param {number} h
         * @returns {Uint8ClampedArray}
         */
        ditherAMIGA_BRONZE_ERROR: function (data, w, h) {
            return Dithering.dither(data, w, h, {
                palette:   Dithering.PALETTE.AMIGA_BRONZE,
                algorithm: Dithering.ALGORITHM.ERROR
            });
        },

        /**
         * @param {Uint8ClampedArray} data
         * @param {number} w
         * @param {number} h
         * @returns {Uint8ClampedArray}
         */
        ditherMONO_ATKINSON: function (data, w, h) {
            return Dithering.dither(data, w, h, {
                palette:   Dithering.PALETTE.MONO,
                algorithm: Dithering.ALGORITHM.ATKINSON
            });
        },

        /**
         * @param {Uint8ClampedArray} data
         * @param {number} w
         * @param {number} h
         * @returns {Uint8ClampedArray}
         */
        ditherMONO_REDUCE: function (data, w, h) {
            return Dithering.dither(data, w, h, {
                palette:   Dithering.PALETTE.MONO,
                algorithm: Dithering.ALGORITHM.REDUCE
            });
        },

        /**
         * @param {Uint8ClampedArray} data
         * @param {number} w
         * @param {number} h
         * @returns {Uint8ClampedArray}
         */
        ditherMONO_ORDERED: function (data, w, h) {
            return Dithering.dither(data, w, h, {
                palette:   Dithering.PALETTE.MONO,
                algorithm: Dithering.ALGORITHM.ORDERED
            });
        },

        /**
         * @param {Uint8ClampedArray} data
         * @param {number} w
         * @param {number} h
         * @returns {Uint8ClampedArray}
         */
        ditherMONO_ERROR: function (data, w, h) {
            return Dithering.dither(data, w, h, {
                palette:   Dithering.PALETTE.MONO,
                algorithm: Dithering.ALGORITHM.ERROR
            });
        },

        /**
         * @param {Uint8ClampedArray} data
         * @param {number} w
         * @param {number} h
         * @returns {Uint8ClampedArray}
         */
        ditherAMIGA_ORANGE_ATKINSON: function (data, w, h) {
            return Dithering.dither(data, w, h, {
                palette:   Dithering.PALETTE.AMIGA_ORANGE,
                algorithm: Dithering.ALGORITHM.ATKINSON
            });
        },

        /**
         * @param {Uint8ClampedArray} data
         * @param {number} w
         * @param {number} h
         * @returns {Uint8ClampedArray}
         */
        ditherAMIGA_ORANGE_REDUCE: function (data, w, h) {
            return Dithering.dither(data, w, h, {
                palette:   Dithering.PALETTE.AMIGA_ORANGE,
                algorithm: Dithering.ALGORITHM.REDUCE
            });
        },

        /**
         * @param {Uint8ClampedArray} data
         * @param {number} w
         * @param {number} h
         * @returns {Uint8ClampedArray}
         */
        ditherAMIGA_ORANGE_ORDERED: function (data, w, h) {
            return Dithering.dither(data, w, h, {
                palette:   Dithering.PALETTE.AMIGA_ORANGE,
                algorithm: Dithering.ALGORITHM.ORDERED
            });
        },

        /**
         * @param {Uint8ClampedArray} data
         * @param {number} w
         * @param {number} h
         * @returns {Uint8ClampedArray}
         */
        ditherAMIGA_ORANGE_ERROR: function (data, w, h) {
            return Dithering.dither(data, w, h, {
                palette:   Dithering.PALETTE.AMIGA_ORANGE,
                algorithm: Dithering.ALGORITHM.ERROR
            });
        },

        /**
         * @param {Uint8ClampedArray} data
         * @param {number} w
         * @param {number} h
         * @returns {Uint8ClampedArray}
         */
        ditherBASIC_ATKINSON: function (data, w, h) {
            return Dithering.dither(data, w, h, {
                palette:   Dithering.PALETTE.BASIC,
                algorithm: Dithering.ALGORITHM.ATKINSON
            });
        },

        /**
         * @param {Uint8ClampedArray} data
         * @param {number} w
         * @param {number} h
         * @returns {Uint8ClampedArray}
         */
        ditherBASIC_REDUCE: function (data, w, h) {
            return Dithering.dither(data, w, h, {
                palette:   Dithering.PALETTE.BASIC,
                algorithm: Dithering.ALGORITHM.REDUCE
            });
        },

        /**
         * @param {Uint8ClampedArray} data
         * @param {number} w
         * @param {number} h
         * @returns {Uint8ClampedArray}
         */
        ditherBASIC_ORDERED: function (data, w, h) {
            return Dithering.dither(data, w, h, {
                palette:   Dithering.PALETTE.BASIC,
                algorithm: Dithering.ALGORITHM.ORDERED
            });
        },

        /**
         * @param {Uint8ClampedArray} data
         * @param {number} w
         * @param {number} h
         * @returns {Uint8ClampedArray}
         */
        ditherBASIC_ERROR: function (data, w, h) {
            return Dithering.dither(data, w, h, {
                palette:   Dithering.PALETTE.BASIC,
                algorithm: Dithering.ALGORITHM.ERROR
            });
        }
    };
});