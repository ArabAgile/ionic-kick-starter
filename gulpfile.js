var gulp = require('gulp'),
    gutil = require('gulp-util'),
    bower = require('bower'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    sass = require('gulp-sass'),
    minifyCss = require('gulp-minify-css'),
    coffee = require('gulp-coffee'),
    browserify = require('gulp-browserify'),
    jade = require('gulp-jade'),
    livereload = require('gulp-livereload'),
    lr = require('tiny-lr'),
    server = lr(),
    sh = require('shelljs'),
    env;

env = process.env.NODE_ENV || 'development';

var sourcePaths = {
  _sass: ['_dev/scss/**/*.scss'],
  sass: ['_dev/scss/ionic/ionic.app.scss', '_dev/scss/style.scss'],
  fonts: ['_dev/fonts/**/'],
  jade:   ['_dev/jade/**/*.jade'],
  coffee: ['_dev/coffee/*.coffee'],
  html: ['*.html', '**/*.html'],
  libs:   ['_dev/lib/ionic/js/ionic.bundle.js', 
           '_dev/lib/ionic/js/angular/angular-resource.js', 
           '_dev/lib/ng-cordova/ng-cordova.js', 
           '_dev/lib/parse/parse-1.2.19.js'
          ],
  js: ['_dev/js/*.js']
};

gulp.task('sass', function() {
  gulp.src(sourcePaths.sass)
    .pipe(sass())
    .pipe(concatCss("app.min.css"))
    .pipe(minifyCss({
      keepBreaks: false,
      keepSpecialComments: 0
    }))
    .pipe(gulp.dest('www/css/'))
    .on('error', gutil.log);
});

gulp.task('fonts', function(){  
  return gulp.src(sourcePaths.fonts)
    .pipe(gulp.dest('www/fonts/'))
});

gulp.task('libs', function() {
  gulp.src(sourcePaths.libs)
    // .pipe(concat('libs.js'))
    .pipe(uglify())
    .pipe(gulp.dest('www/libs/'))
    ;
});

gulp.task('coffee', function() {
  gulp.src(sourcePaths.coffee)
    .pipe(coffee({bare: true})
      .on('error', gutil.log))
    .pipe(gulp.dest('_dev/js/'))
    ;
});

gulp.task('js', function() {
  gulp.src(sourcePaths.js)
    .pipe(concat('app.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('www/js/'))
    ;
});


gulp.task('jade', function() {

  gulp.src(sourcePaths.jade)
    .pipe(jade({
      pretty: false
    }))
    .pipe(gulp.dest('www/templates/'))
});

gulp.task('default', ['sass', 'coffee', 'libs', 'js', 'jade', 'fonts', 'watch']);

gulp.task('watch', function() {
  // Second: task name 'sass, js, ...'
  var server = livereload();
  gulp.watch(sourcePaths._sass, ['sass']);
  gulp.watch(sourcePaths.sass, ['sass']);
  gulp.watch(sourcePaths.coffee, ['coffee']);
  gulp.watch(sourcePaths.libs, ['libs']);
  gulp.watch(sourcePaths.jade, ['jade']);
  gulp.watch(sourcePaths.fonts, ['fonts']);
  gulp.watch(sourcePaths.js, ['js']);
  gulp.watch(sourcePaths.html);
});

gulp.task('install', ['git-check'], function() {
  return bower.commands.install()
    .on('log', function(data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});

gulp.task('git-check', function(done) {
  if (!sh.which('git')) {
    console.log(
      '  ' + gutil.colors.red('Git is not installed.'),
      '\n  Git, the version control system, is required to download Ionic.',
      '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
      '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
    );
    process.exit(1);
  }
  done();
});