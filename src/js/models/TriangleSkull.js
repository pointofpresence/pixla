"use strict";

var TriangleCrossModel = require("./TriangleCross");

module.exports = function () {
    return TriangleCrossModel.extend({
        getColors: function (data, x, y) {
            var colors = [];

            colors[1] = this.getPixelXY(
                data,
                x,
                y
            );

            colors[2] = this.getPixelXY(
                data,
                x + this.TILE_WIDTH / 2,
                y
            );

            colors[3] = this.getPixelXY(
                data,
                x + this.TILE_WIDTH - 1,
                y + 4
            );

            colors[4] = this.getPixelXY(
                data,
                x + this.TILE_WIDTH / 2,
                y + this.TILE_HEIGHT / 2
            );

            colors[5] = this.getPixelXY(
                data,
                x,
                y + this.TILE_HEIGHT - 1
            );

            colors[6] = this.getPixelXY(
                data,
                x + this.TILE_WIDTH - 1,
                y + this.TILE_HEIGHT - 1
            );

            return colors;
        },

        pattern: [
            [1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3],
            [1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3],
            [1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3],
            [1, 1, 2, 2, 2, 2, 4, 4, 4, 4, 2, 2, 2, 2, 3, 3],
            [2, 2, 2, 2, 2, 4, 4, 4, 4, 4, 4, 2, 2, 2, 2, 2],
            [2, 2, 2, 2, 4, 4, 4, 4, 4, 4, 4, 4, 2, 2, 2, 2],
            [2, 2, 2, 2, 4, 4, 2, 4, 4, 2, 4, 4, 2, 2, 2, 2],
            [2, 2, 2, 2, 4, 4, 2, 4, 4, 2, 4, 4, 2, 2, 2, 2],
            [2, 2, 2, 2, 4, 4, 4, 4, 4, 4, 4, 4, 2, 2, 2, 2],
            [2, 2, 2, 2, 4, 4, 4, 4, 4, 4, 4, 4, 2, 2, 2, 2],
            [2, 2, 2, 2, 2, 2, 4, 4, 4, 4, 2, 2, 2, 2, 2, 2],
            [5, 5, 2, 2, 2, 2, 4, 4, 4, 4, 2, 2, 2, 2, 6, 6],
            [5, 5, 5, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 6, 6, 6],
            [5, 5, 5, 5, 2, 2, 2, 2, 2, 2, 2, 2, 6, 6, 6, 6],
            [5, 2, 5, 5, 2, 2, 2, 2, 2, 2, 2, 2, 6, 6, 2, 6],
            [5, 2, 5, 5, 2, 2, 2, 2, 2, 2, 2, 2, 6, 6, 2, 6]
        ]
    });
};