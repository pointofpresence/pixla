"use strict";

gulp.task("build", function () {
    return $.runSequence([
        "clean",
        "images",
        "babel",
        "less",
        "jade",
        "readme"
    ]);
});