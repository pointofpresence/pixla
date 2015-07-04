/**
 * @module models/TriangleStone
 */
define("models/TriangleStone", [
    "backbone",
    "underscore",
    "models/TriangleCross"
], function (Backbone, _, TriangleCrossModel) {
    "use strict";

    return TriangleCrossModel.extend({
        defaults: _.extend({}, TriangleCrossModel.prototype.defaults, {
            name:        "Stone",
            description: "Stone Tile",
            sort:        80
        }),

        getColors: function (data, x, y) {
            var colors = [];

            colors[1] = this.getPixelXY(
                data,
                x + 1,
                y + 1
            );

            colors[2] = this.getPixelXY(
                data,
                x + this.TILE_WIDTH - 1,
                y + this.TILE_HEIGHT - 1
            );

            return colors;
        },

        pattern: [
            [1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 2, 1, 2, 1, 2, 1],
            [1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 2, 1, 2, 1, 2, 1],
            [1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 2, 1, 2, 1, 2, 1],
            [2, 2, 2, 1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1, 2],
            [1, 1, 1, 2, 1, 2, 1, 2, 1, 2, 1, 1, 1, 2, 1, 2],
            [2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1, 2],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [2, 2, 2, 1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2],
            [1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 2, 1, 2, 1, 2, 1],
            [1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 2, 1, 2, 1, 2, 1],
            [1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 2, 1, 2, 1, 2, 1],
            [2, 2, 2, 1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [2, 2, 2, 1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2]
        ]
    });
});