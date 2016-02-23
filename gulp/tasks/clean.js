"use strict";

var del = require('del');

gulp.task('clean', function () {
    return del([
        config.dist + '**/*'
    ]);
});