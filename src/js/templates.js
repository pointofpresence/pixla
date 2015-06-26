define("templates", function (require) {
    "use strict";

    return {
        OptionsTitle: require("tpl!templates/OptionsTitle.ejs"),

        options: {
            Select: require("tpl!templates/options/Select.ejs"),
            Slider: require("tpl!templates/options/Slider.ejs")
        }
    };
});