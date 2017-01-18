///<reference path="../../headers/leaflet.d.ts" />
///<reference path="../../headers/common.d.ts" />

import angular from 'angular';
import * as L from 'leaflet';
import $ from 'jquery';
import config from 'app/core/config';


export function leafletDirective($compile, $rootScope, $http, MapSrv) {
  return {
    restrict: 'E',
    scope: true,
    link: function postLink(scope, element) {
      L.Icon.Default.imagePath = config.appSubUrl + "/public/vendor/leaflet/dist/images";
      var baselayers = {};
      var overlays = {};
      var layerControl = L.control.layers(baselayers, overlays, {position: 'topleft'});
      var zoomControl = L.control.zoom({position: 'topright'});
      var scaleControl = L.control.scale({position: 'bottomleft'});
      var esri = L.tileLayer(
        'http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
      );
      var initialZoom = 6;
      var initialPosition = new L.LatLng(31.5635497, -91.1403352);
      var map = L.map(element[0], {
        zoomControl: false,
        attributionControl: false,
        inertia: false,
        keyboard: true,
        dragging: true,
        scrollWheelZoom: true,
        zoomAnimation: true,
        layers: [esri] // only add one!
      }).setView(initialPosition, initialZoom);

      scope.$on("zoom", function (event, args) {
        console.log("picked up the event");
        map.setView(initialPosition, args.zoomlevel,
          {
            "animate": true
          }
        );
      });

      var markerLayer = MapSrv.getMarkerLayer();
      markerLayer.success(processMarkerLayer);
      var baseLayers = MapSrv.getBaseLayers();
      baseLayers.success(processBaseLayers);
      var remoteLayers = MapSrv.getRemoteLayers();
      remoteLayers.success(processRemoteLayers);
      var layers = MapSrv.getLayers();
      layers.success(processLayers);

      zoomControl.addTo(map);
      scaleControl.addTo(map);
      layerControl.addTo(map);


      function processMarkerLayer(response) {
        var markerLayerHandlers = {
          onEachFeature: markerLayerOnEachFeatureFunction
        };
        var layer = L.geoJson(response, markerLayerHandlers);
        layer.addTo(map);
      }

      function processBaseLayers (response) {
        for (var i = 0; i < response.length; i++) {
          var name = response[i].name;
          var url = response[i].url;
          var attribution = response[i].attribution;
          var subdomains = response[i].subdomains;

          var baselayer = L.tileLayer(
            url,
            {
              attribution: attribution,
              subdomains: subdomains
            }
          );
          layerControl.addBaseLayer(baselayer, name);
        };
      }

      function processRemoteLayers (response) {
        for (var i = 0; i < response.length; i++) {
          var name = response[i].name;
          var url = response[i].url;
          var handler_factory_args = {
            style: {
              radius: 8,
              fillColor: "#" + response[i].color,
              color: "#000",
              weight: 1,
              opacity: 1,
              fillOpacity: 0.8
            }
          };
          var handler_factories = {
            style: defaultStyleFactory,
            pointToLayer: circleMarkerPointToLayerFactory,
            onEachFeature: simplePopupOnEachFeatureFactory
          };
          process_geojson(url, name, handler_factory_args, handler_factories);
        }
      }

      function processLayers(response) {
        for (var i = 0; i < response.length; i++) {
          var name = response[i].display_name;
          var url = "http://129.114.111.79/media/" + "geojson/" + response[i].file_name;
          //var url = "http://localhost:8000/media/" + "geojson/" + response[i].file_name;
          var handler_factory_args = {
            style: {
              fillOpacity: 0.0,
              color: "#" + response[i].fill_color,
              weight: '3px'
            }
          };
          var handler_factories = {
            style: defaultStyleFactory,
            pointToLayer: circleMarkerPointToLayerFactory,
            onEachFeature: simplePopupOnEachFeatureFactory
          };
          process_geojson(url, name, handler_factory_args, handler_factories);
        }
      }

      function markerLayerOnEachFeatureFunction (featureData, layer) {
        var name = featureData.properties.name;
        var popup = L.popup(
          {
            maxWidth: 800,
            minWidth: 500
          }
        );
        var zero = $('<div></div>');
        var one   = $('<div ng-repeat="row in dashboard.rows"></div>');
        var two   = $('<div ng-repeat="panel in row.panels | filter:{geolocation:{gis:\'' + name + '\'}}"></div>');
        var three = $('<plugin-component type="panel" class="panel-margin"></plugin-component>');
        three.appendTo(two.appendTo(one.appendTo(zero)));
        var linkFn = $compile(zero[0]);
        var content = linkFn(scope);
        popup.setContent(content[0]);
        layer.bindPopup(popup);
        layer.on('popupopen', function (popup) {
          $rootScope.$broadcast('render');
        });
      }

      function process_geojson (url, name, args, handlerFactories) {
        $http.get(url).success(function successCallback(data) {
          var handlers = {
            style: handlerFactories.style(args),
            pointToLayer: handlerFactories.pointToLayer(args),
            onEachFeature: handlerFactories.onEachFeature(args)
          };
          var geojson = L.geoJson(data, handlers);
          geojson.addTo(map);
          overlays[name] = geojson;
          layerControl.addOverlay(geojson, name);
        });
      };

      function circleMarkerPointToLayerFactory (args) {
        var circleMarkerHandler = function (feature, latlng) {
          return L.circleMarker(latlng, args.style);
        };
        return circleMarkerHandler;
      };

      function markerHandlerFactory (args) {
        var markerHandler = function (feature, latlng) {
          var options = {
            title: feature.properties.name
          };
          return L.marker(latlng, options);
        };
        return markerHandler;
      };


      function defaultStyleFactory (args) {
        var defaultStyleHandler = function (feature, layer) {
          return args.style;
        };
        return defaultStyleHandler;
      };

      function simplePopupOnEachFeatureFactory (args) {
        var simplePopup = function (feature, layer) {
          console.log('simple popup for a feature');
          if (feature.properties) {
            var popupString = '<divclass="popup">';
            for (var k in feature.properties) {
              var v = feature.properties[k];
              popupString += k + ': ' + v + '<br />';
            }
            popupString += '</div>';
            layer.bindPopup(popupString);
          }
        };
        return simplePopup;
      };

    }
  };
}

angular.module('grafana.directives').directive('leafletMap', leafletDirective);
