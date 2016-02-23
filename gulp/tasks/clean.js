"use strict";

var del = require('del');

gulp.task('clean', function () {
    $.util.log('Cleaning up ' + $.chalk.magenta(config.dist) + ' ...');

    return del([
        config.dist + '**/*'
    ]);
});