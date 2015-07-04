/**
 * @module models/TriangleStart
 */
define("models/TriangleStart", [
    "backbone",
    "underscore",
    "models/TriangleAbstract"
], function (Backbone, _, TriangleAbstractModel) {
    "use strict";

    return TriangleAbstractModel.extend({
        defaults: _.extend({}, TriangleAbstractModel.prototype.defaults, {
            name:        "Тождество",
            description: "Start Filter",
            sort:        0
        }),

        getColors: function (data, x, y) {
            var colors = [];

            colors[1] = this.getPixelXY(data, x + this.TILE_WIDTH / 2, y + this.TILE_HEIGHT / 4);
            colors[2] = this.getPixelXY(data, x + this.TILE_WIDTH - this.TILE_WIDTH / 4, y + this.TILE_HEIGHT / 2);
            colors[3] = this.getPixelXY(data, x + this.TILE_WIDTH / 2, y + this.TILE_HEIGHT - this.TILE_HEIGHT / 4);
            colors[4] = this.getPixelXY(data, x + this.TILE_WIDTH / 4, y + this.TILE_HEIGHT / 2);

            return colors;
        },

        postKaleidoscope: function (options, out) {
            if (options.kaleidoscope
                && this.options.kaleidoscope.options[options.kaleidoscope].cb
                && this.options.kaleidoscope.options[options.kaleidoscope]) {
                out = this.options.kaleidoscope.options[options.kaleidoscope].cb.call(
                    this, out,
                    Math.floor(this.w / 2),
                    Math.floor(this.h / 2)
                );
            }

            return out;
        },

        doit: function (data, w, h) {
            var options = this.readOptions();

            this.w = w;
            this.h = h;

            var out = this.applyPost(data.data, options);

            return {
                data: out,
                w:    this.w,
                h:    this.h
            };
        }
    });
});