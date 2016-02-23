"use strict";

gulp.task("build", function () {
    return $.runSequence([
        "images",
        "babel",
        "less",
        "jade",
        "readme"
    ]);
});