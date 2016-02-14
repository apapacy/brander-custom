  'use strict';

  requirejs.config({
    "urlArgs": "bust=" + Math.random(),
    "baseUrl": '/dependencies/js',
    "waitSeconds": 30,
    "paths": {
      twigs: "/public/twigs"
    },
    "map": {
      "*": {},
      "config/twig": {}
    },
    shim: {},
    googlemaps: {}
  });

  requirejs([
    "backbone",
    "backbone.marionette",
    "twigs!TwigBundle/Exception/error.xml.twig",
    "twigs!TwigBundle/Exception/error.atom.twig"
  ],
    function(Backbone, Marionette, templatexml, template) {
      var model = new Backbone.Model();
      model.set("status_code", "Status Code++")
      model.set("status_text", "Status Text++")
      var view = new (Marionette.ItemView.extend({
        template: template,
        model: model,
        el: function(){return document.getElementsByTagName("body")[0]}
      }));
      view.model = model
      view.render()

  });
