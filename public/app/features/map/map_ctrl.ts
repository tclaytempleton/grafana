///<reference path="../../headers/leaflet.d.ts" />
///<reference path="../../headers/common.d.ts" />

import angular from 'angular';
import * as L from 'leaflet';
//
export class MapCtrl {
  constructor() {
  ////constructor(private $scope, private $location) {
    console.log("in Map Ctrl");
  }
}

angular.module('grafana.controllers').controller('MapCtrl', MapCtrl);


export function leafletDirective() {
  return {
    restrict: 'E',
    controller: MapCtrl,
    bindToController: true,
    controllerAs: 'ctrl',
    scope: {},
    link: function postLink(scope, element) {
      console.log("linking map controller");

      //var baselayers = {};
      //var overlays = {};

      //var layerControl = L.control.layers(baselayers, overlays, {position: 'topleft'});
      var zoomControl = L.control.zoom({position: 'topright'});
      //var scaleControl = L.control.scale({position: 'bottomleft'});
      //var attributionControl = L.control.attribution({position: 'bottomright'});

      var img_src = "http://developer.mapquest.com/content/osm/mq_logo.png";
      var mqArial = L.tileLayer(
        'http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
        ////'http://{s}.tile.thunderforest.com/landscape/{z}/{x}/{y}.png'
        //'http://otile{s}.mqcdn.com/tiles/1.0.0/sat/{z}/{x}/{y}.jpg'
        //,
        //{
        //  attribution: 'Tiles courtesy of <a href="http://www.mapquest.com/">MapQuest</a><img src=' + img_src + '\>',
        //  subdomains: '1234'
        //}
      );
      var initialZoom = 6;
      var initialPosition = new L.LatLng(31.5607225, -91.170663);
      var map = L.map('map', {
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

      zoomControl.addTo(map);
      //scaleControl.addTo(map);
      //attributionControl.addTo(map);
      //layerControl.addTo(map);
      //map.invalidateSize();

    }
  };
}

angular.module('grafana.directives').directive('leafletMap', leafletDirective);
