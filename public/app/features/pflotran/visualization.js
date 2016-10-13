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

    module.controller('PflotranVisualizationController', function ($scope) {
      console.log("test controller PflotranVisualizationController");
      $scope.test = "some test text on the scope";
      console.log("dashboard test in visualization; is initDashboard here?");
      console.log($scope.initDashboard);
      $scope.initDashboard($scope.data.simulation.$$state.value, $scope);
    });

  });
