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

gulp.task('cacheTemplates', function () {
	return gulp.src('public/partials/**/*.html')
		.pipe(templateCache({
			root: 'partials',
			standalone: true
		}))
		.pipe(gulp.dest('public/js/lib'));
});

gulp.task('bundleScripts', function () {
	return gulp.src('./public/js/lib/main.js')
		.pipe(gulp_jspm())
		.pipe(gulp.dest('./public/js/lib'));
});

gulp.task('css', function () {
	return gulp.src(['./public/css/external/*.css'])
		.pipe(minifyCss())
		.pipe(concat('style.min.css'))
		.pipe(gulp.dest('./public/css/external'));
});

gulp.task('concatVendor', function () {
	return gulp.src(['./public/js/jspm_packages/github/angular/bower-angular@1.4.8/angular.min.js',
			'./public/js/jspm_packages/system.js',
			'./public/js/config.js',
			'./public/js/external/*.js'])
		.pipe(concat('vendor.min.js'))
		.pipe(gulp.dest('./public/js'));
});


gulp.task('buildIndex', function () {
	gulp.src('./public/index.html')
		.pipe(htmlreplace({
			'css': 'css/external/style.min.css',
			'js': 'js/vendor.min.js'
		}))
		.pipe(rename('index-prod.html'))
		.pipe(gulp.dest('./public'));
});
