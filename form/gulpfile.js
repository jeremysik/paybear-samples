'use strict';
const gulp           = require('gulp');
const sass           = require('gulp-sass');
const cssnano        = require('gulp-cssnano');
const autoprefixer   = require('gulp-autoprefixer');
const browserSync    = require('browser-sync').create();
const sourcemaps     = require('gulp-sourcemaps');
const removeCode     = require('gulp-remove-code');
const rename         = require('gulp-rename');
const environments   = require('gulp-environments');

const development = environments.development;
const production = environments.production;

var config = {
    src: './source/',
    sassPattern: './source/scss/**/*.scss',
    dist: production() ? './build' : './dist',
};

console.log('env', development());

gulp.task('sass', function () {
    return gulp.src(config.sassPattern)
        .pipe(development(sourcemaps.init()))
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 2 version', 'safari 5', 'ie 9', 'opera 12.1', 'ios 6', 'android 4']
        }))
        .pipe(production(cssnano({ zindex: false })))
        .pipe(development(sourcemaps.write()))
        .pipe(rename('paybear.css'))
        .pipe(gulp.dest(config.dist))
        .pipe(browserSync.stream());
});

gulp.task('scripts', function() {
    return gulp.src(config.src + 'js/*.js')
        .pipe(gulp.dest(config.dist))
        .pipe(browserSync.stream());
});

gulp.task('html', function() {
    return gulp.src(config.src + 'index.html')
        .pipe(removeCode({ production: production() }))
        .pipe(production(rename('paybear.html')))
        .pipe(gulp.dest(config.dist));
});

gulp.task('html-watch', ['html'], function (done) {
    browserSync.reload();
    done();
});

gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: config.dist,
        },
    });
});

gulp.task('default', ['browser-sync', 'sass', 'scripts', 'html-watch'], function () {
    gulp.watch(config.sassPattern, ['sass']);
    gulp.watch(config.src + 'js/*.js', ['scripts']);
    gulp.watch(config.src + 'index.html', ['html-watch']);
});

gulp.task('build', ['sass', 'scripts', 'html']);