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

        initialize: function () {
            this.options = _.extend({}, TriangleAbstractModel.prototype.options, {
                kaleidoscope: {
                    name:    "Калейдоскоп",
                    type:    "Select",
                    options: [
                        {text: "Нет"},
                        {text: "К центру", cb: this.centerKaleidoskope},
                        {text: "В стороны", cb: this.outsideKaleidoskope},
                        {text: "К центру и в стороны", cb: this.centerOutsideKaleidoskope},
                        {text: "По горизонтали", cb: this.horizKaleidoskope},
                        {text: "По вертикали", cb: this.vertKaleidoskope},
                        {text: "Игральная карта", cb: this.cardKaleidoskope}
                    ]
                }
            })
        },

        TILE_WIDTH:  16,
        TILE_HEIGHT: 16,

        doit: function (data, w, h) {
            var options = this.readOptions();

            this.w = w;
            this.h = h;

            //noinspection JSUnresolvedFunction
            var out = new Uint8ClampedArray(data.data);

            var tilesW = Math.floor(this.w / this.TILE_WIDTH);
            var tilesH = Math.floor(this.h / this.TILE_HEIGHT);

            var newW = tilesW * this.TILE_WIDTH;
            var newH = tilesH * this.TILE_HEIGHT;

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

            for (var x = 0; x < newW + 1; x += this.TILE_WIDTH) {
                for (var y = 0; y < newH + 1; y += this.TILE_HEIGHT) {
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

            if (options.kaleidoscope
                && this.options.kaleidoscope.options[options.kaleidoscope].cb
                && this.options.kaleidoscope.options[options.kaleidoscope]) {
                out = this.options.kaleidoscope.options[options.kaleidoscope].cb.call(
                    this, out,
                    Math.floor(tilesW / 2) * this.TILE_WIDTH,
                    Math.floor(tilesH / 2) * this.TILE_HEIGHT
                );
            }

            return {
                data: out,
                w:    this.w,
                h:    this.h
            };
        }
    });
});