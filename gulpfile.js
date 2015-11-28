var gulp = require('gulp');
var mocha = require('gulp-mocha');
var less = require('gulp-less-sourcemap');

gulp.task('test:unit', function () {
    return gulp.src('test/unit/**/*.spec.js', {read: false})
        .pipe(mocha({reporter: 'nyan'}));
});

gulp.task('less', function () {
    gulp.src('./public/css/*.less')
        .pipe(less())
        .pipe(gulp.dest('./public/css'));
});