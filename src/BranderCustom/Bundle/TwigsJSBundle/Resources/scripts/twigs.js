var through = require('through2');
var gutil = require('gulp-util')
var fs = require('fs')
var defaults = require('defaults')

module.exports = function(options) {
  return through.obj(function(file, encoding, callback) {

    if (file.isNull()) {
      // nothing to do
      return callback(null, file);
    }
    var passFile = file.clone();
    passFile.base = process.cwd()
    passFile.path = process.cwd()+"/zabor.twig"
    console.log("{{{{{{{{{{{{{{{{{{{{{{[]}}}}}}}}}}}}}}}}}}}}}}")
    console.log(passFile.relative)
        return callback(null, passFile);


    if (file.isStream()) {
      // file.contents is a Stream - https://nodejs.org/api/stream.html
      //this.emit('error', new PluginError(PLUGIN_NAME, 'Streams not supported!'));

      // or, if you can handle Streams:
      //file.contents = file.contents.pipe(...
      //return callback(null, file);
    } else if (file.isBuffer()) {
      // file.contents is a Buffer - https://nodejs.org/api/buffer.html
      //this.emit('error', new PluginError(PLUGIN_NAME, 'Buffers not supported!'));

      // or, if you can handle Buffers:
      //file.contents = ...
      //return callback(null, file);
    }
  });
}
