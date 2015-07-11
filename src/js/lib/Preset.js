/* global define */

define("lib/Preset", [], function () {
    "use strict";

    return {
        "Fun dithering": {
            "pattern":      5,
            "kaleidoscope": 4
        },

        "Thin": {
            "colors":     4,
            "brightness": 10,
            "contrast":   75,
            "sharpen":    2,
            "zhangSuen":  1
        }
    };
});