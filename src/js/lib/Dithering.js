let gOpt = {};

/**
 * @description Based on dpiccone/ditherjs
 */
export default class Dithering {
    static get ALGORITHM() {
        return {
            REDUCE:   "Reduce",
            ORDERED:  "Ordered",
            ERROR:    "Error diffusion",
            ATKINSON: "Atkinson"
        }
    }

    static get PALETTE() {
        return {
            C64: {
                name: "C64",
                data: [
                    //@formatter:off
                    [0,     0,   0],
                    [102, 102, 204],
                    [102, 204, 204],
                    [153, 255, 153],
                    [204, 102, 102],
                    [204, 204, 102],
                    [255, 255, 255],
                    [51,   51, 153],
                    [102,  51,   0],
                    [102, 102, 102],
                    [102, 153,  51],
                    [153,  51,  51],
                    [153,  51, 153],
                    [153, 102,  51],
                    [153, 153, 153]
                    //@formatter:on
                ]
            },

            BASIC: {
                name: "BASIC",
                data: [
                    //@formatter:off
                    [0,     0,   0],
                    [255,   0, 255],
                    [0,   255, 255],
                    [255, 255, 255]
                    //@formatter:on
                ]
            },

            SPECTRUM: {
                name: "ZX Spectrum",
                data: [
                    //@formatter:off
                    [0,     0,   0],
                    [0,     0, 255],
                    [0,   255,   0],
                    [0,   255, 255],
                    [255,   0,   0],
                    [255,   0, 255],
                    [255, 255,   0],
                    [255, 255, 255]
                    //@formatter:on
                ]
            },

            MONO: {
                name: "Monochrome",
                data: [
                    //@formatter:off
                    [0,     0,   0],
                    [255, 255, 255]
                    //@formatter:on
                ]
            },

            AMIGA_ORANGE: {
                name: "Amiga Orange",
                data: [
                    //@formatter:off
                    [0,     0,   0],
                    [0,     0,  51],
                    [0,    51,  51],
                    [102, 102, 204],
                    [102, 153, 255],
                    [204, 102,  51],
                    [204, 153,  51],
                    [204, 153, 153],
                    [204, 204, 204],
                    [255, 153, 102],
                    [255, 204, 102],
                    [255, 204, 153],
                    [255, 204, 204],
                    [51,    0,   0],
                    [51,   51,   0],
                    [51,   51,  51],
                    [51,   51, 102],
                    [51,   51, 153],
                    [51,  102, 102],
                    [51,  102, 153],
                    [102,   0,   0],
                    [102,  51,   0],
                    [102,  51,  51],
                    [102, 102,  51],
                    [102, 102, 102],
                    [153,  51,   0],
                    [153, 102,  51],
                    [153, 153, 153]
                    //@formatter:on
                ]
            },

            AMIGA_BRONZE: {
                name: "Amiga Bronze",
                data: [
                    //@formatter:off
                    [0,     0,   0],
                    [204, 102,  51],
                    [204, 153,  51],
                    [204, 153, 102],
                    [204, 153, 153],
                    [204, 204, 153],
                    [204, 204, 204],
                    [255, 153, 102],
                    [255, 204, 153],
                    [255, 204, 204],
                    [255, 255, 255],
                    [51,    0,   0],
                    [51,   51,   0],
                    [51,   51,  51],
                    [102,  51,   0],
                    [102,  51,  51],
                    [102, 102,  51],
                    [102, 102, 102],
                    [153,  51,   0],
                    [153, 102,  51],
                    [153, 102, 102],
                    [153, 153, 102],
                    [153, 153, 153]
                    //@formatter:on
                ]
            }
        }
    }

    /**
     * @param data
     * @param w
     * @param h
     * @param opt
     * @returns {Uint8ClampedArray}
     */
    static dither(data, w, h, opt) {
        opt = opt || {};

        gOpt.step = opt.step || 1; // works better with 1,3,5,7
        gOpt.algorithm = opt.algorithm || Dithering.ALGORITHM.REDUCE;
        gOpt.palette   = opt.palette.data || Dithering.PALETTE.BASIC.data;

        gOpt.w = w;
        gOpt.h = h;

        switch (gOpt.algorithm) {
            case Dithering.ALGORITHM.ERROR:
                return Dithering.errorDiffusionDither(data);
            case Dithering.ALGORITHM.ORDERED:
                return Dithering.orderedDither(data);
            case Dithering.ALGORITHM.ATKINSON:
                return Dithering.atkinsonDither(data);
            case Dithering.ALGORITHM.REDUCE:
                return Dithering.reduceDither(data);
            default :
                throw new Error("Not a valid algorithm");
        }
    }

