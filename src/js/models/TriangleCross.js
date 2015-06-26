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
                },
                colors:       {
                    name:    "Цвет",
                    type:    "Select",
                    options: [
                        {text: "Нет"},
                        {text: "Монохром", cb: this.monochrome},
                        {text: "Градации серого", cb: this.grayscale},
                        {text: "Сепия", cb: this.sepia},
                        {text: "Красный", cb: this.red},
                        {text: "Зеленый", cb: this.green},
                        {text: "Синий", cb: this.blue}
                    ]
                },
                brightness:   {
                    name: "Яркость",
                    type: "Slider",
                    min:  0,
                    max:  200,
                    cb:   this.brightness
                },
                threshold:    {
                    name: "Порог",
                    type: "Slider",
                    min:  0,
                    max:  200,
                    cb:   this.threshold
                },
                blur:         {
                    name: "Размытие",
                    type: "Slider",
                    min:  0,
                    max:  3
                },
                sharpen:      {
                    name: "Резкость",
                    type: "Slider",
                    min:  0,
                    max:  10
                },
                edge: {
                    name: "Поиск края",
                    type: "Slider",
                    min:  0,
                    max:  2
                },
                emboss: {
                    name: "Рельеф",
                    type: "Slider",
                    min:  0,
                    max:  2
                },
                sobel:  {
                    name: "Оператор Собеля",
                    type: "Slider",
                    min:  0,
                    max:  1
                },
                thin:   {
                    name: "Контур",
                    type: "Slider",
                    min:  0,
                    max:  1
                },
                invert: {
                    name: "Инверсия",
                    type: "Slider",
                    min:  0,
                    max:  1
                }
            })
        },

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

            if (options.kaleidoscope
                && this.options.kaleidoscope.options[options.kaleidoscope].cb
                && this.options.kaleidoscope.options[options.kaleidoscope]) {
                out = this.options.kaleidoscope.options[options.kaleidoscope].cb.call(
                    this, out,
                    Math.floor(tilesW / 2) * this.TILE_WIDTH,
                    Math.floor(tilesH / 2) * this.TILE_HEIGHT
                );
            }

            if (options.colors
                && this.options.colors.options[options.colors].cb
                && this.options.colors.options[options.colors]) {
                out = this.options.colors.options[options.colors].cb.call(this, out);
            }

            if (parseInt(options.brightness)
                && this.options.brightness.cb) {
                out = this.options.brightness.cb.call(this, out, parseInt(options.brightness));
            }

            if (parseInt(options.threshold)
                && this.options.threshold.cb) {
                out = this.options.threshold.cb.call(this, out, parseInt(options.threshold));
            }

            if (parseInt(options.blur)) {
                var bFac = parseInt(options.blur) + 7;

                out = this.convolute(out, this.w, this.h, [
                    1 / bFac, 1 / bFac, 1 / bFac,
                    1 / bFac, 1 / bFac, 1 / bFac,
                    1 / bFac, 1 / bFac, 1 / bFac
                ]);
            }

            if (parseInt(options.sharpen)) {
                var sFac = parseInt(options.sharpen),
                    sMtx = [];

                if (sFac < 2) {
                    sFac += 4;
                    sMtx = [
                        0, -1, 0,
                        -1, sFac, -1,
                        0, -1, 0
                    ];
                } else {
                    sFac += 7;

                    sMtx = [
                        -1, -1, -1,
                        -1, sFac, -1,
                        -1, -1, -1
                    ];
                }

                out = this.convolute(out, this.w, this.h, sMtx);
            }

            if (parseInt(options.edge)) {
                var edFac = parseInt(options.edge),
                    edMtx = [];

                switch (edFac) {
                    case 1:
                        edMtx = [
                            1, 1, 1,
                            1, -7, 1,
                            1, 1, 1
                        ];

                        break;
                    case 2:
                        edMtx = [
                            -5, 0, 0,
                            0, 0, 0,
                            0, 0, 5
                        ];

                        break;
                }

                out = this.convolve3x3(out, this.w, edMtx);
            }

            if (parseInt(options.emboss)) {
                var eFac = parseInt(options.emboss),
                    eMtx = [];

                switch (eFac) {
                    case 1:
                        eMtx = [
                            1, 1, -1,
                            1, 3, -1,
                            1, -1, -1
                        ];

                        break;
                    case 2:
                        eMtx = [
                            2, 0, 0,
                            0, -1, 0,
                            0, 0, -1
                        ];

                        break;
                }

                out = this.convolve3x3(out, this.w, eMtx);
            }

            if (parseInt(options.sobel)) {
                out = this.sobel(out, this.w);
            }

            if (parseInt(options.thin)) {
                out = this.convolute(out, this.w, this.h, [
                    1, 1, 1,
                    1, -7, 1,
                    1, 1, 1
                ]);
            }

            if (parseInt(options.invert)) {
                out = this.invert(out);
            }

            return {
                data: out,
                w:    this.w,
                h:    this.h
            };
        }
    });
});