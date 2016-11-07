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
        console.log($scope);
        $scope.data = $scope.$resolve.data;
        console.log($scope);
        $scope.uiState = "overview";

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