    /**
     * Return a distance of two colors ina three dimensional space
     * @return number
     * @param {Array} a
     * @param {Array} b
     * */
    static colorDistance(a, b) {
        return Math.sqrt(
            Math.pow(((a[0]) - (b[0])), 2)
            + Math.pow(((a[1]) - (b[1])), 2)
            + Math.pow(((a[2]) - (b[2])), 2)
        );
    }

    /**
     * Return the most closer color vs a common palette
     * @return i - the index of the closer color
     * @param {Array} color
     * */
    static approximateColor(color) {
        let palette = gOpt.palette;

        let findIndex = function (fun, arg, list, min) {
            if (list.length == 2) {
                if (fun(arg, min) <= fun(arg, list[1])) {
                    return min;
                } else {
                    return list[1];
                }
            } else {
                let tl = list.slice(1);

                min = (fun(arg, min) <= fun(arg, list[1])) ? min : list[1];

                return findIndex(fun, arg, tl, min);
            }
        };

        return findIndex(Dithering.colorDistance, color, palette, palette[0]);
    }

    /**
     * @description Threshold function
     * @param value
     * @returns {number}
     */
    static threshold(value) {
        return value < 127 ? 0 : 255;
    }

    /**
     * @description Perform an ordered dither on the image
     * @param data
     * @returns {Uint8ClampedArray}
     */
    static orderedDither(data) {
        // Create a new empty image
        //noinspection JSUnresolvedFunction
        let d = new Uint8ClampedArray(data),
            w = gOpt.w,
            h = gOpt.h;

        // Step
        let step = gOpt.step;

        // Ratio >= 1
        let ratio = 3;

        // Threshold Matrix
        let m = [
            //@formatter:off
            [1,  9,  3, 11],
            [13, 5, 15,  7],
            [4, 12,  2, 10],
            [16, 8, 14,  6]
            //@formatter:on
        ];

        for (let y = 0; y < h; y += step) {
            for (let x = 0; x < w; x += step) {
                let i = (4 * x) + (4 * y * w);

                // Define bytes
                let r = i,
                    g = i + 1,
                    b = i + 2;

                d[r] += m[x % 4][y % 4] * ratio;
                d[g] += m[x % 4][y % 4] * ratio;
                d[b] += m[x % 4][y % 4] * ratio;

                let color  = [d[r], d[g], d[b]],
                    approx = Dithering.approximateColor(color),
                    tr     = approx[0],
                    tg     = approx[1],
                    tb     = approx[2];

                // Draw a block
                for (let dx = 0; dx < step; dx++) {
                    for (let dy = 0; dy < step; dy++) {
                        let di = i + (4 * dx) + (4 * w * dy);

                        // Draw pixel
                        d[di]     = tr;
                        d[di + 1] = tg;
                        d[di + 2] = tb;
                    }
                }
            }
        }

        return d;
    }

    static reduceDither(data) {
        // Create a new empty image
        //noinspection JSUnresolvedFunction
        let d = new Uint8ClampedArray(data),
            w = gOpt.w,
            h = gOpt.h;

        // Step
        let step = gOpt.step;

        for (let y = 0; y < h; y += step) {
            for (let x = 0; x < w; x += step) {
                let i = (4 * x) + (4 * y * w);

                // Define bytes
                //noinspection UnnecessaryLocalVariableJS
                let r = i,
                    g = i + 1,
                    b = i + 2;

                let color  = [d[r], d[g], d[b]],
                    approx = Dithering.approximateColor(color),
                    tr     = approx[0],
                    tg     = approx[1],
                    tb     = approx[2];

                // Draw a block
                for (let dx = 0; dx < step; dx++) {
                    for (let dy = 0; dy < step; dy++) {
                        let di = i + (4 * dx) + (4 * w * dy);

                        // Draw pixel
                        d[di]     = tr;
                        d[di + 1] = tg;
                        d[di + 2] = tb;
                    }
                }
            }
        }

        return d;
    }

