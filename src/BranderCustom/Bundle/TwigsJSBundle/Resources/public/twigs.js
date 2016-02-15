define(['backbone.marionette', 'twig', 'lodash'], function defined(Marionette, Twig, _) {
  Marionette.Renderer.render = function(template, data) {
    return template.render(data);
  }
console.log(Twig)
  function load(resourcePath, parentRequire, callback, config) {
    var real = resourcePath;
    if (resourcePath.substring(0, 1) === "@") {
      var real = resourcePath.replace(/@([^\/]+)/, "$1Bundle");
    }
    if (resourcePath.substring(0, 1) === ":") {
      var real = "app/" + resourcePath.substring(1);
    }
    if (resourcePath.substring(0, 2) === "::") {
      var real = "app/" + resourcePath.substring(2);
    }
    real = real.replace(/:/g, "/");
    real = real.replace(/\/{2,}/g, "/");
    parentRequire(["/dependencies/templates/" + real + ".js"], function(template) {
      callback(template);
    });
  }
  return ({
    load: load
  });

});
