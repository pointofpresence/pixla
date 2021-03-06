import _         from 'lodash';
import Buffer    from '../lib/Buffer';
import Mixin     from './Mixin';
import Dithering from './Dithering';

export default class Filter {
    //// BORDER ///////////////////////////////////////////////////////////

    /**
     * @param {Uint8ClampedArray} data
     * @param {number} w
     * @param {number} h
     * @param {number} size
     */
    static border(data, w, h, size) {
        let x, y;

        for (y = 0; y < h; y++) {
            if (y < size || (y >= h - size)) {
                for (x = 0; x < w; x++) {
                    Buffer.setPixelXY(data, x, y, Buffer.COLORS.BLACK, w);
                }
            } else {
                for (x = 0; x < size; x++) {
                    Buffer.setPixelXY(data, x, y, Buffer.COLORS.BLACK, w);
                }

                for (x = w - size; x < w; x++) {
                    Buffer.setPixelXY(data, x, y, Buffer.COLORS.BLACK, w);
                }
            }
        }

        return data;
    }

    //// EMBOSS ///////////////////////////////////////////////////////////

    /**
     * @param {Uint8ClampedArray} data
     * @param {number} w
     * @param {number} h
     * @param {number} bumpHeight
     * @param {number} angle
     * @param {number} elevation
     */
    static emboss(data, w, h, bumpHeight, angle, elevation) {
        angle     = angle || 135;
        elevation = elevation || 30;
        angle     = angle / 180 * Math.PI;
        elevation = elevation / 180 * Math.PI;

        let width45      = 3 * bumpHeight,
            pixelScale   = 255.9,
            bumpPixels   = [],
            bumpMapWidth = w;

        for (let i = 0; i < data.length; i += 4) {
            bumpPixels[i / 4] = (data[i] + data[i + 1] + data[i + 2]) / 3
        }

        let Nx, Ny, Nz, Lx, Ly, Lz, Nz2, NzLz, NdotL,
            shade, background;

        Lx = Math.floor(Math.cos(angle) * Math.cos(elevation) * pixelScale);
        Ly = Math.floor(Math.sin(angle) * Math.cos(elevation) * pixelScale);
        Lz = Math.floor(Math.sin(elevation) * pixelScale);

        Nz         = Math.floor(6 * 255 / width45);
        Nz2        = Nz * Nz;
        NzLz       = Nz * Lz;
        background = Lz;

        let bumpIndex = 0;

        for (let y = 0; y < h; y++, bumpIndex += bumpMapWidth) {
            let s1 = bumpIndex,
                s2 = s1 + bumpMapWidth,
                s3 = s2 + bumpMapWidth;

            for (let x = 0; x < w; x++, s1++, s2++, s3++) {
                let pixel = (y * w + x) * 4;

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
    }

    //// SATURATION ///////////////////////////////////////////////////////

    /**
     * @param {Uint8ClampedArray} data
     * @param {number} w
     * @param {number} h
     * @param {number} amount
     * @returns {Uint8ClampedArray}
     */
    static saturation(data, w, h, amount) {
        let RW = 0.3086,
            RG = 0.6084,
            RB = 0.0820;

        let a = (1 - amount) * RW + amount,
            b = (1 - amount) * RW,
            c = (1 - amount) * RW,
            d = (1 - amount) * RG,
            e = (1 - amount) * RG + amount,
            f = (1 - amount) * RG,
            g = (1 - amount) * RB,
            k = (1 - amount) * RB,
            i = (1 - amount) * RB + amount;

        for (let y = 0; y < h; y++) {
            for (let x = 0; x < w; x++) {
                let pixel       = (y * w + x) * 4;

                data[pixel]     = a * data[pixel] + d * data[pixel + 1] + g * data[pixel + 2];
                data[pixel + 1] = b * data[pixel] + e * data[pixel + 1] + k * data[pixel + 2];
                data[pixel + 2] = c * data[pixel] + f * data[pixel + 1] + i * data[pixel + 2];
            }
        }

        return data;
    }

    //// BLUR /////////////////////////////////////////////////////////////

    /**
     * @param {Uint8ClampedArray} data
     * @param {number} w
     * @param {number} h
     * @param {number} amount
     * @returns {Uint8ClampedArray}
     */
    static blur(data, w, h, amount) {
        let width4 = w << 2, q;

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

        let qq   = q * q,
            qqq  = qq * q,
            b0   = 1.57825 + (2.44413 * q) + (1.4281 * qq ) + (0.422205 * qqq),
            b1   = ((2.44413 * q) + (2.85619 * qq) + (1.26661 * qqq)) / b0,
            b2   = (-((1.4281 * qq) + (1.26661 * qqq))) / b0,
            b3   = (0.422205 * qqq) / b0,
            bigB = 1.0 - (b1 + b2 + b3);

        let index,
            indexLast,
            pixel,
            ppixel,
            pppixel,
            ppppixel,
            c;

        for (c = 0; c < 3; c++) {
            for (let y = 0; y < h; y++) {
                index     = y * width4 + c;
                indexLast = y * width4 + ((w - 1) << 2) + c;
                pixel     = data[index];
                ppixel    = pixel;
                pppixel   = ppixel;
                ppppixel  = pppixel;

                for (; index <= indexLast; index += 4) {
                    pixel       = bigB * data[index] + b1 * ppixel + b2 * pppixel + b3 * ppppixel;
                    data[index] = pixel;
                    ppppixel    = pppixel;
                    pppixel     = ppixel;
                    ppixel      = pixel;
                }

                index     = y * width4 + ((w - 1) << 2) + c;
                indexLast = y * width4 + c;
                pixel     = data[index];
                ppixel    = pixel;
                pppixel   = ppixel;
                ppppixel  = pppixel;

                for (; index >= indexLast; index -= 4) {
                    pixel       = bigB * data[index] + b1 * ppixel + b2 * pppixel + b3 * ppppixel;
                    data[index] = pixel;
                    ppppixel    = pppixel;
                    pppixel     = ppixel;
                    ppixel      = pixel;
                }
            }
        }

        for (c = 0; c < 3; c++) {
            for (let x = 0; x < w; x++) {
                index     = (x << 2) + c;
                indexLast = (h - 1) * width4 + (x << 2) + c;
                pixel     = data[index];
                ppixel    = pixel;
                pppixel   = ppixel;
                ppppixel  = pppixel;

                for (; index <= indexLast; index += width4) {
                    pixel       = bigB * data[index] + b1 * ppixel + b2 * pppixel + b3 * ppppixel;
                    data[index] = pixel;
                    ppppixel    = pppixel;
                    pppixel     = ppixel;
                    ppixel      = pixel;
                }

                index     = (h - 1) * width4 + (x << 2) + c;
                indexLast = (x << 2) + c;
                pixel     = data[index];
                ppixel    = pixel;
                pppixel   = ppixel;
                ppppixel  = pppixel;

                for (; index >= indexLast; index -= width4) {
                    pixel       = bigB * data[index] + b1 * ppixel + b2 * pppixel + b3 * ppppixel;
                    data[index] = pixel;
                    ppppixel    = pppixel;
                    pppixel     = ppixel;
                    ppixel      = pixel;
                }
            }
        }

        return data;
    }

    //// HUE //////////////////////////////////////////////////////////////

    /**
     * @param {Uint8ClampedArray} data
     * @param {number} w
     * @param {number} h
     * @param {number} amount -1.0 ... 1.0
     */
    static hue(data, w, h, amount) {
        for (let y = 0; y < h; y++) {
            for (let x = 0; x < w; x++) {
                let pixel = (y * w + x) * 4;

                let hsv = Buffer.rgbToHsv(
                    data[pixel], data[pixel + 1], data[pixel + 2]
                );

                hsv[0] += amount;

                while (hsv[0] < 0) {
                    hsv[0] += 360;
                }

                let rgb = Buffer.hsvToRgb(hsv[0], hsv[1], hsv[2]);

                for (let i = 0; i < 3; i++) {
                    data[pixel + i] = rgb[i];
                }
            }
        }

        return data;
    }

    //// CONTRAST /////////////////////////////////////////////////////////

    /**
     * @param {Uint8ClampedArray} data
     * @param {number} contrast
     * @returns {Uint8ClampedArray}
     */
    static contrast(data, contrast) {
        let factor = (259 * (contrast + 255)) / (255 * (259 - contrast));

        for (let i = 0; i < data.length; i += 4) {
            data[i]     = factor * (data[i] - 128) + 128;
            data[i + 1] = factor * (data[i + 1] - 128) + 128;
            data[i + 2] = factor * (data[i + 2] - 128) + 128;
        }

        return data;
    }

    //// ZHANG SUEN ///////////////////////////////////////////////////////

    /**
     * @param {Uint8ClampedArray} data
     * @param {number} w
     * @param {number} h
     * @returns {Uint8ClampedArray}
     */
    static zhangSuen(data, w, h) {
        function Image2Bool(img, width, height) {
            let s = [];

            for (let y = 0; y < height; y++) {
                let sx = [];

                for (let x = 0; x < width; x++) {
                    let p = Buffer.getPixelXY(img, x, y, w);

                    if (x == 0 || y == 0 || x == width - 1 || y == height - 1) {
                        sx.push(false);
                    } else {
                        let v = Math.floor((p[0] + p[1] + p[2]) / 3);
                        sx.push(v < 32);
                    }
                }

                s.push(sx);
            }

            return s;
        }

        function Bool2Image(s, width, height) {
            //noinspection JSUnresolvedFunction
            let bmp = new Uint8ClampedArray(width * height * 4);

            for (let y = 0; y < height; y++) {
                for (let x = 0; x < width; x++) {
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
            let count = 0;

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
            let p2 = s[x][y - 1],
                p3 = s[x + 1][y - 1],
                p4 = s[x + 1][y],
                p5 = s[x + 1][y + 1],
                p6 = s[x][y + 1],
                p7 = s[x - 1][y + 1],
                p8 = s[x - 1][y],
                p9 = s[x - 1][y - 1];

            return (+(!p2 && p3)) + (+(!p3 && p4))
                + (+(!p4 && p5)) + (+(!p5 && p6))
                + (+(!p6 && p7)) + (+(!p7 && p8))
                + (+(!p8 && p9)) + (+(!p9 && p2));
        }

        /**
         * @return {boolean}
         */
        function SuenThinningAlg(x, y, s, even) {
            let p2 = s[x][y - 1],
                p4 = s[x + 1][y],
                p6 = s[x][y + 1],
                p8 = s[x - 1][y];

            let bp1 = NumberOfNonZeroNeighbors(x, y, s);

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
            let count = 0;

            for (let a = 1; a < temp.length - 1; a++) {
                for (let b = 1; b < temp[0].length - 1; b++) {
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
            let s     = Image2Bool(img, width, height),
                temp,
                count = 0;

            do {
                temp  = _.deepClone(s);
                count = step(1, temp, s);

                temp = _.deepClone(s);
                count += step(2, temp, s);
            } while (count > 0);

            return Bool2Image(s, width, height);
        }

        return ZhangSuenThinning(data, w, h);
    }

    //// KALEIDOSKOPE /////////////////////////////////////////////////////

    /**
     * @param {Uint8ClampedArray} data
     * @param {number} srcW
     * @param {number} srcH
     * @returns {Uint8ClampedArray}
     */
    static kaleidoskopeCenter(data, srcW, srcH) {
        data = Buffer.grab(data, srcW, srcH, 0, 0, srcW, srcH);

        let w = Math.floor(srcW / 2),
            h = Math.floor(srcH / 2);

        let block = Buffer.grab(data, srcW, srcH, 0, 0, w, h);

        data = Buffer.draw(block, w, h, data, 0, 0, srcW, srcH);

        block = Filter.flipX(block, w, h);
        data  = Buffer.draw(block, w, h, data, w, 0, srcW, srcH);

        block = Filter.flipY(block, w, h);
        data  = Buffer.draw(block, w, h, data, w, h, srcW, srcH);

        block = Filter.flipX(block, w, h);
        data  = Buffer.draw(block, w, h, data, 0, h, srcW, srcH);

        return data;
    }

    /**
     * @param {Uint8ClampedArray} data
     * @param {number} srcW
     * @param {number} srcH
     * @returns {Uint8ClampedArray}
     */
    static kaleidoskopeCenterOutside(data, srcW, srcH) {
        data = Buffer.grab(data, srcW, srcH, 0, 0, srcW, srcH);

        let w = Math.floor(srcW / 2),
            h = Math.floor(srcH / 2);

        let block = Buffer.grab(data, srcW, srcH, 0, 0, w, h);

        data = Buffer.draw(block, w, h, data, 0, 0, srcW, srcH);

        block = Filter.flipY(block, w, h);
        data  = Buffer.draw(block, w, h, data, w, 0, srcW, srcH);

        block = Filter.flipX(block, w, h);
        data  = Buffer.draw(block, w, h, data, w, h, srcW, srcH);

        block = Filter.flipY(block, w, h);
        data  = Buffer.draw(block, w, h, data, 0, h, srcW, srcH);

        return data;
    }

    /**
     * @param {Uint8ClampedArray} data
     * @param {number} srcW
     * @param {number} srcH
     * @returns {Uint8ClampedArray}
     */
    static kaleidoskopeOutside(data, srcW, srcH) {
        data = Buffer.grab(data, srcW, srcH, 0, 0, srcW, srcH);

        let w = Math.floor(srcW / 2),
            h = Math.floor(srcH / 2);

        let block = Buffer.grab(data, srcW, srcH, 0, 0, w, h);

        block = Filter.flipX(block, w, h);
        data  = Buffer.draw(block, w, h, data, 0, 0, srcW, srcH);

        block = Filter.flipX(block, w, h);
        data  = Buffer.draw(block, w, h, data, w, 0, srcW, srcH);

        block = Filter.flipY(block, w, h);
        data  = Buffer.draw(block, w, h, data, w, h, srcW, srcH);

        block = Filter.flipX(block, w, h);
        data  = Buffer.draw(block, w, h, data, 0, h, srcW, srcH);

        return data;
    }

    /**
     * @param {Uint8ClampedArray} data
     * @param {number} srcW
     * @param {number} srcH
     * @returns {Uint8ClampedArray}
     */
    static kaleidoskopeVert(data, srcW, srcH) {
        data = Buffer.grab(data, srcW, srcH, 0, 0, srcW, srcH);

        let h = Math.floor(srcH / 2);

        let block = Buffer.grab(data, srcW, srcH, 0, 0, srcW, h);
        data      = Buffer.draw(block, srcW, h, data, 0, 0, srcW, srcH);

        block = Filter.flipY(block, srcW, h);
        data  = Buffer.draw(block, srcW, h, data, 0, h, srcW, srcH);

        return data;
    }

    /**
     * @param {Uint8ClampedArray} data
     * @param {number} srcW
     * @param {number} srcH
     * @returns {Uint8ClampedArray}
     */
    static kaleidoskopeCard(data, srcW, srcH) {
        data = Buffer.grab(data, srcW, srcH, 0, 0, srcW, srcH);

        let h = Math.floor(srcH / 2);

        let block = Buffer.grab(data, srcW, srcH, 0, 0, srcW, h);
        data      = Buffer.draw(block, srcW, h, data, 0, 0, srcW, srcH);

        block = Filter.flipY(block, srcW, h);
        block = Filter.flipX(block, srcW, h);
        data  = Buffer.draw(block, srcW, h, data, 0, h, srcW, srcH);

        return data;
    }

    /**
     * @param {Uint8ClampedArray} data
     * @param {number} srcW
     * @param {number} srcH
     * @returns {Uint8ClampedArray}
     */
    static kaleidoskopeHoriz(data, srcW, srcH) {
        data = Buffer.grab(data, srcW, srcH, 0, 0, srcW, srcH);

        let w = Math.floor(srcW / 2);

        let block = Buffer.grab(data, srcW, srcH, 0, 0, w, srcH);
        data      = Buffer.draw(block, w, srcH, data, 0, 0, srcW, srcH);

        block = Filter.flipX(block, w, srcH);
        data  = Buffer.draw(block, w, srcH, data, w, 0, srcW, srcH);

        return data;
    }

    //// SOBEL ///////////////////////////////////////////////////////////

    /**
     * @param {Uint8ClampedArray} data
     * @param {number} w
     * @returns {Uint8ClampedArray}
     */
    static sobel(data, w) {
        let grayscale = Filter.grayscale(data);

        let vertical = Filter.convolve3x3(grayscale, w, [
            -1, 0, 1,
            -2, 0, 2,
            -1, 0, 1
        ]);

        let horizontal = Filter.convolve3x3(grayscale, w, [
            -1, -2, -1,
            0, 0, 0,
            1, 2, 1
        ]);

        //noinspection JSUnresolvedFunction
        let newData = new Uint8ClampedArray(data.length);

        for (let i = 0; i < data.length; i += 4) {
            // make the vertical gradient red
            let v      = Math.abs(vertical[i]);
            newData[i] = v;

            // make the horizontal gradient green
            let h          = Math.abs(horizontal[i]);
            newData[i + 1] = h;

            // and mix in some blue for aesthetics
            newData[i + 2] = (v + h) / 4;
            newData[i + 3] = 255; // opaque alpha
        }

        return newData;
    }

    //// CONVOLUTION /////////////////////////////////////////////////////

    /**
     * @param {Uint8ClampedArray} data
     * @param {number} w
     * @param {number} h
     * @param {Array} weights
     * @param {boolean} opaque
     * @returns {Uint8ClampedArray}
     */
    static convolute(data, w, h, weights, opaque) {
        opaque = opaque || false;

        let side     = Math.round(Math.sqrt(weights.length)),
            halfSide = Math.floor(side / 2);

        // pad output by the convolution matrix
        //noinspection JSUnresolvedFunction
        let dst = new Uint8ClampedArray(data.length);

        // go through the destination image pixels
        let alphaFac = +opaque;

        for (let y = 0; y < h; y++) {
            for (let x = 0; x < w; x++) {
                let sy     = y,
                    sx     = x,
                    dstOff = (y * w + x) * 4;

                // calculate the weighed sum of the source image pixels that
                // fall under the convolution matrix
                let r = 0,
                    g = 0,
                    b = 0,
                    a = 0;

                for (let cy = 0; cy < side; cy++) {
                    for (let cx = 0; cx < side; cx++) {
                        let scy = sy + cy - halfSide,
                            scx = sx + cx - halfSide;

                        if (scy >= 0 && scy < h && scx >= 0 && scx < w) {
                            let srcOff = (scy * w + scx) * 4,
                                wt     = weights[cy * side + cx];

                            r += data[srcOff] * wt;
                            g += data[srcOff + 1] * wt;
                            b += data[srcOff + 2] * wt;
                            a += data[srcOff + 3] * wt;
                        }
                    }
                }

                dst[dstOff]     = r;
                dst[dstOff + 1] = g;
                dst[dstOff + 2] = b;
                dst[dstOff + 3] = a + alphaFac * (255 - a);
            }
        }

        return dst;
    }

    /**
     * @param {Uint8ClampedArray} data
     * @param {number} w
     * @param {Array} m Kernel
     * @param {number} [divisor]
     * @param {number} [offset]
     * @returns {Uint8ClampedArray}
     */
    static convolve3x3(data, w, m, divisor, offset) {
        if (!divisor) {
            divisor = m.reduce(function (a, b) {
                    return a + b;
                }) || 1; // sum
        }

        //noinspection JSUnresolvedFunction
        let newData = new Uint8ClampedArray(data.length),
            len     = newData.length,
            res     = 0;

        for (let i = 0; i < len; i++) {
            if ((i + 1) % 4 === 0) {
                newData[i] = data[i];
                continue;
            }

            res = 0;

            let these = [
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

            for (let j = 0; j < 9; j++) {
                res += these[j] * m[j];
            }

            res /= divisor;

            if (offset) {
                res += offset;
            }

            newData[i] = res;
        }

        return newData;
    }

    //// INVERSE /////////////////////////////////////////////////////////

    /**
     * @param {Uint8ClampedArray} data
     * @returns {Uint8ClampedArray}
     */
    static invert(data) {
        for (let i = 0; i < data.length; i += 4) {
            data[i] = 255 - data[i];            // red
            data[i + 1] = 255 - data[i + 1];    // green
            data[i + 2] = 255 - data[i + 2];    // blue
        }

        return data;
    }

    //// MIRROR //////////////////////////////////////////////////////////

    /**
     * @param {Uint8ClampedArray} data
     * @param {number} w
     * @param {number} h
     * @returns {Uint8ClampedArray}
     */
    static flipX(data, w, h) {
        let tempData = _.deepClone(data),
            i, flip, x, y, c;

        for (y = 0; y < h; y++) {
            for (x = 0; x < w; x++) {
                // RGB
                i    = (y * w + x) * 4;
                flip = (y * w + (w - x - 1)) * 4;

                for (c = 0; c < 4; c++) {
                    tempData[i + c] = data[flip + c];
                }
            }
        }

        return tempData;
    }

    /**
     * @param {Uint8ClampedArray} data
     * @param {number} w
     * @param {number} h
     * @returns {Uint8ClampedArray}
     */
    static flipY(data, w, h) {
        let tempData = _.deepClone(data),
            i, flip, x, y, c;

        for (y = 0; y < h; y++) {
            for (x = 0; x < w; x++) {
                // RGB
                i    = (y * w + x) * 4;
                flip = ((h - y - 1) * w + x) * 4;

                for (c = 0; c < 4; c += 1) {
                    tempData[i + c] = data[flip + c];
                }
            }
        }

        return tempData;
    }

    /**
     * @param {Uint8ClampedArray} data
     * @param {number} w
     * @param {number} h
     * @returns {Uint8ClampedArray}
     */
    static flipXY(data, w, h) {
        return Filter.flipY(
            Filter.flipX(data, w, h), w, h
        );
    }

    //// THRESHOLD ///////////////////////////////////////////////////////

    /**
     * @param {Uint8ClampedArray} data
     * @param {number} threshold
     * @returns {Uint8ClampedArray}
     */
    static threshold(data, threshold) {
        for (let i = 0; i < data.length; i += 4) {
            let r = data[i],
                g = data[i + 1],
                b = data[i + 2],
                v = (0.2126 * r + 0.7152 * g + 0.0722 * b >= threshold)
                    ? 255
                    : 0;

            data[i] = data[i + 1] = data[i + 2] = v
        }

        return data;
    }

    //// BRIGHTNESS ///////////////////////////////////////////////////////

    /**
     * @param {Uint8ClampedArray} data
     * @param w
     * @param h
     * @param {number} amount
     * @returns {Uint8ClampedArray}
     */
    static brightness(data, w, h, amount) {
        for (let y = 0; y < h; y++) {
            for (let x = 0; x < w; x++) {
                let pixel = (y * w + x) * 4;

                let hsv = Buffer.rgbToHsv(
                    data[pixel], data[pixel + 1], data[pixel + 2]
                );

                hsv[2] += amount;

                if (hsv[2] < 0) {
                    hsv[2] = 0;
                } else if (hsv[2] > 1) {
                    hsv[2] = 1;
                }

                let rgb = Buffer.hsvToRgb(hsv[0], hsv[1], hsv[2]);

                for (let i = 0; i < 3; i++) {
                    data[pixel + i] = rgb[i];
                }
            }
        }

        return data;
    }

    //// COLOR ////////////////////////////////////////////////////////////

    /**
     * @param {Uint8ClampedArray} data
     * @returns {Uint8ClampedArray}
     */
    static monochrome(data) {
        for (let i = 0; i < data.length; i += 4) {
            let r = data[i],
                g = data[i + 1],
                b = data[i + 2];

            let v   = Math.floor((r + g + b) / 3);
            data[i] = data[i + 1] = data[i + 2] = (v > 127 ? 255 : 0);
            data[i + 3] = 255;
        }

        return data;
    }

    /**
     * @param {Uint8ClampedArray} data
     * @returns {Uint8ClampedArray}
     */
    static grayscale(data) {
        for (let i = 0; i < data.length; i += 4) {
            let r = data[i],
                g = data[i + 1],
                b = data[i + 2];

            // CIE luminance for the RGB
            // The human eye is bad at seeing red and blue, so we de-emphasize them.
            let v   = 0.2126 * r + 0.7152 * g + 0.0722 * b;
            data[i] = data[i + 1] = data[i + 2] = v;
        }

        return data;
    }

    /**
     * @param {Uint8ClampedArray} data
     * @returns {Uint8ClampedArray}
     */
    static sepia(data) {
        for (let i = 0; i < data.length; i += 4) {
            let r = data[i],
                g = data[i + 1],
                b = data[i + 2];

            data[i] = (r * 0.393) + (g * 0.769) + (b * 0.189);      // red
            data[i + 1] = (r * 0.349) + (g * 0.686) + (b * 0.168);  // green
            data[i + 2] = (r * 0.272) + (g * 0.534) + (b * 0.131);  // blue
        }

        return data;
    }

    /**
     * @param {Uint8ClampedArray} data
     * @returns {Uint8ClampedArray}
     */
    static red(data) {
        for (let i = 0; i < data.length; i += 4) {
            let r = data[i],
                g = data[i + 1],
                b = data[i + 2];

            data[i] = (r + g + b) / 3;     // apply average to red channel
            data[i + 1] = data[i + 2] = 0; // zero out green and blue channel
        }

        return data;
    }

    /**
     * @param {Uint8ClampedArray} data
     * @returns {Uint8ClampedArray}
     */
    static green(data) {
        for (let i = 0; i < data.length; i += 4) {
            let r = data[i],
                g = data[i + 1],
                b = data[i + 2];

            data[i + 1] = (r + g + b) / 3;
            data[i]     = data[i + 2] = 0;
        }

        return data;
    }

    /**
     * @param {Uint8ClampedArray} data
     * @returns {Uint8ClampedArray}
     */
    static blue(data) {
        for (let i = 0; i < data.length; i += 4) {
            let r = data[i],
                g = data[i + 1],
                b = data[i + 2];

            data[i + 2] = (r + g + b) / 3;
            data[i]     = data[i + 1] = 0;
        }

        return data;
    }

    //// DITHERING ////////////////////////////////////////////////////////

    /**
     * @param {Uint8ClampedArray} data
     * @param {number} w
     * @param {number} h
     * @returns {Uint8ClampedArray}
     */
    static ditherC64_REDUCE(data, w, h) {
        return Dithering.dither(data, w, h, {
            palette:   Dithering.PALETTE.C64,
            algorithm: Dithering.ALGORITHM.REDUCE
        });
    }

    /**
     * @param {Uint8ClampedArray} data
     * @param {number} w
     * @param {number} h
     * @returns {Uint8ClampedArray}
     */
    static ditherC64_ORDERED(data, w, h) {
        return Dithering.dither(data, w, h, {
            palette:   Dithering.PALETTE.C64,
            algorithm: Dithering.ALGORITHM.ORDERED
        });
    }

    /**
     * @param {Uint8ClampedArray} data
     * @param {number} w
     * @param {number} h
     * @returns {Uint8ClampedArray}
     */
    static ditherC64_ERROR(data, w, h) {
        return Dithering.dither(data, w, h, {
            palette:   Dithering.PALETTE.C64,
            algorithm: Dithering.ALGORITHM.ERROR
        });
    }

    /**
     * @param {Uint8ClampedArray} data
     * @param {number} w
     * @param {number} h
     * @returns {Uint8ClampedArray}
     */
    static ditherC64_ATKINSON(data, w, h) {
        return Dithering.dither(data, w, h, {
            palette:   Dithering.PALETTE.C64,
            algorithm: Dithering.ALGORITHM.ATKINSON
        });
    }

    /**
     * @param {Uint8ClampedArray} data
     * @param {number} w
     * @param {number} h
     * @returns {Uint8ClampedArray}
     */
    static ditherSPECTRUM_ATKINSON(data, w, h) {
        return Dithering.dither(data, w, h, {
            palette:   Dithering.PALETTE.SPECTRUM,
            algorithm: Dithering.ALGORITHM.ATKINSON
        });
    }

    /**
     * @param {Uint8ClampedArray} data
     * @param {number} w
     * @param {number} h
     * @returns {Uint8ClampedArray}
     */
    static ditherSPECTRUM_REDUCE(data, w, h) {
        return Dithering.dither(data, w, h, {
            palette:   Dithering.PALETTE.SPECTRUM,
            algorithm: Dithering.ALGORITHM.REDUCE
        });
    }

    /**
     * @param {Uint8ClampedArray} data
     * @param {number} w
     * @param {number} h
     * @returns {Uint8ClampedArray}
     */
    static ditherSPECTRUM_ORDERED(data, w, h) {
        return Dithering.dither(data, w, h, {
            palette:   Dithering.PALETTE.SPECTRUM,
            algorithm: Dithering.ALGORITHM.ORDERED
        });
    }

    /**
     * @param {Uint8ClampedArray} data
     * @param {number} w
     * @param {number} h
     * @returns {Uint8ClampedArray}
     */
    static ditherSPECTRUM_ERROR(data, w, h) {
        return Dithering.dither(data, w, h, {
            palette:   Dithering.PALETTE.SPECTRUM,
            algorithm: Dithering.ALGORITHM.ERROR
        });
    }

    /**
     * @param {Uint8ClampedArray} data
     * @param {number} w
     * @param {number} h
     * @returns {Uint8ClampedArray}
     */
    static ditherAMIGA_BRONZE_ATKINSON(data, w, h) {
        return Dithering.dither(data, w, h, {
            palette:   Dithering.PALETTE.AMIGA_BRONZE,
            algorithm: Dithering.ALGORITHM.ATKINSON
        });
    }

    /**
     * @param {Uint8ClampedArray} data
     * @param {number} w
     * @param {number} h
     * @returns {Uint8ClampedArray}
     */
    static ditherAMIGA_BRONZE_REDUCE(data, w, h) {
        return Dithering.dither(data, w, h, {
            palette:   Dithering.PALETTE.AMIGA_BRONZE,
            algorithm: Dithering.ALGORITHM.REDUCE
        });
    }

    /**
     * @param {Uint8ClampedArray} data
     * @param {number} w
     * @param {number} h
     * @returns {Uint8ClampedArray}
     */
    static ditherAMIGA_BRONZE_ORDERED(data, w, h) {
        return Dithering.dither(data, w, h, {
            palette:   Dithering.PALETTE.AMIGA_BRONZE,
            algorithm: Dithering.ALGORITHM.ORDERED
        });
    }

    /**
     * @param {Uint8ClampedArray} data
     * @param {number} w
     * @param {number} h
     * @returns {Uint8ClampedArray}
     */
    static ditherAMIGA_BRONZE_ERROR(data, w, h) {
        return Dithering.dither(data, w, h, {
            palette:   Dithering.PALETTE.AMIGA_BRONZE,
            algorithm: Dithering.ALGORITHM.ERROR
        });
    }

    /**
     * @param {Uint8ClampedArray} data
     * @param {number} w
     * @param {number} h
     * @returns {Uint8ClampedArray}
     */
    static ditherMONO_ATKINSON(data, w, h) {
        return Dithering.dither(data, w, h, {
            palette:   Dithering.PALETTE.MONO,
            algorithm: Dithering.ALGORITHM.ATKINSON
        });
    }

    /**
     * @param {Uint8ClampedArray} data
     * @param {number} w
     * @param {number} h
     * @returns {Uint8ClampedArray}
     */
    static ditherMONO_REDUCE(data, w, h) {
        return Dithering.dither(data, w, h, {
            palette:   Dithering.PALETTE.MONO,
            algorithm: Dithering.ALGORITHM.REDUCE
        });
    }

    /**
     * @param {Uint8ClampedArray} data
     * @param {number} w
     * @param {number} h
     * @returns {Uint8ClampedArray}
     */
    static ditherMONO_ORDERED(data, w, h) {
        return Dithering.dither(data, w, h, {
            palette:   Dithering.PALETTE.MONO,
            algorithm: Dithering.ALGORITHM.ORDERED
        });
    }

    /**
     * @param {Uint8ClampedArray} data
     * @param {number} w
     * @param {number} h
     * @returns {Uint8ClampedArray}
     */
    static ditherMONO_ERROR(data, w, h) {
        return Dithering.dither(data, w, h, {
            palette:   Dithering.PALETTE.MONO,
            algorithm: Dithering.ALGORITHM.ERROR
        });
    }

    /**
     * @param {Uint8ClampedArray} data
     * @param {number} w
     * @param {number} h
     * @returns {Uint8ClampedArray}
     */
    static ditherAMIGA_ORANGE_ATKINSON(data, w, h) {
        return Dithering.dither(data, w, h, {
            palette:   Dithering.PALETTE.AMIGA_ORANGE,
            algorithm: Dithering.ALGORITHM.ATKINSON
        });
    }

    /**
     * @param {Uint8ClampedArray} data
     * @param {number} w
     * @param {number} h
     * @returns {Uint8ClampedArray}
     */
    static ditherAMIGA_ORANGE_REDUCE(data, w, h) {
        return Dithering.dither(data, w, h, {
            palette:   Dithering.PALETTE.AMIGA_ORANGE,
            algorithm: Dithering.ALGORITHM.REDUCE
        });
    }

    /**
     * @param {Uint8ClampedArray} data
     * @param {number} w
     * @param {number} h
     * @returns {Uint8ClampedArray}
     */
    static ditherAMIGA_ORANGE_ORDERED(data, w, h) {
        return Dithering.dither(data, w, h, {
            palette:   Dithering.PALETTE.AMIGA_ORANGE,
            algorithm: Dithering.ALGORITHM.ORDERED
        });
    }

    /**
     * @param {Uint8ClampedArray} data
     * @param {number} w
     * @param {number} h
     * @returns {Uint8ClampedArray}
     */
    static ditherAMIGA_ORANGE_ERROR(data, w, h) {
        return Dithering.dither(data, w, h, {
            palette:   Dithering.PALETTE.AMIGA_ORANGE,
            algorithm: Dithering.ALGORITHM.ERROR
        });
    }

    /**
     * @param {Uint8ClampedArray} data
     * @param {number} w
     * @param {number} h
     * @returns {Uint8ClampedArray}
     */
    static ditherBASIC_ATKINSON(data, w, h) {
        return Dithering.dither(data, w, h, {
            palette:   Dithering.PALETTE.BASIC,
            algorithm: Dithering.ALGORITHM.ATKINSON
        });
    }

    /**
     * @param {Uint8ClampedArray} data
     * @param {number} w
     * @param {number} h
     * @returns {Uint8ClampedArray}
     */
    static ditherBASIC_REDUCE(data, w, h) {
        return Dithering.dither(data, w, h, {
            palette:   Dithering.PALETTE.BASIC,
            algorithm: Dithering.ALGORITHM.REDUCE
        });
    }

    /**
     * @param {Uint8ClampedArray} data
     * @param {number} w
     * @param {number} h
     * @returns {Uint8ClampedArray}
     */
    static ditherBASIC_ORDERED(data, w, h) {
        return Dithering.dither(data, w, h, {
            palette:   Dithering.PALETTE.BASIC,
            algorithm: Dithering.ALGORITHM.ORDERED
        });
    }

    /**
     * @param {Uint8ClampedArray} data
     * @param {number} w
     * @param {number} h
     * @returns {Uint8ClampedArray}
     */
    static ditherBASIC_ERROR(data, w, h) {
        return Dithering.dither(data, w, h, {
            palette:   Dithering.PALETTE.BASIC,
            algorithm: Dithering.ALGORITHM.ERROR
        });
    }
}