var gulp = require('gulp');
var mocha = require('gulp-mocha');

gulp.task('test:unit', function () {
    return gulp.src('test/unit/**/*.spec.js', {read: false})
        .pipe(mocha({reporter: 'nyan'}));
});