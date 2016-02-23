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
                x + 2,
                y + 2
            );

            colors[3] = this.getPixelXY(
                data,
                x + 4,
                y + 4
            );

            colors[4] = this.getPixelXY(
                data,
                x + 6,
                y + 6
            );

            return colors;
        },

        pattern: [
            [1, 1, 1, 2, 2, 3, 3, 4, 4, 3, 3, 2, 2, 1, 1, 1],
            [1, 1, 1, 2, 2, 3, 3, 4, 4, 3, 3, 2, 2, 1, 1, 1],
            [1, 1, 1, 2, 2, 3, 3, 4, 4, 3, 3, 2, 2, 1, 1, 1],
            [2, 2, 2, 2, 2, 3, 3, 4, 4, 3, 3, 2, 2, 2, 2, 2],
            [2, 2, 2, 2, 2, 3, 3, 4, 4, 3, 3, 2, 2, 2, 2, 2],
            [3, 3, 3, 3, 3, 3, 3, 4, 4, 3, 3, 3, 3, 3, 3, 3],
            [3, 3, 3, 3, 3, 3, 3, 4, 4, 3, 3, 3, 3, 3, 3, 3],
            [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
            [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
            [3, 3, 3, 3, 3, 3, 3, 4, 4, 3, 3, 3, 3, 3, 3, 3],
            [3, 3, 3, 3, 3, 3, 3, 4, 4, 3, 3, 3, 3, 3, 3, 3],
            [2, 2, 2, 2, 2, 3, 3, 4, 4, 3, 3, 2, 2, 2, 2, 2],
            [2, 2, 2, 2, 2, 3, 3, 4, 4, 3, 3, 2, 2, 2, 2, 2],
            [1, 1, 1, 2, 2, 3, 3, 4, 4, 3, 3, 2, 2, 1, 1, 1],
            [1, 1, 1, 2, 2, 3, 3, 4, 4, 3, 3, 2, 2, 1, 1, 1],
            [1, 1, 1, 2, 2, 3, 3, 4, 4, 3, 3, 2, 2, 1, 1, 1]
        ]
    });
};