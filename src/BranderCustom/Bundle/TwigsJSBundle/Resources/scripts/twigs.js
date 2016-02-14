var through = require('through2');
var twig = require('twig');

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
    var passFile = file.clone();
    var defines = ""
    var contents = file.contents.toString("utf-8")
    var regexp = /{%[\s]*(include|extends|use)[\s+]["|']([^''""]+)['|"][\s]*%}/g;
    while (matches = regexp.exec(contents)) {
      defines = defines + '", "twigs!' + (matches[2]);
    }
    var template = twig.twig({
      allowInlineIncludes: true,
      data: contents,
      id: options.name + ":" + passFile.relative.replace(/\/([^\/]+)$/, ":$1"),
    })
    passFile.contents = new Buffer(template.compile({
      module: "amd",
      twig: 'twig' + defines
    }), "utf-8")
    passFile.path = file.path + ".js"
    return callback(null, passFile);
  });
}
