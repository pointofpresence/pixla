/* global define */

define("lib/Preset", [], function () {
    "use strict";

    return {
        "Fun dithering": {
            "pattern":      5,
            "kaleidoscope": 4
        },

        "Thin": {
            "colors":     2,
            "brightness": 3,
            "sharpen":    2,
            "zhangSuen":  1
        }
    };
});