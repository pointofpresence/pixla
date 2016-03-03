import Backbone from 'backbone';
import _        from 'lodash';
import Triangle from './Triangle';
import Mixin    from './Mixin';
import Options  from './Options';
import Filter   from './Filter';

_.mixin(Mixin);

export default {
    w: 0,
    h: 0,

    /**
     * @param {ImageData} imageData
     * @param filter
     */
    doit: function (imageData, filter) {
        this.filter  = filter;
        this.options = Options.options;
        this.data    = imageData.data;
        this.w       = imageData.width;
        this.h       = imageData.height;

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
    postBorder: function (filter) {
        if (parseInt(filter)) {
            this.data = Filter.border(this.data, this.w, this.h, parseInt(filter));
        }
    },

    /**
     * @param {string} filter
     */
    postSaturation: function (filter) {
        if (parseFloat(filter)) {
            this.data = Filter.saturation(
                this.data, this.w, this.h, parseFloat(filter)
            );
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
            switch (parseInt(filter)) {
                case 1:
                    this.data = Filter.convolute(this.data, this.w, this.h, [
                        1, 1, 1,
                        1, -7, 1,
                        1, 1, 1
                    ]);

                    break;

                default:
                    this.data = Filter.emboss(
                        this.data, this.w, this.h, 5, 180, 90
                    );
            }
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
        if (parseFloat(filter)) {
            this.data = Filter.emboss(
                this.data, this.w, this.h, parseFloat(filter)
            );
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
                        //@formatter:off
                        1,  1, 1,
                        1, -7, 1,
                        1,  1, 1
                        //@formatter:on
                    ];

                    break;
                case 2:
                    edMtx = [
                        //@formatter:off
                        -5, 0, 0,
                         0, 0, 0,
                         0, 0, 5
                        //@formatter:on
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
            let sFac = parseInt(filter),
                sMtx = [];

            if (sFac < 2) {
                sFac += 4;
                sMtx = [
                    //@formatter:off
                     0,   -1,  0,
                    -1, sFac, -1,
                     0,   -1,  0
                    //@formatter:on
                ];
            } else {
                sFac += 7;

                sMtx = [
                    //@formatter:off
                    -1,   -1, -1,
                    -1, sFac, -1,
                    -1,   -1, -1
                    //@formatter:on
                ];
            }

            this.data = Filter.convolute(this.data, this.w, this.h, sMtx);
        }
    },

    /**
     * @param {string} filter
     */
    postBump: function (filter) {
        if (parseInt(filter)) {
            this.data = Filter.convolve3x3(this.data, this.w, [
                //@formatter:off
                -1, -1, 0,
                -1,  1, 1,
                 0,  1, 1
                //@formatter:on
            ]);
        }
    },

    /**
     * @param {string} filter
     */
    postPattern: function (filter) {
        if (parseInt(filter)
            && this.options.pattern.options[filter]
            && this.options.pattern.options[filter].model) {
            let model = Triangle[this.options.pattern.options[filter].model](),
                data  = model.doit(this.data, this.w, this.h);

            this.data = data.data;
            this.w    = data.w;
            this.h    = data.h;
        }
    },

    /**
     * @param {string} filter
     */
    postBlur: function (filter) {
        if (parseFloat(filter)) {
            this.data = Filter.blur(this.data, this.w, this.h, parseFloat(filter));
        }
    },

    /**
     * @param {string} filter
     */
    postThreshold: function (filter) {
        if (parseInt(filter) && this.options.threshold.cb) {
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
    postHue: function (filter) {
        if (parseFloat(filter) && Filter.hue) {
            this.data = Filter.hue(
                this.data, this.w, this.h, parseFloat(filter)
            );
        }
    },

    /**
     * @param {string} filter
     */
    postBrightness: function (filter) {
        if (parseFloat(filter) && Filter.brightness) {
            this.data = Filter.brightness(
                this.data, this.w, this.h, parseFloat(filter)
            );
        }
    },

    /**
     * @param {string} filter
     */
    postColors: function (filter) {
        if (parseInt(filter)
            && this.options.colors.options[filter]
            && this.options.colors.options[filter].cb) {
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
            && this.options.kaleidoscope.options[filter]
            && this.options.kaleidoscope.options[filter].cb) {
            this.data = this.options.kaleidoscope.options[filter].cb.call(
                Filter, this.data, this.w, this.h
            );
        }
    }
}