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
var exec = require('child_process').exec;
var bigscreenChannel = require('config').bigscreenChannel;

// Static server
gulp.task('browser-sync', function () {
	browserSync({
		proxy: "localhost:8085"
	});
});

gulp.task('test:unit:frontend', function (cb) {
	exec('mocha test/unit/frontend/**/*.spec.js --compilers js:babel-core/register --reporter mocha-jenkins-reporter --reporter-options junit_report_path=frontend.xml', function (err, stdout, stderr) {
		console.log(stdout);
		console.log(stderr);
		cb(err);
	});
});

gulp.task('test:unit:backend', function () {
	return gulp.src('test/unit/backend/**/*.spec.js', {read: false})
        .pipe(mocha({
            'reporter': 'mocha-jenkins-reporter',
            'reporterOptions': {
                'junit_report_name': 'Tests',
                'junit_report_path': 'backend.xml',
                'junit_report_stack': 1
            }
        }));
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
		.pipe(gulp_jspm({
			minify: true,
			mangle: false
		}))
		.pipe(gulp.dest('./public/js/lib'));
});

gulp.task('concatProjectorScripts', function () {
	return gulp.src(['./public/js/external/lodash.min.js',
			'./public/js/system-polyfills.js',
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
			'js': 'js/projector.min.js',
			'conf': {
				src: [[bigscreenChannel]],
				tpl: '<script>window.conf = { socketChannel: "%s" }</script>'
			}
		}))
		.pipe(rename('index-projector-production.html'))
		.pipe(gulp.dest('./public'));
});

gulp.task('css', ['cssApp']);
gulp.task('bundleScripts', ['bundleScriptsProjector']);
gulp.task('concatScripts', ['concatProjectorScripts']);
gulp.task('buildIndex', ['buildProjectorIndex']);
gulp.task('default', done => runSequence('less', 'cacheTemplates', 'bundleScripts', 'concatScripts', 'css', 'buildIndex', done));