var gulp = require('gulp');
var sass = require('gulp-sass');
var plumber = require('gulp-plumber');
var watch = require('gulp-watch');
var minifycss = require('gulp-minify-css');
var rename = require('gulp-rename');
var gzip = require('gulp-gzip');
var jshint = require('gulp-jshint');
var livereload = require('gulp-livereload');
var shell = require('gulp-shell');
var webserver = require('gulp-webserver');
var opn = require('opn');

var server = {
    host: 'localhost',
    port: '8001'
}

var gzip_options = {
    threshold: '1kb',
    gzipOptions: {
        level: 9
    }
};

//minify and gzip processed sass files
gulp.task('sass', function() {
    return gulp.src('css/sass/*.scss')
        .pipe(plumber())
        .pipe(sass())
        .pipe(gulp.dest('css/stylesheets'))
        .pipe(rename({suffix: '.min'}))
        .pipe(minifycss())
        .pipe(gulp.dest('css/stylesheets'))
        .pipe(gzip(gzip_options))
        .pipe(gulp.dest('css/stylesheets'))
        .pipe(livereload());
});

gulp.task('lint', function() {
    return gulp.src('js/custom/*.js')
        .pipe(plumber())
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

gulp.task('webserver', function() {
    gulp.src( '.' )
        .pipe(webserver({
            host:             server.host,
            port:             server.port,
            livereload:       true,
            directoryListing: false
        }));
});

gulp.task('openbrowser', function() {
    opn( 'http://' + server.host + ':' + server.port );
});

//run django server
//omit to run django server separately - must also remove reference in default task below
//gulp.task('django', shell.task(['. venv/bin/activate && pip install -r requirements.txt && python ./manage.py runserver']));


//watch function assigns folders/file types to watch and calls task function
gulp.task('watch', function() {

    livereload.listen();
    gulp.watch('css/sass/*.scss', ['sass']);

    //trigger livereload on html file changes
    //will automatically refresh your browser on alterations to html files
    //requires livereload chrome extension to use - https://chrome.google.com/webstore/detail/livereload/jnihajbhpnppcggbcgedagnkighmdlei?hl=en
    gulp.watch('**/*.html').on('change', livereload.changed);


});

gulp.task('default', ['sass', 'lint', 'webserver', 'openbrowser', 'watch']);
