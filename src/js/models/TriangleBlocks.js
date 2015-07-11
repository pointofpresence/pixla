/**
 * @module models/TriangleBlocks
 */
define("models/TriangleBlocks", [
    "models/TriangleCross",
    "lib/Buffer"
], function (TriangleCrossModel, Buffer) {
    "use strict";

    return TriangleCrossModel.extend({
        TILE_WIDTH:  5,
        TILE_HEIGHT: 5,

        getColors: function (data, x, y) {
            var colors = [], f;

            colors[5] = this.getPixelXY(
                data,
                x + Math.floor((this.TILE_WIDTH - 1) / 2),
                y + Math.floor((this.TILE_HEIGHT - 1) / 2)
            );

            f = 0.75;
            colors[2] = Buffer.mixColors(colors[5], Buffer.COLORS.BLACK, f);
            colors[3] = Buffer.mixColors(colors[5], Buffer.COLORS.WHITE, f);

            f = 0.125;
            colors[4] = Buffer.mixColors(colors[5], Buffer.COLORS.WHITE, f);
            colors[6] = Buffer.mixColors(colors[5], Buffer.COLORS.BLACK, f);

            f = 0.25;
            colors[7] = Buffer.mixColors(colors[5], Buffer.COLORS.BLACK, f);

            return colors;
        },

        pattern: [
            [5, 2, 2, 2, 2],
            [2, 3, 4, 4, 5],
            [2, 4, 5, 5, 6],
            [2, 4, 5, 5, 6],
            [2, 5, 6, 6, 7]
        ]
    });
});