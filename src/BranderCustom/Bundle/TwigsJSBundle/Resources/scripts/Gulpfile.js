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



/**
 * @param {Array<String>} extensions
 * @param {String} path
 * @return {Array<String>}
 */
function getPaths(path, extensions) {
  return _.map(extensions, function(ext) {
    return path + '/**/*.' + ext;
  });
}

/**
 * @param {Array<String>} paths
 * @param {String} path
 * @return {boolean|String}
 */
function matchPath(paths, path) {
  var found;
  return _.any(paths, function(v) {
    found = v;
    return minimatch(path, v);
  }) && found;
}
/**
 * @param {String} pathBlob
 * @return {String}
 */
function getBase(pathBlob) {
  return pathBlob.replace(/\/\*\*\/\*\..*/, '');
}

//******************************************************************
//*******************************************************
var twigs = require("./twigs.js")
var root_path = process.cwd();
console.log(root_path);

gulp.task("custom:find:twigs", function(cb) {
  exec(root_path + "/app/console custom:find:twigs", function(err, stdout, stderr) {
    config.dependencies.twigs.bundles = JSON.parse(stdout)
    cb(err);
  });
});

function test(test) {
  console.log(test)
  console.log("9999999999999999999999999")
}
test.on =function(){}
test.once=function(){}
test.emit = function(){}
test.end = function(){}
test.write = function(){}

function twigsHandle(path, name, file) {
  var conf = config.dependencies.twigs;
  return new Promise(function(resolve, reject) {
    var rejecting = function() {
      console.error(arguments);
      reject(arguments)
    };
    conf.compileOptions = {}
    conf.compileOptions.id = function(file) {
      console.log("+++++++++++++++++++++")
      console.log(file.path);
      conf.compileOptions.id.path = file.relative
      return file.relative
    }
    console.log(path + "/Resources/views/**/*.twig")
    gulp.src(path + "/Resources/views/**/*.twig", {encoding:"utf-8"})
      .on('error', rejecting)
      .pipe(twigs())
      .on('error', rejecting)
      .pipe(gulp.dest(root_path + "/" + config.DEST_PATH +"/twigs"))
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



(function(handle) {

  var conf = config.dependencies.twigs,
    watchBasePaths = [];
  conf.options.compileOptions.lookPaths = [];

  _.each(conf.paths, function(v, dest) {
    if (!_.isArray(v)) {
      conf.paths[dest] = [v];
    }
    conf.paths[dest] = _.reduce(conf.paths[dest], function(result, path) {
      conf.options.compileOptions.lookPaths.push(path); //?!
      watchBasePaths.push({
        path: __dirname + path,
        dest: dest
      });
      return _.union(result, getPaths(__dirname + path, conf.extensions));
    }, []);
  });

  gulp.task('dependencies0:twigs:build', function() {
    var result = [];
    _.each(conf.paths, function(paths, dest) {
      _.each(paths, function(path) {
        result.push(handle(conf, path, dest));
      });
    });

    return Promise.all(result);
  });

  gulp.task('dependencies:twigs:watch', ['dependencies:twigs:build'], function() {
    var watchPaths = _.reduce(conf.paths, function(result, paths, key) {
      return _.union(result, paths);
    }, []);
    conf.options.compileOptions.resetId = true;
    return watch(watchPaths, function(file) {
      _.each(watchBasePaths, function(v) {
        var path = v.path,
          dest = v.dest;
        if (file.path.indexOf(path) === 0) {
          return handle(conf, file.path, dest, path);
        }
      });
    });
  });
})(function(conf, paths, dest, base) {
  var conf = _.merge({}, conf);
  conf.options.compileOptions.id = function(file) {
    //          0  1                         2    3
    var matches = /(^app)?.*\/Resources\/views\/(.*?)([^\/]+\.twig)/.exec(file.relative);
    console.log(matches)
    var bundle = (matches[1] === "app" ? "" : matches[2])
    bundle = bundle.replace(/\/Bundle\//g, "").replace(/\//g, "");
    var path = matches[2].replace(/^\/|\/$/g, "");

    return dest + file.relative;
  };
  return new Promise(function(resolve, reject) {
    var rejecting = function() {
      console.error(arguments);
      reject(arguments)
    };
    gulp.src(paths, {
        base: base
      })
      .on('error', rejecting)
      .pipe(twig_compile(conf.options))
      .on('error', rejecting)
      .pipe(gulpif(true || conf.minify, uglify()))
      .on('error', rejecting)
      .pipe(logger('views'))
      .pipe(gulp.dest(config.DEST_PATH + '/js/' + conf.options.compileOptions.viewPrefix + dest))
      .on('error', rejecting)
      .on('end', resolve);
  });
});
//*******************************************
//*******************************************
