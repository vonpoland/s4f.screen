var browserSync = require('browser-sync').create();
var gulp = require('gulp');
var mocha = require('gulp-mocha');
var less = require('gulp-less-sourcemap');
var templateCache = require('gulp-angular-templatecache');
var gulp_jspm = require('gulp-jspm');

// Static server
gulp.task('browser-sync', function() {
	browserSync({
		proxy: "localhost:8085"
	});
});

gulp.task('test:unit', function () {
    return gulp.src('test/unit/**/*.spec.js', {read: false})
        .pipe(mocha({reporter: 'nyan'}));
});

gulp.task('less', function () {
    gulp.src('./public/css/*.less')
        .pipe(less())
        .pipe(gulp.dest('./public/css'));
});

gulp.task('cacheTemplates', function () {
    return gulp.src('public/partials/**/*.html')
        .pipe(templateCache({
	        root: 'partials',
	        standalone: true
        }))
        .pipe(gulp.dest('public/js/lib'));
});

gulp.task('bundleScripts', function() {
	return gulp.src('./public/js/lib/main.js')
		.pipe(gulp_jspm())
		.pipe(gulp.dest('./public/js/lib'));
});