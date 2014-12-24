var gulp = require('gulp');
var sass = require('gulp-sass');
var watch = require('gulp-watch');
var minifycss = require('gulp-minify-css');
var rename = require('gulp-rename');
var gzip = require('gulp-gzip');
var jshint = require('gulp-jshint');
var livereload = require('gulp-livereload');
var shell = require('gulp-shell');
var webserver = require('gulp-webserver');
var opn = require('opn');

// SERVER OPTIONS
var server = {
    host: 'localhost',
    port: '8001'
}

// GZIP OPTIONS
var gzip_options = {
    threshold: '1kb',
    gzipOptions: {
        level: 9
    }
};

// PROCESSES, MINIFIES, AND GZIPS SASS FILES
gulp.task('sass', function() {
    return gulp.src('css/sass/*.scss')
        .pipe(sass({errLogToConsole: true}))
        .pipe(gulp.dest('css/stylesheets'))
        .pipe(rename({suffix: '.min'}))
        .pipe(minifycss())
        .pipe(gulp.dest('css/stylesheets'))
        .pipe(gzip(gzip_options))
        .pipe(gulp.dest('css/stylesheets'))
        .pipe(livereload());
});

// JAVASCRIPT ERROR CHECKING
gulp.task('lint', function() {
    return gulp.src('js/custom/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

// SERVER LAUNCH
gulp.task('webserver', function() {
    gulp.src( '.' )
        .pipe(webserver({
            host:             server.host,
            port:             server.port,
            livereload:       true,
            directoryListing: false
        }));
});

// OPENS BROWSER TAB TO SERVER
gulp.task('openbrowser', function() {
    opn( 'http://' + server.host + ':' + server.port );
});

// RUNS DJANGO SERVER
// OMIT TO RUN DJANGO SERVER SEPARATELY

//gulp.task('django', shell.task(['. venv/bin/activate && pip install -r requirements.txt && python ./manage.py runserver']));


gulp.task('watch', function() {

    livereload.listen();
    gulp.watch('css/sass/*.scss', ['sass']);
    gulp.watch('js/custom/*.js', ['lint']);

    // TRIGGERS LIVE RELOAD ON HTML FILE CHANGES
    // REQUIRES LIVERELOAD CHROME EXTENSION - https://chrome.google.com/webstore/detail/livereload/
    gulp.watch('**/*.html').on('change', livereload.changed);


});

gulp.task('default', ['sass', 'lint', 'webserver', 'openbrowser', 'watch']);
