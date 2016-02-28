'use strict';

gulp.task('build:prod', function () {
    global.isProd = true;

    return $.runSequence('build');
});

gulp.task('build', function () {
    return $.runSequence(
        ['clean'],
        ['images'],
        ['fonts'],
        ['babel'],
        ['less'],
        ['jade'],
        ['readme']
    );
});