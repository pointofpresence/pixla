/**
 * @module lib/Processor
 */
define("lib/Processor", [
    "backbone",
    "underscore",
    "lib/Filter",
    "lib/Storage",
    "lib/Triangle",
    "lib/Options",
    "lib/Mixin"
], function (Backbone, _, Filter, Storage, Triangle, Options) {
    "use strict";

    //noinspection JSValidateJSDoc,JSUnusedGlobalSymbols
    return {
        w: 0,
        h: 0,

        /**
         * @param {ImageData} imageData
         * @param {number} w
         * @param {number} h
         */
        doit: function (imageData, w, h) {
            //TODO: remove w & h arguments

            this.filter = Storage.getFilter();
            this.options = Options.options;
            this.data = imageData.data;
            this.w = w;
            this.h = h;

            this.applyPost();

            return {
                data: this.data,
                w:    this.w,
                h:    this.h
            };
        },

        /**
         * @returns {void}
         */
        applyPost: function () {
            if (Object.getOwnPropertyNames(this.filter).length === 0) {
                return;
            }

            _.each(Object.keys(this.filter), function (key) {
                this["post" + _.capitalize(key)](this.filter[key]);
            }, this);
        },

        /**
         * @param {string} filter
         */
        postMirror: function (filter) {
            if (parseInt(filter)
                && this.options.mirror.options[filter].cb
                && this.options.mirror.options[filter]) {
                this.data = this.options.mirror.options[filter]
                    .cb.call(Filter, this.data, this.w, this.h);
            }
        },

        /**
         * @param {string} filter
         */
        postInvert: function (filter) {
            if (parseInt(filter)) {
                this.data = Filter.invert(this.data);
            }
        },

        /**
         * @param {string} filter
         */
        postDither: function (filter) {
            if (parseInt(filter)
                && this.options.dither.options[filter].cb
                && this.options.dither.options[filter]) {
                this.data = this.options.dither.options[filter].cb.call(
                    this, this.data, this.w, this.h
                );
            }
        },

        /**
         * @param {string} filter
         */
        postThin: function (filter) {
            if (parseInt(filter)) {
                this.data = Filter.convolute(this.data, this.w, this.h, [
                    1, 1, 1,
                    1, -7, 1,
                    1, 1, 1
                ]);
            }
        },

        /**
         * @param {string} filter
         */
        postZhangSuen: function (filter) {
            if (parseInt(filter)) {
                this.data = Filter.zhangSuen(this.data, this.w, this.h);
            }
        },

        /**
         * @param {string} filter
         */
        postSobel: function (filter) {
            if (parseInt(filter)) {
                this.data = Filter.sobel(this.data, this.w);
            }
        },

        /**
         * @param {string} filter
         */
        postEmboss: function (filter) {
            if (parseInt(filter)) {
                var eFac = parseInt(filter),
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

                this.data = Filter.convolve3x3(this.data, this.w, eMtx);
            }
        },

        /**
         * @param {string} filter
         */
        postEdge: function (filter) {
            if (parseInt(filter)) {
                var edFac = parseInt(filter),
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

                this.data = Filter.convolve3x3(this.data, this.w, edMtx);
            }
        },

        /**
         * @param {string} filter
         */
        postSharpen: function (filter) {
            if (parseInt(filter)) {
                var sFac = parseInt(filter),
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

                this.data = Filter.convolute(this.data, this.w, this.h, sMtx);
            }
        },

        /**
         * @param {string} filter
         */
        postPattern: function (filter) {
            if (parseInt(filter)
                && this.options.pattern.options[filter]
                && this.options.pattern.options[filter].model) {
                var model = Triangle[this.options.pattern.options[filter].model](),
                    data = model.doit(this.data, this.w, this.h);

                this.data = data.data;
                this.w = data.w;
                this.h = data.h;
            }
        },

        /**
         * @param {string} filter
         */
        postBlur: function (filter) {
            if (parseInt(filter)) {
                var bFac = parseInt(filter) + 7;

                this.data = Filter.convolute(this.data, this.w, this.h, [
                    1 / bFac, 1 / bFac, 1 / bFac,
                    1 / bFac, 1 / bFac, 1 / bFac,
                    1 / bFac, 1 / bFac, 1 / bFac
                ]);
            }
        },

        /**
         * @param {string} filter
         */
        postThreshold: function (filter) {
            if (parseInt(filter)
                && this.options.threshold.cb) {
                this.data = this.options.threshold.cb.call(
                    this, this.data, parseInt(filter)
                );
            }
        },

        /**
         * @param {string} filter
         */
        postContrast: function (filter) {
            if (parseInt(filter) && Filter.contrast) {
                this.data = Filter.contrast(
                    this.data, parseInt(filter)
                );
            }
        },

        /**
         * @param {string} filter
         */
        postBrightness: function (filter) {
            if (parseInt(filter)
                && this.options.brightness.cb) {
                this.data = this.options.brightness.cb.call(
                    this, this.data, parseInt(filter)
                );
            }
        },

        /**
         * @param {string} filter
         */
        postColors: function (filter) {
            if (parseInt(filter)
                && this.options.colors.options[filter].cb
                && this.options.colors.options[filter]) {
                this.data = this.options.colors.options[filter].cb.call(
                    this, this.data
                );
            }
        },

        /**
         * @param {string} filter
         */
        postKaleidoscope: function (filter) {
            if (parseInt(filter)
                && this.options.kaleidoscope.options[filter].cb
                && this.options.kaleidoscope.options[filter]) {
                this.data = this.options.kaleidoscope.options[filter].cb.call(
                    Filter, this.data, this.w, this.h
                );
            }
        }
    }
});