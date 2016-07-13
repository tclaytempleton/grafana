///<reference path="../../headers/leaflet.d.ts" />
///<reference path="../../headers/common.d.ts" />



import angular from 'angular';
import * as L from 'leaflet';
//
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


export function leafletDirective($compile, $rootScope) {
  return {
    restrict: 'E',
    scope: true,
    link: function postLink(scope, element) {
      var seen = [];
      console.log(JSON.stringify(scope, function(key, val) {
        if (val != null && typeof val === "object") {
          if (seen.indexOf(val) >= 0) {
            return;
          }
          seen.push(val);
        }
        return val;
      }));
      console.log("dashboard");
      console.log(scope.dashboard);


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
      var marker = L.marker(initialPosition);
      var popup = L.popup(
        {
          maxWidth: 800,
          minWidth: 500
        }
      );
      console.log('about to compile new content');
      //scope.panel = scope.dashboard.rows[0].panels[0];
      //var template = angular.element('<div>The popup text</div>');
      scope.panel = scope.dashboard.rows[0].panels[0];
      scope.row = scope.dashboard.rows[0];
      scope.dashboard = scope.dashboard;
      var template = angular.element('<plugin-component type="panel" class="panel-margin">');
      var linkFn = $compile(template[0]);
      var content = linkFn(scope);
      console.log("content: ");
      console.log(content);
      popup.setContent(content[0]);
      //popup.setContent(template[0]);
      marker.bindPopup(popup);
      marker.on('popupopen', function (popup) {
        $rootScope.$broadcast('render');
      });
      marker.addTo(map);

      zoomControl.addTo(map);
      scaleControl.addTo(map);
      layerControl.addTo(map);
    }
  };
}

angular.module('grafana.directives').directive('leafletMap', leafletDirective);
