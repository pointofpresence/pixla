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
            description: "Triangle Cross Filter"
        }),

        options: _.extend({}, TriangleAbstractModel.prototype.options, {}),

        TILE_WIDTH:  16,
        TILE_HEIGHT: 16,

        doit: function (data, w, h) {
            this.w = w;
            this.h = h;

            var out = new Uint8ClampedArray(data.data);

            var tiles_w = parseInt(this.w / this.TILE_WIDTH);
            var tiles_h = parseInt(this.h / this.TILE_HEIGHT);

            var new_w = tiles_w * this.TILE_WIDTH;
            var new_h = tiles_h * this.TILE_HEIGHT;

            var pattern = [
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
            ];

            for (var x = 0; x < new_w + 1; x += this.TILE_WIDTH) {
                for (var y = 0; y < new_h + 1; y += this.TILE_HEIGHT) {
                    var colors = [];

                    colors[1] = this.getPixelXY(data.data, x + this.TILE_WIDTH / 2, y + this.TILE_HEIGHT / 4);
                    colors[2] = this.getPixelXY(data.data, x + this.TILE_WIDTH - this.TILE_WIDTH / 4, y + this.TILE_HEIGHT / 2);
                    colors[3] = this.getPixelXY(data.data, x + this.TILE_WIDTH / 2, y + this.TILE_HEIGHT - this.TILE_HEIGHT / 4);
                    colors[4] = this.getPixelXY(data.data, x + this.TILE_WIDTH / 4, y + this.TILE_HEIGHT / 2);

                    for (var px = 0; px < this.TILE_WIDTH; px++) {
                        for (var py = 0; py < this.TILE_WIDTH; py++) {
                            if (pattern[py][px]) {
                                this.setPixelXY(out, x + px, y + py, colors[pattern[py][px]]);
                            }
                        }
                    }
                }
            }

            return out;
        }
    });
});