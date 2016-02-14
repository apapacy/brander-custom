'use strict';

var gulp = require('gulp'),
  _ = require('lodash'),
  bower = require('main-bower-files'),
  bowerNormalizer = require('gulp-bower-normalize'),
  rename = require('gulp-rename'),
  install = require('gulp-install'),
  watch = require('gulp-watch'),
  babel = require('gulp-babel'),
  uglify = require('gulp-uglify'),
  gutil = require('gulp-util'),
  gulpif = require('gulp-if'),
  rjs = require('gulp-requirejs-optimize'),
  twig_compile = require('twig-compile'),
  sourcemaps = require('gulp-sourcemaps'),
  sass = require('gulp-sass'),
  autoprefixer = require('gulp-autoprefixer'),
  cmq = require('gulp-merge-media-queries'),
  progeny = require('gulp-progeny'),
  minifyCss = require('gulp-minify-css'),
  browserSync = require('browser-sync'),
  minimatch = require("minimatch"),
  fs = require('fs'),
  exec = require('child_process').exec,
  path = require('path');


var logger = function(prefix) {
  return require('gulp-print')(function(filepath) {
    return prefix + ': ' + filepath;
  });
};

var env = process.env.NODE_ENV || process.env.SYMFONY_ENV || 'dev';
var config = {
  ENV: env,
  dependencies: {
    twigs: {
      paths: {
      },
      extensions: ['twig'],
      options: {
        module: 'amd',
        twig: 'twig',
        compileOptions: {
          viewPrefix: 'views/'
        }
      }
    }
  },
  BOWER_JSON: './bower.json',
  BOWER_COMPONENTS: './bower_components',
  DEST_PATH: './web/dependencies'
};

var twigs = require("./twigs.js")
var root_path = process.cwd();

gulp.task("custom:find:twigs", function(cb) {
  exec(root_path + "/app/console custom:find:twigs", function(err, stdout, stderr) {
    config.dependencies.twigs.bundles = JSON.parse(stdout)
    cb(err);
  });
});

function twigsHandle(path, name, file) {
  var conf = config.dependencies.twigs;
  return new Promise(function(resolve, reject) {
    var rejecting = function() {
      console.error(arguments);
      reject(arguments)
    };
    gulp.src(path + "/Resources/views/**/*.twig", {encoding:"utf-8"})
      .on('error', rejecting)
      .pipe(twigs({name:name}))
      .on('error', rejecting)
      .pipe(gulp.dest(root_path + "/" + config.DEST_PATH +"/templates/" + name))
      .on('error', rejecting)
      .on('end', resolve);
  });
}

gulp.task("dependencies:twigs:build", ["custom:find:twigs"], function(file) {
  var conf = config.dependencies.twigs,
    result = [];
  _.each(conf.bundles.array, function(bundle) {
    result.push(twigsHandle(bundle.path, bundle.name, file));
  });
  return Promise.all(result);
});
