/**
 * @module models/TriangleKuwahara
 */
define("models/TriangleKuwahara", [
    "models/TriangleCross",
    "lib/Buffer"
], function (TriangleCrossModel, Buffer) {
    "use strict";

    return TriangleCrossModel.extend({
        TILE_WIDTH:  5,
        TILE_HEIGHT: 5,

        getColors: function (data, x, y) {
            var colors = [];

            colors[1] = this.getPixelXY(
                data,
                x,
                y
            );

            colors[2] = this.getPixelXY(
                data,
                x + 4,
                y
            );

            colors[3] = this.getPixelXY(
                data,
                x,
                y + 4
            );

            colors[4] = this.getPixelXY(
                data,
                x + 4,
                y + 4
            );

            colors[5] = Buffer.mixColors(colors[1], colors[2]);

            colors[6] = Buffer.mixColors(colors[1], colors[3]);

            colors[7] = Buffer.mixColors(colors[2], colors[4]);

            colors[8] = Buffer.mixColors(colors[3], colors[4]);

            colors[9] = Buffer.mixColors(colors[5], colors[8]);

            colors[10] = Buffer.mixColors(colors[6], colors[5]);

            colors[11] = Buffer.mixColors(colors[5], colors[7]);

            colors[12] = Buffer.mixColors(colors[6], colors[8]);

            colors[13] = Buffer.mixColors(colors[7], colors[8]);

            return colors;
        },

        //@formatter:off
        pattern:   [
            [ 1,  1, 5,  2,  2],
            [ 1, 10, 5, 11,  2],
            [ 6,  6, 9,  7,  7],
            [ 3, 12, 8, 13,  4],
            [ 3,  3, 8,  4,  4]
        ]
        //@formatter:on
    });
});