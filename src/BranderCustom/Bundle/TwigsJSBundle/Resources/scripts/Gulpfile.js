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
      paths: {},
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
    gulp.src([
        path + "/Resources/views/**/*.twig",
        root_path + "/app/Resources/" + name + "/views/**/*.twig"
      ], {
        encoding: "utf-8"
      })
      .on('error', rejecting)
      .on('end', resolve)
      .pipe(twigs({
        name: name
      }))
      .on('error', rejecting)
      .on('end', resolve)
      .pipe(gulp.dest(root_path + "/" + config.DEST_PATH + "/templates/" + name))
      .on('error', rejecting)
      .on('end', resolve);
  });
}


gulp.task("dependencies:twigs:build", ["custom:find:twigs"], function() {
  var conf = config.dependencies.twigs,
    result = [];
  _.each(conf.bundles.array, function(bundle) {
    result.push(twigsHandle(bundle.path, bundle.name));
  });
  result.push(twigsHandle("app", ""));
  return Promise.all(result);
});

function handleWatch(path, name, override) {
  return function(file) {
    gulp.src(file.path, {
        encoding: "utf-8"
      })
      .pipe(twigs({
        name: name,
        path: path,
        override: override
      }))
      .pipe(gulp.dest(root_path + "/" + config.DEST_PATH + "/templates/" + name))
  };
}


gulp.task("dependencies:twigs:watch", ["custom:find:twigs"], function() {
  var conf = config.dependencies.twigs;
  _.each(conf.bundles.array, function(bundle) {
    // начинаем от gulp.src(... чтобы отслеживать новые файлы
    //    gulp.src([
    //        bundle.path + "/Resources/views/**/*.twig",
    //        root_path + "/app/Resources/" + bundle.name + "/views/**/*.twig"
    //      ])
    //      .pipe(
    gulp.watch([
          bundle.path + "/Resources/views/**/*.twig"
//          root_path + "/app/Resources/" + bundle.name + "/views/**/*.twig"
        ],
        handleWatch(
          bundle.path + "/Resources/views",
          bundle.name,
          root_path + "/app/Resources/" + bundle.name + "/views"
        )
      )
      //      );

    gulp.watch([
//      bundle.path + "/Resources/views/**/*.twig",
        root_path + "/app/Resources/" + bundle.name + "/views/**/*.twig"
      ],
      handleWatch(root_path + "/app/Resources/" + bundle.name + "/views", bundle.name)
    )

  });
  //  gulp.src(root_path + "/app/Resources/views/**/*.twig")
  //    .pipe(
  watch(root_path + "/app/Resources/views/**/*.twig",
      handleWatch(root_path + "/app/Resources/views", "")
    )
    //    );

});
