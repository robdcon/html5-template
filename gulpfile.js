//Gulp configuration

var gulp = require('gulp'),
	sass = require('gulp-sass'),
	concat = require('gulp-concat'),
	replace = require('gulp-replace'),
	cssNano = require('gulp-cssnano');
	sourcemaps = require('gulp-sourcemaps'),
	postcss = require('gulp-postcss'),
	uglify = require('gulp-uglify'),
	autoprefixer = require('gulp-autoprefixer'),
	watch = require('gulp-watch'),
	imagemin = require('gulp-imagemin'),
	newer = require('gulp-newer'),
	browserify = require('browserify'),
	browserSync = require('browser-sync').create()
	htmlclean = require('gulp-htmlclean')

const filePaths = {
	scssPath : 'src/sass/**/*.scss',
	jsPath : 'src/js/bundle.js',
	imgPath : 'src/img/*',
	htmlPath : 'src/img/*',
	jsonPath : './src/**/*.json'
}

function browserSyncTask() {

	browserSync.init({
		server:
		{
			baseDir:'./dist'
		}
	})
}

// // Run scss files through autofixer
function sassTask() {

	return gulp.src(filePaths.scssPath)
	.pipe(sass())
	.pipe(sourcemaps.init())
	// .pipe(postcss([autoprefixer(), cssNano() ]))
	.pipe(autoprefixer())
	.pipe(sourcemaps.write('.'))
	.pipe(gulp.dest('dist/css'))
}

// Bundle js files for production
function scriptTask() {

	return gulp.src(filePaths.jsPath)
		.pipe(concat('all.js'))
		.pipe(uglify())
		.pipe(gulp.dest('dist/js'))
}

// Compress images for productions 
function imageTask() {

	return gulp.src(filePaths.imgPath)
		.pipe(newer('dist/img/'))
		.pipe(imagemin({optimizationLevel: 5}))
		.pipe(gulp.dest('dist/img'));

}

// Clean HTML files
function htmlTask() {

	return gulp.src(filePaths.htmlPath)
		.pipe(newer('dist/'))
		.pipe(htmlclean())
		.pipe(gulp.dest('dist/'))

}

// Update json files
function jsonTask() {

	return gulp.src(filePaths.jsonPath)
		.pipe(newer('dist/'))
		.pipe(gulp.dest('dist/'))

}

// Cach Buster to append time string to js and css files
const cbString = new Date().getTime();
function cacheBuster() {
	return src(['index.html'])
	.pipe(replace(/cb=\d+/g, 'cb=' + cbString))
	.pipe(gulp.dest('.'))
}

function watchTasks() {
	watch([filePaths.jsPath, filePaths.scssPath, filePaths.htmlPath, filePaths.imgPath, filePaths.jsonPath],
	gulp.parallel(scriptTask, sassTask, htmlTask, jsonTask, browserSyncTask));
}

exports.default = gulp.series(
	gulp.parallel(scriptTask, sassTask, htmlTask, imageTask, jsonTask, browserSyncTask),
	watchTasks
);





