"use strict";

gulp.task("jade", function () {
    var opts = {
        conditionals: true,
        spare:        true,
        empty:        true,
        cdata:        true,
        quotes:       true,
        loose:        false
    };

    return gulp.src(config.root + config.jade + "index.jade")
        .pipe($.jade({
            pretty: !isProd,
            locals: {
                name:               pkg.name || "Unknown",
                title:              pkg.title || "Unknown",
                description:        pkg.description || "Unknown",
                author:             pkg.author || "Unknown",
                repository:         pkg.repository || "Unknown",
                version:            pkg.version || "Unknown",
                lastBuildDateHuman: pkg.lastBuildDateHuman || "Unknown"
            }
        }))
        .on("error", $.notify.onError({
            message: "Jade compile error: <%= error.message %>"
        }))
        .pipe(isProd ? $.minifyHtml(opts) : $.util.noop())
        .pipe(gulp.dest(config.root));
});