/* global define */

define("lib/Options", [
    "lib/Filter",
    "lib/Dithering",
    "lib/Triangle"
], function (Filter, Dithering, Triangle) {
    "use strict";

    return {
        options: {
            mirror: {
                name:    "Отражение",
                type:    "Select",
                options: [
                    {text: "Нет"},
                    {text: "По оси X", cb: Filter.flipX},
                    {text: "По оси Y", cb: Filter.flipY},
                    {text: "По оси X и Y", cb: Filter.flipXY}
                ]
            },

            kaleidoscope: {
                name:    "Калейдоскоп",
                type:    "Select",
                options: [
                    {text: "Нет"},
                    {text: "К центру", cb: Filter.kaleidoskopeCenter},
                    {text: "В стороны", cb: Filter.kaleidoskopeOutside},
                    {text: "К центру и в стороны", cb: Filter.kaleidoskopeCenterOutside},
                    {text: "По горизонтали", cb: Filter.kaleidoskopeHoriz},
                    {text: "По вертикали", cb: Filter.kaleidoskopeVert},
                    {text: "Игральная карта", cb: Filter.kaleidoskopeCard}
                ]
            },

            colors: {
                name:    "Цвет",
                type:    "Select",
                options: [
                    {text: "Нет"},
                    {text: "Монохром", cb: Filter.monochrome},
                    {text: "Градации серого", cb: Filter.grayscale},
                    {text: "Сепия", cb: Filter.sepia},
                    {text: "Красный", cb: Filter.red},
                    {text: "Зеленый", cb: Filter.green},
                    {text: "Синий", cb: Filter.blue}
                ]
            },

            brightness: {
                name: "Яркость",
                type: "Slider",
                min:  -1,
                max:  1,
                def:  0,
                step: 0.01
            },

            contrast: {
                name: "Контраст",
                type: "Slider",
                min:  0,
                max:  259,
                def:  0
            },

            hue: {
                name: "Тон",
                type: "Slider",
                min:  -1,
                max:  1,
                def:  0,
                step: 0.01
            },

            saturation: {
                name: "Насыщенность",
                type: "Slider",
                min:  0,
                max:  2,
                def:  0,
                step: 0.01
            },

            threshold: {
                name: "Порог",
                type: "Slider",
                min:  0,
                max:  200,
                def:  0,
                cb:   Filter.threshold
            },

            blur: {
                name: "Размытие",
                type: "Slider",
                min:  0,
                max:  10,
                def:  0,
                step: 0.1
            },

            sharpen: {
                name: "Резкость",
                type: "Slider",
                min:  0,
                max:  10,
                def:  0
            },

            edge: {
                name: "Поиск края",
                type: "Slider",
                min:  0,
                max:  2,
                def:  0
            },

            bump: {
                name: "Выдавливание",
                type: "Slider",
                min:  0,
                max:  1,
                def:  0
            },

            emboss: {
                name: "Рельеф",
                type: "Slider",
                min:  0,
                max:  10,
                def:  0,
                step: 0.1
            },

            sobel: {
                name: "Оператор Собеля",
                type: "Slider",
                min:  0,
                max:  1,
                def:  0
            },

            thin: {
                name: "Контур",
                type: "Slider",
                min:  0,
                max:  2,
                def:  0
            },

            dither: {
                name:    "Дизеринг",
                type:    "Select",
                options: (function () {
                    var options = [
                        {text: "Нет"}
                    ];

                    _.each(Dithering.PALETTE, function (obj, keyP) {
                        var nameP = obj.name;

                        _.each(Dithering.ALGORITHM, function (nameA, keyA) {
                            options.push(
                                {
                                    text: _.format("{0} ({1})", nameP, nameA),
                                    cb:   Filter[_.format("dither{0}_{1}", keyP, keyA)]
                                }
                            );
                        }, this);
                    }, this);

                    return options;
                })()
            },

            pattern: {
                name:    "Паттерн",
                type:    "Select",
                options: (function () {
                    var options = [
                        {text: "Нет"}
                    ];

                    Object.keys(Triangle).forEach(function (k) {
                        options.push(
                            {
                                text:  _.capitalize(k),
                                model: k
                            }
                        );
                    });

                    return options;
                })()
            },

            zhangSuen: {
                name: "Скелет",
                type: "Slider",
                min:  0,
                max:  1,
                def:  0
            },

            invert: {
                name: "Инверсия",
                type: "Slider",
                min:  0,
                max:  1,
                def:  0
            }
        }
    };
});