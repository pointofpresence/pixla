/* global define */

define("lib/Filter", ["lib/Dithering"], function (Dithering) {
    "use strict";

    //noinspection JSValidateJSDoc
    return {
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