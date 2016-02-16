var through = require('through2');
var twig = require('twig');
var fs = require('fs');
// require twig 0.8.8 for twig.cache(false);
twig.cache(false);

twig.extend(function(twig) {
  twig.compiler.wrap = function(id, tokens) {
    return 'twig({id:"' + id.replace('"', '\\"') + '", data:' + tokens + ', precompiled: true,allowInlineIncludes:true});\n';
  };
})

module.exports = function(options) {
  return through.obj(function(file, encoding, callback) {
    if (file.isNull()) {
      return callback(null, file);
    }
    if (options.path) {
      file.base = options.path
      if (options.override && fs.existsSync(options.override + "/" + file.relative)) {
        return; //callback(null, null);
      }
    }
    var defines = ""
    var contents = file.contents.toString("utf-8")

    var regexp = /({%[\s]*(include|extends|use|import|from)[\s+]["'])@([^\/'"]+)([\S\s]*?)(['"][\S\s]*?%})/g;
    contents = contents.replace(regexp, "$1$3Bundle$4$5");

    regexp = /({%[\s]*(include|extends|use|import|from)[\s+]["'][\S]+?):([\S]+?):([\S]+?['"][\S\s]*?%})/g;
    contents = contents.replace(regexp, "$1/$3/$4");

    regexp = /({%[\s]*(include|extends|use|import|from)[\s+]["'][\S]+?)::([\S]+?['"][\S\s]*?%})/g;
    contents = contents.replace(regexp, "$1/$3");

    regexp = /({%[\s]*(include|extends|use|import|from)[\s+]["'])::\/?([\S]+?['"][\S\s]*?%})/g;
    contents = contents.replace(regexp, "$1$3");


    regexp = /{%[\s]*(include|extends|use|import|from)[\s+]["']([^'"]+)[''""][\S\s]*?%}/g;
    while (matches = regexp.exec(contents)) {
      defines = defines + '", "twigs!' + (matches[2]);
    }
    var template = twig.twig({
      allowInlineIncludes: true,
      data: contents,
      id: options.name + "/" + file.relative,
    })
    file.contents = new Buffer(template.compile({
      module: "amd",
      twig: 'twig' + defines
    }), "utf-8")
    file.path = file.path + ".js"
    return callback(null, file);
  });
}
