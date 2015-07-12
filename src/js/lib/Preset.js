/* global define */

define("lib/Preset", [], function () {
    "use strict";

    return {
        "Fun dithering": {
            "pattern":      5,
            "kaleidoscope": 4
        },

        "Thin": {
            "saturation": 2,
            "colors":     2,
            "brightness": 0.15,
            "contrast":   95,
            "sharpen":    2,
            "zhangSuen":  1
        }
    };
});