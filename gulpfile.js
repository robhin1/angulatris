/**
 * Gulpfile to make my life easier.
 */

var gulp = require('gulp');
var browserify = require('browserify');
var babelify = require('babelify');
var source = require('vinyl-source-stream');
var gutil = require('gulp-util');
var sass = require('gulp-sass');
var livereload = require('gulp-livereload');
var http = require('http');
var st = require('st');
    
// Lets bring es6 to es5 with this.
// Babel - converts ES6 code to ES5 - however it doesn't handle imports.
// Browserify - crawls your code for dependencies and packages them up
// into one file. can have plugins.
// Babelify - a babel plugin for browserify, to make browserify
// handle es6 including imports.
gulp.task('es6', function() {
    browserify({
        entries: './www/js/app.js',
        debug: false
        ,sourceType: 'module'
    })
        .transform(babelify, {presets: ["es2015"]})
        .on('error',gutil.log)
        .bundle()
        .on('error',gutil.log)
        .pipe(source('./www/output/bundle.js'))
        .pipe(gulp.dest(''))
        .pipe(livereload());
});

gulp.task('sass', function () {
    gulp.src('./www/css/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./www/output/'))
        .pipe(livereload());
});

gulp.task('server', function(done) {
    http.createServer(
        st({ path: __dirname + '/www', index: 'index.html', cache: false })
    ).listen(8080, done);
});

gulp.task('watch',function() {
    livereload.listen();
    gulp.watch('./www/js/**/*.js',['es6'])
    gulp.watch('./www/index.html',['es6'])
    gulp.watch('./www/css/**/*.scss',['sass'])
});

gulp.task('default', ['server', 'watch']);
