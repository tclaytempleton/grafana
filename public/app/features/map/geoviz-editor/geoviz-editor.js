define([
  'angular',
  'lodash',
],
function (angular) {
  'use strict';
  var module;
  module = angular.module('grafana.directives');

  module.directive('geovizEditor', function() {
    return {
      restrict: 'E',
      controller: 'GeoVizEditorCtrl',
      templateUrl: 'public/app/features/map/geoviz-editor/geoviz-editor.html',
      link: function() {
      }
    };
  });

  module.controller('GeoVizEditorCtrl', function ($scope, MapSrv) {
    $scope.layers = [];
    $scope.baselayers = [];
    $scope.remotelayers = [];
    $scope.showBaselayers = false;
    $scope.showRemotelayers = false;
    $scope.showLayers = false;

    MapSrv.getBaseLayers().success(function (response) {
      $scope.baselayers = response;
    });

    MapSrv.getRemoteLayers().success(function (response) {
      $scope.remotelayers = response;
    });
    MapSrv.getLayers().success(function (response) {
      $scope.locallayers = response;
    });
    $scope.toggleBaselayers = function () {
      $scope.showBaselayers = !$scope.showBaselayers;
    };
    $scope.toggleRemotelayers = function () {
      $scope.showRemotelayers = !$scope.showRemotelayers;
    };

    $scope.toggleLayers = function () {
      $scope.showLayers = !$scope.showLayers;
    };
  });
});
