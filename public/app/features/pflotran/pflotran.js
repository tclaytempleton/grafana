define ([
  'angular'
],

  function (angular) {
    'use strict';
    var module;
    module = angular.module('grafana.directives');

    module.directive('pflotran', function() {
      return {
        restrict: 'E',
        controller: 'PflotranCtrl',
        templateUrl: 'public/app/features/pflotran/pflotran.html',
        link: function () {
        }
      };
    });

    module.controller('PflotranCtrl', function ($scope) {
        console.log("scope.initDashboard");
        console.log($scope.initDashboard);
        $scope.data = $scope.$resolve.data;
        $scope.uiState = "overview";
        console.log("here should be the simulation dashboard");
        console.log($scope.data.simulation);

        $scope.ui = function (state) {
          switch(state) {
            case 'submission':
              $scope.uiState = "submission";
              break;
            case 'overview':
              $scope.uiState = "overview";
              break;
            case 'visualization':
              $scope.uiState = 'visualization';
              break;
            case 'status':
              $scope.uiState = 'status';
              break;
            default:
              $scope.uiState = "overview";
          }
        };
      });
  });
