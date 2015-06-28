/**
 * @module models/TriangleStoneAdvanced
 */
define("models/TriangleStoneAdvanced", [
    "backbone",
    "underscore",
    "models/TriangleCross"
], function (Backbone, _, TriangleCrossModel) {
    "use strict";

    return TriangleCrossModel.extend({
        defaults: _.extend({}, TriangleCrossModel.prototype.defaults, {
            name:        "Stone Advanced",
            description: "Advanced Stone Tile"
        }),

        getColors: function (data, x, y) {
            var colors = [];

            colors[1] = this.getPixelXY(
                data,
                x + this.TILE_WIDTH / 2,
                y + this.TILE_HEIGHT / 2
            );

            colors[2] = this.getPixelXY(
                data,
                x,
                y
            );

            colors[3] = this.getPixelXY(
                data,
                x + this.TILE_WIDTH / 4,
                y
            );

            colors[4] = this.getPixelXY(
                data,
                x + this.TILE_WIDTH / 2,
                y
            );

            colors[4] = this.getPixelXY(
                data,
                x + (this.TILE_WIDTH / 4) * 3,
                y
            );

            colors[5] = this.getPixelXY(
                data,
                x + this.TILE_WIDTH - 1,
                y
            );

            colors[6] = this.getPixelXY(
                data,
                x,
                y + this.TILE_HEIGHT / 4
            );

            colors[7] = this.getPixelXY(
                data,
                x + this.TILE_WIDTH / 2 - 1,
                y + this.TILE_HEIGHT / 2 - 1
            );

            colors[8] = this.getPixelXY(
                data,
                x + (this.TILE_WIDTH / 4) * 3,
                y + this.TILE_HEIGHT / 2 - 1
            );

            colors[9] = this.getPixelXY(
                data,
                x + this.TILE_WIDTH  - 1,
                y + this.TILE_HEIGHT / 2 - 1
            );

            colors[10] = this.getPixelXY(
                data,
                x,
                y + (this.TILE_HEIGHT / 4) * 3
            );

            colors[11] = this.getPixelXY(
                data,
                x + this.TILE_HEIGHT / 4,
                y + (this.TILE_HEIGHT / 4) * 3
            );

            colors[12] = this.getPixelXY(
                data,
                x + this.TILE_HEIGHT / 2,
                y + (this.TILE_HEIGHT / 4) * 3
            );

            colors[13] = this.getPixelXY(
                data,
                x + (this.TILE_HEIGHT / 4) * 3,
                y + (this.TILE_HEIGHT / 4) * 3
            );

            colors[14] = this.getPixelXY(
                data,
                x,
                y + this.TILE_HEIGHT - 1
            );

            colors[15] = this.getPixelXY(
                data,
                x + this.TILE_WIDTH / 4,
                y + this.TILE_HEIGHT - 1
            );

            colors[16] = this.getPixelXY(
                data,
                x + this.TILE_WIDTH / 2,
                y + this.TILE_HEIGHT - 1
            );

            colors[17] = this.getPixelXY(
                data,
                x + (this.TILE_WIDTH / 4) * 3,
                y + this.TILE_HEIGHT - 1
            );

            return colors;
        },

        pattern: [
            //@formatter:off
            [ 1,  1,  2,  1,  3,  1,  1,  1,  3,  1,  4,  1,  4,  1,  5,  1],
            [ 1,  1,  2,  1,  3,  1,  1,  1,  3,  1,  4,  1,  4,  1,  5,  1],
            [ 1,  1,  2,  1,  3,  1,  1,  1,  3,  1,  4,  1,  4,  1,  5,  1],
            [ 2,  2,  2,  1,  3,  3,  3,  3,  3,  1,  4,  4,  4,  1,  5,  5],
            [ 1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1],
            [ 6,  6,  6,  6,  1,  7,  7,  7,  1,  8,  8,  8,  8,  8,  1,  9],
            [ 1,  1,  1,  6,  1,  7,  1,  7,  1,  8,  1,  1,  1,  8,  1,  9],
            [ 6,  6,  6,  6,  1,  7,  7,  7,  1,  8,  8,  8,  8,  8,  1,  9],
            [ 1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1],
            [10, 10, 10,  1, 11, 11, 11, 11, 11,  1, 12, 12, 12,  1, 13, 13],
            [ 1,  1, 10,  1, 11,  1,  1,  1, 11,  1, 12,  1, 12,  1, 13,  1],
            [ 1,  1, 10,  1, 11,  1,  1,  1, 11,  1, 12,  1, 12,  1, 13,  1],
            [ 1,  1, 10,  1, 11,  1,  1,  1, 11,  1, 12,  1, 12,  1, 13,  1],
            [10, 10, 10,  1, 11, 11, 11, 11, 11,  1, 12, 12, 12,  1, 13, 13],
            [ 1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1],
            [14, 14, 14,  1, 15, 15, 15, 15, 15,  1, 16, 16, 16,  1, 17, 17]
            //@formatter:on
        ]
    });
});