define(['backbone.marionette', 'twig', 'lodash'], function defined(Marionette, Twig, _) {
  Marionette.Renderer.render = function(template, data) {
    return template.render(data);
  }
console.log(Twig)
  function load(resourcePath, parentRequire, callback, config) {
    var real = resourcePath.substring(0, 1) === "@"
    ? resourcePath.replace(/@([^\/]+)/, "$1Bundle")
    : resourcePath.replace(/:/g, "/");
    parentRequire(["/dependencies/templates/" + real + ".js"], function(template) {
      callback(template);
    });
  }
  return ({
    load: load
  });

});
