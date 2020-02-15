//Gulp configuration

var gulp = require('gulp'),
	sass = require('gulp-sass'),
	autoprefixer = require('gulp-autoprefixer'),
	watch = require('gulp-watch'),
	imagemin = require('gulp-imagemin'),
	newer = require('gulp-newer'),
	browserify = require('gulp-browserify'),
	browserSync = require('browser-sync').create()
	htmlclean = require('gulp-htmlclean')

gulp.task('browserSync', (done)=> {
	browserSync.init({
		server:
		{
			baseDir:'./dist'
        }
	})
	done()
})

// Run scss files through autofixer
gulp.task('sass', (done)=> {
	gulp.src('src/sass/**/*.scss')
		.pipe(sass())
		.pipe(autoprefixer())
        .pipe(gulp.dest('dist/css'))
	done()
	
})
// Bundle js files for production
gulp.task('bundle', (done)=>
{
	gulp.src('src/js/bundle.js')
		.pipe(browserify())
		.pipe(gulp.dest('dist/js'))
	done();
})

// Compress images for productions 
gulp.task('images', (done)=> 
{
	
	gulp.src('src/img/*')
		.pipe(newer('dist/img/'))
		.pipe(imagemin({optimizationLevel: 5}))
		.pipe(gulp.dest('dist/img'));
		done();
})
// Clean HTML files
gulp.task('html', (done)=>
{
	gulp.src('./src/*.html')
	.pipe(newer('dist/'))
	.pipe(htmlclean())
	.pipe(gulp.dest('dist/'))
	done();
})
gulp.task('json', (done)=>
{
	
	gulp.src('./src/**/*.json')
	.pipe(newer('dist/'))
	.pipe(gulp.dest('dist/'))
	done();

})

gulp.task('watch', gulp.series('sass', (done)=>
{
	browserSync.init({
		server:
		{
			baseDir:'./dist'
        }
	});
	//gulp.watch( 'js/**/*.js', 'sass/**/*.scss', 'src/**/*.html', 'json/**/*.json' , gulp.series('sass','bundle','images', 'html', 'json'))
	gulp.watch( 'sass/**/*.scss',  gulp.series('sass'))
	gulp.watch( 'js/**/*.js',  gulp.series('bundle'))
	gulp.watch( 'src/**/*.html',  gulp.series('html'))
	gulp.watch( 'json/**/*.json',  gulp.series('json'))
	done();
}))

gulp.task('run',  gulp.series('watch'))

gulp.task('default', gulp.series('run'))





