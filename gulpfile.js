'use strict';

// variables
var gulp = require('gulp');
var gutil = require('gulp-util');
var path = require('path');

var jshint = require('gulp-jshint');
var csslint = require('gulp-csslint');

var jade = require('gulp-jade');

var lazypipe = require('lazypipe');
var merge = require('merge-stream');

var uglify = require('gulp-uglify');
var minifyCss = require('gulp-minify-css');

var embedlr = require('gulp-embedlr');
var livereload = require('gulp-livereload');

var globs = {
  jade: './templates/index.jade',
  css: './css/**/*.css',
  js: './js/**/*.js',
  img: './img/**/*.{png,gif,jpg,jpeg}',

  dest: './dist/'
};

// tasks
gulp.task('index:lr', function() {
  return gulp.src(globs.jade)
    .pipe(jadeTasks())
    .pipe(embedlr())
    .pipe(gulp.dest('./'));
});

gulp.task('index', function() {
  return gulp.src(globs.jade)
    .pipe(jadeTasks())
    .pipe(gulp.dest('./'));
});

gulp.task('default', ['index:lr', 'watch', 'lint'], function() {

  var EXPRESS_PORT = 5000;
  var LIVERELOAD_PORT = 35729;

  livereload.listen(LIVERELOAD_PORT);

  var express = require('express');
  var app = express();

  var logger = require('morgan');

  app.set('port', EXPRESS_PORT);
  app.use(logger('dev'));
  app.use(require('connect-livereload')());
  app.use(express.static(__dirname));

  app.listen(app.get('port'), function() {
    gutil.log('Express server listening on: ', gutil.colors.magenta(5000) + '\n');
  });

});

gulp.task('build', ['index'], function() {

  var css = gulp.src(globs.css)
    .pipe(minifyCss())
    .pipe(gulp.dest(globs.dest + 'css'));

  var js = gulp.src(globs.js)
    .pipe(uglify())
    .pipe(gulp.dest(globs.dest + 'js'));

  var images = gulp.src(globs.img)
    .pipe(gulp.dest(globs.dest + 'img'));

  var other = gulp.src(['./index.html', './bower_components/'])
    .pipe(gulp.dest(globs.dest));

  return merge(css, js, images, other);

});

gulp.task('lint', ['lint:js'], function() {
  return gulp.src(globs.css)
    .pipe(cssTasks());
});

gulp.task('lint:js', function() {
  return gulp.src(['./gulpfile.js', globs.js])
    .pipe(jsTasks());
});

gulp.task('watch', function() {
  gulp.watch('css/**/*.css').on('change', fileChanged('css'));
  gulp.watch('js/**/*.js').on('change', fileChanged('js'));
  gulp.watch('templates/**/*.jade').on('change', fileChanged('jade'));
});

// functions
function reload() {
  return lazypipe().pipe(livereload)();
}

function jadeTasks() {
  return lazypipe().pipe(jade)();
}

function jsTasks() {
  return lazypipe()
    .pipe(jshint, './.jshintrc')
    .pipe(jshint.reporter, 'jshint-stylish')();
}

function cssTasks() {
  return lazypipe()
    .pipe(csslint, './.csslintrc')
    .pipe(csslint.reporter)();
}

function fileChanged(type) {
  return function(event) {
    var changes;
    var loc = event.path;

    var tasks = getTasks(type);

    gutil.log(gutil.colors.magenta(path.basename(loc)), 'was', event.type);

    switch(event.type) {
      case 'changed':

        if(type !== 'jade') {
          changes = gulp.src(loc, { base: './' })
            .pipe(tasks())
            .pipe(reload());
        }
        else {
          changes = gulp.src(globs.jade)
            .pipe(tasks())
            .pipe(embedlr())
            .pipe(gulp.dest('./'))
            .pipe(reload());
        }

        break;
    }

    return changes;
  };
}

function getTasks(type) {
  switch(type) {
    case 'css': return cssTasks;
    case 'js': return jsTasks;
    case 'jade': return jadeTasks;
  }
}
