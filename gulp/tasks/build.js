"use strict";

gulp.task("build", function () {
    return $.runSequence(
        "clean",
        [
            "images",
            "fonts",
            "babel",
            "less",
            "jade",
            "readme"
        ]
    );
});