    /**
     * @description Perform an atkinson dither on the image
     * @param data
     * @returns {Uint8ClampedArray}
     */
    static atkinsonDither(data) {
        // Create a new empty image
        //noinspection JSUnresolvedFunction
        let d   = new Uint8ClampedArray(data),
            out = new Uint8ClampedArray(data),
            w   = gOpt.w,
            h   = gOpt.h;

        // Step
        let step = gOpt.step;

        // Ratio >= 1
        let ratio = 1 / 8;

        for (let y = 0; y < h; y += step) {
            for (let x = 0; x < w; x += step) {
                let i = (4 * x) + (4 * y * w);

                let $i = function (x, y) {
                    return (4 * x) + (4 * y * w);
                };

                // Define bytes
                let r = i,
                    g = i + 1,
                    b = i + 2;

                let color  = [d[r], d[g], d[b]],
                    approx = Dithering.approximateColor(color);

                let q = [];

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

                let tr = approx[0],
                    tg = approx[1],
                    tb = approx[2];

                // Draw a block
                for (let dx = 0; dx < step; dx++) {
                    for (let dy = 0; dy < step; dy++) {
                        let di = i + (4 * dx) + (4 * w * dy);

                        // Draw pixel
                        out[di]     = tr;
                        out[di + 1] = tg;
                        out[di + 2] = tb;
                    }
                }
            }
        }

        return out;
    }

    /**
     * @description Perform an error diffusion dither on the image
     * @param data
     * @returns {Uint8ClampedArray}
     */
    static errorDiffusionDither(data) {
        //noinspection JSUnresolvedFunction
        let d   = new Uint8ClampedArray(data),
            out = new Uint8ClampedArray(data),
            w   = gOpt.w,
            h   = gOpt.h;

        // Step
        let step = gOpt.step;

        // Ratio >= 1
        let ratio = 1 / 16;

        for (let y = 0; y < h; y += step) {
            for (let x = 0; x < w; x += step) {
                let i = (4 * x) + (4 * y * w);

                let $i = function (x, y) {
                    return (4 * x) + (4 * y * w);
                };

                // Define bytes
                let r = i,
                    g = i + 1,
                    b = i + 2;

                let color  = [d[r], d[g], d[b]],
                    approx = Dithering.approximateColor(color);

                let q = [];

                q[r] = d[r] - approx[0];
                q[g] = d[g] - approx[1];
                q[b] = d[b] - approx[2];

                // Diffuse the error
                d[$i(x + step, y)]        = d[$i(x + step, y)] + 7 * ratio * q[r];
                d[$i(x - step, y + 1)]    = d[$i(x - 1, y + step)] + 3 * ratio * q[r];
                d[$i(x, y + step)]        = d[$i(x, y + step)] + 5 * ratio * q[r];
                d[$i(x + step, y + step)] = d[$i(x + 1, y + step)] + ratio * q[r];

                d[$i(x + step, y) + 1]        = d[$i(x + step, y) + 1] + 7 * ratio * q[g];
                d[$i(x - step, y + step) + 1] = d[$i(x - step, y + step) + 1] + 3 * ratio * q[g];
                d[$i(x, y + step) + 1]        = d[$i(x, y + step) + 1] + 5 * ratio * q[g];
                d[$i(x + step, y + step) + 1] = d[$i(x + step, y + step) + 1] + ratio * q[g];

                d[$i(x + step, y) + 2]        = d[$i(x + step, y) + 2] + 7 * ratio * q[b];
                d[$i(x - step, y + step) + 2] = d[$i(x - step, y + step) + 2] + 3 * ratio * q[b];
                d[$i(x, y + step) + 2]        = d[$i(x, y + step) + 2] + 5 * ratio * q[b];
                d[$i(x + step, y + step) + 2] = d[$i(x + step, y + step) + 2] + ratio * q[b];

                // Color
                let tr = approx[0],
                    tg = approx[1],
                    tb = approx[2];

                // Draw a block
                for (let dx = 0; dx < step; dx++) {
                    for (let dy = 0; dy < step; dy++) {
                        let di = i + (4 * dx) + (4 * w * dy);

                        // Draw pixel
                        out[di]     = tr;
                        out[di + 1] = tg;
                        out[di + 2] = tb;
                    }
                }
            }
        }

        return out;
    }
}