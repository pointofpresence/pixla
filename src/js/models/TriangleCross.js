/**
 * @module models/TriangleCross
 */
define("models/TriangleCross", [
    "backbone",
    "underscore",
    "models/TriangleAbstract"
], function (Backbone, _, TriangleAbstractModel) {
    "use strict";

    return TriangleAbstractModel.extend({
        defaults: _.extend({}, TriangleAbstractModel.prototype.defaults, {
            name:        "Triangle Cross",
            description: "Triangle Cross Filter",
            sort:        10
        }),

        pattern: [
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
            [4, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2],
            [4, 4, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2],
            [4, 4, 4, 4, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2],
            [4, 4, 4, 4, 4, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2],
            [4, 4, 4, 4, 4, 4, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2],
            [4, 4, 4, 4, 4, 4, 4, 1, 1, 2, 2, 2, 2, 2, 2, 2],
            [4, 4, 4, 4, 4, 4, 4, 4, 2, 2, 2, 2, 2, 2, 2, 2],
            [4, 4, 4, 4, 4, 4, 4, 3, 3, 2, 2, 2, 2, 2, 2, 2],
            [4, 4, 4, 4, 4, 4, 3, 3, 3, 3, 2, 2, 2, 2, 2, 2],
            [4, 4, 4, 4, 4, 3, 3, 3, 3, 3, 3, 2, 2, 2, 2, 2],
            [4, 4, 4, 4, 3, 3, 3, 3, 3, 3, 3, 3, 2, 2, 2, 2],
            [4, 4, 4, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 2, 2, 2],
            [4, 4, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 2, 2],
            [4, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 2]
        ],

        TILE_WIDTH:  16,
        TILE_HEIGHT: 16,

        getColors: function (data, x, y) {
            var colors = [];

            colors[1] = this.getPixelXY(data, x + this.TILE_WIDTH / 2, y + this.TILE_HEIGHT / 4);
            colors[2] = this.getPixelXY(data, x + this.TILE_WIDTH - this.TILE_WIDTH / 4, y + this.TILE_HEIGHT / 2);
            colors[3] = this.getPixelXY(data, x + this.TILE_WIDTH / 2, y + this.TILE_HEIGHT - this.TILE_HEIGHT / 4);
            colors[4] = this.getPixelXY(data, x + this.TILE_WIDTH / 4, y + this.TILE_HEIGHT / 2);

            return colors;
        },

        doit: function (data, w, h) {
            var options = this.readOptions();

            this.w = w;
            this.h = h;

            //noinspection JSUnresolvedFunction
            var src = new Uint8ClampedArray(data.data);

            var tilesW = Math.floor(this.w / this.TILE_WIDTH),
                tilesH = Math.floor(this.h / this.TILE_HEIGHT);

            var newW = tilesW * this.TILE_WIDTH;
            var newH = tilesH * this.TILE_HEIGHT;

            src = this.crop(src, 0, 0, newW, newH);

            //noinspection JSUnresolvedFunction
            var out = new Uint8ClampedArray(src.length);

            var pattern = this.pattern,
                colors, x, y, px, py;

            for (x = 0; x < newW + 1; x += this.TILE_WIDTH) {
                for (y = 0; y < newH + 1; y += this.TILE_HEIGHT) {
                    colors = this.getColors(src, x, y);

                    for (px = 0; px < this.TILE_WIDTH; px++) {
                        for (py = 0; py < this.TILE_WIDTH; py++) {
                            if (pattern[py][px]) {
                                this.setPixelXY(
                                    out,
                                    x + px,
                                    y + py,
                                    colors[pattern[py][px]]);
                            }
                        }
                    }
                }
            }

            out = this.applyPost(out, options, tilesW, tilesH);

            return {
                data: out,
                w:    this.w,
                h:    this.h
            };
        }
    });
});