///<reference path="../../headers/leaflet.d.ts" />
///<reference path="../../headers/common.d.ts" />



import angular from 'angular';
import * as L from 'leaflet';
import $ from 'jquery';
import config from 'app/core/config';

export class MapCtrl {
  constructor($scope, $routeParams, dashboardSrv, dashboardLoaderSrv) {
    console.log("MapCtrl");
    /*
    $scope.dashboard = dashboard.dashboard;
    $scope.row = dashboard.dashboard.rows[0];
    $scope.panel = dashboard.dashboard.rows[0].panels[0];
    $scope.dashboard.meta = dashboard.meta;
    var dashboardModel = dashboardSrv.create(dashboard.dashboard, dashboard.meta);
    var callback = function (panel) {
      console.log("panel = ");
      console.log(panel);
    };
    dashboardModel.forEachPanel(callback);
    //console.log("the panel object:\n");
    //console.log(dashboardModel.rows[0].panels[0]);
    */

  };
};



angular.module('grafana.controllers').controller('MapCtrl', MapCtrl);


export function leafletDirective($compile, $rootScope, $http) {
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
      var mqArial = L.tileLayer(
        'http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
      );
      var initialZoom = 6;
      var initialPosition = new L.LatLng(31.5607225, -91.170663);
      var map = L.map(element[0], {
        zoomControl: false,
        attributionControl: false,
        inertia: false,
        keyboard: true,
        dragging: true,
        scrollWheelZoom: true,
        zoomAnimation: true,
        //click: true,
        layers: [mqArial] // only add one!
      }).setView(initialPosition, initialZoom);

      //var layersource = "http://localhost:8000/sensorlocations/as_layer"
      var layersource = "http://129.114.97.166/services/sensorlocations/as_layer";
      var markerLayer = $http.get(layersource);
      markerLayer.success(processMarkerLayer);
      var markerLayerHandlers = {
        onEachFeature: markerLayerOnEachFeatureFunction
      };

      function markerLayerOnEachFeatureFunction (featureData, layer) {
        var name = featureData.properties.name;
        console.log(name);
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

      function processMarkerLayer(response) {
        var layer = L.geoJson(response, markerLayerHandlers);
        layer.addTo(map);

      }



      //var marker = L.marker(initialPosition);


      //scope.panel = scope.dashboard.rows[1].panels[1];
      //scope.row = scope.dashboard.rows[1];
      //scope.dashboard = scope.dashboard;

      /*
      var zero = $('<div></div>');
      var one   = $('<div ng-repeat="row in dashboard.rows" row-height></div>');
      var two   = $('<div ng-repeat="panel in row.panels" class="panel" panel-width></div>');
      var three = $('<plugin-component type="panel" class="panel-margin"></plugin-component>');
      three.appendTo(two);
      two.appendTo(one);
      one.appendTo(zero);
      //console.log(one);

      var linkFn = $compile(zero[0]);
      console.log(linkFn);

      var content = linkFn(scope);

      console.log(content);
      */

      //marker.addTo(map);


      /*
      var container = angular.element('<div></div>');
      scope.panel = scope.dashboard.rows[1].panels[1];
      scope.row = scope.dashboard.rows[1];
      scope.dashboard = scope.dashboard;
      console.log("defined variables");
      for (var i = 0; i<scope.dashboard.rows.length; i++) {
        for (var j = 0; j<scope.dashboard.rows[i].panels.length; j++) {
          var template = angular.element('<plugin-component type="panel" class="panel-margin">');
          var linkFn = $compile(template[0]);
          var content = linkFn(scope);
          console.log("content at step for row = " + i + " panel = " + j + ": "  );
          console.log(content[0]);
          container.append(content);
        }
      }

      popup.setContent(container[0]);
      marker.bindPopup(popup);
      marker.on('popupopen', function (popup) {
        $rootScope.$broadcast('render');
      });
      marker.addTo(map);
      */

      zoomControl.addTo(map);
      scaleControl.addTo(map);
      layerControl.addTo(map);
    }
  };
}

angular.module('grafana.directives').directive('leafletMap', leafletDirective);
