var browserSync = require('browser-sync').create();
var gulp = require('gulp');
var mocha = require('gulp-mocha');
var less = require('gulp-less-sourcemap');
var templateCache = require('gulp-angular-templatecache');
var gulp_jspm = require('gulp-jspm');
var minifyCss = require('gulp-minify-css');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var htmlreplace = require('gulp-html-replace');
var runSequence = require('run-sequence');

// Static server
gulp.task('browser-sync', function () {
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

gulp.task('cssApp', function () {
	return gulp.src(['./public/css/*.css'])
		.pipe(minifyCss())
		.pipe(concat('app.min.css'))
		.pipe(gulp.dest('./public/css/dist'));
});

gulp.task('cacheTemplates', function () {
	return gulp.src('public/partials/**/*.html')
		.pipe(templateCache({
			root: 'partials',
			standalone: true
		}))
		.pipe(gulp.dest('public/js/lib'));
});

gulp.task('bundleScriptsProjector', function () {
	return gulp.src('./public/js/lib/projector.js')
		.pipe(gulp_jspm())
		.pipe(gulp.dest('./public/js/lib'));
});

gulp.task('concatProjectorScripts', function () {
	return gulp.src(['./public/js/external/lodash.min.js',
			'./public/js/jspm_packages/system.js',
			'./public/js/config.js',
			'./public/js/lib/projector.bundle.js'])
		.pipe(concat('projector.min.js'))
		.pipe(gulp.dest('./public/js'));
});

gulp.task('buildProjectorIndex', function () {
	gulp.src('./public/index-projector.html')
		.pipe(htmlreplace({
			'css': 'css/dist/app.min.css',
			'js': 'js/lib/projector.bundle.js'
		}))
		.pipe(rename('index-projector-production.html'))
		.pipe(gulp.dest('./public'));
});

gulp.task('css', ['cssApp']);
gulp.task('bundleScripts', ['bundleScriptsProjector']);
gulp.task('buildIndex', ['buildProjectorIndex']);
gulp.task('default', done => runSequence('less', 'css', 'cacheTemplates', 'bundleScripts', 'buildIndex', done));