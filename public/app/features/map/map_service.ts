///<reference path="../../headers/common.d.ts" />

import angular from 'angular';

var module = angular.module('grafana.services');

function MapSrv ($http) {
    //var baseURL = "http://129.114.97.166/services/";
    var baseURL = "http://localhost:8000/";
    var layerURL = baseURL + "layers/";
    var baseLayerURL = baseURL + "baselayers/";
    var remoteLayerURL = baseURL + "remote_layers/";
    var markerLayerURL = baseURL + "sensorlocations/as_layer/";
    var MapModel = {
      setBaseLayers: function () {
        this.baseLayerPromise = $http.get(baseLayerURL);
      },
      setRemoteLayers: function () {
        this.remoteLayerPromise = $http.get(remoteLayerURL);
      },
      setMarkerLayers: function () {
        this.markerLayerPromise = $http.get(markerLayerURL);
      },
      setLayers: function() {
        this.layerPromise = $http.get(layerURL);
      },
      print_test: function () {
        console.log("print test");
      },
      getBaseLayers: function() {
        return this.baseLayerPromise;
      },
      getRemoteLayers: function () {
        return this.remoteLayerPromise;
      },
      getMarkerLayer: function () {
        return this.markerLayerPromise;
      },
      getLayers: function () {
        return this.layerPromise;
      }
    };
    return MapModel;
    }
 module.service('MapSrv', MapSrv);
