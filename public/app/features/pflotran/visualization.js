define ([
  'angular',
],

  function(angular)  {
    'use strict';
    var module;
    module = angular.module('grafana.directives');

    module.directive('pflotranVisualization', function () {
      return {
        restrict: 'E',
        controller: 'PflotranVisualizationController',
        templateUrl: 'public/app/features/pflotran/visualization.html',
        link: function () {
        }
      };
    });

    module.controller('PflotranVisualizationController', function () {
      console.log("in PflotranVisualizationController");
    });

  });
