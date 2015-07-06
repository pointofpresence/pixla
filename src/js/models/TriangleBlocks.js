/**
 * @module models/TriangleBlocks
 */
define("models/TriangleBlocks", [
    "backbone",
    "underscore",
    "models/TriangleCross"
], function (Backbone, _, TriangleCrossModel) {
    "use strict";

    return TriangleCrossModel.extend({
        defaults: _.extend({}, TriangleCrossModel.prototype.defaults, {
            name:        "Blocks",
            description: "Blocks Tile",
            sort:        150
        }),

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
            colors[2] = this.mixColors(colors[5], this.COLORS.BLACK, f);
            colors[3] = this.mixColors(colors[5], this.COLORS.WHITE, f);

            f = 0.125;
            colors[4] = this.mixColors(colors[5], this.COLORS.WHITE, f);
            colors[6] = this.mixColors(colors[5], this.COLORS.BLACK, f);

            f = 0.25;
            colors[7] = this.mixColors(colors[5], this.COLORS.BLACK, f);

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