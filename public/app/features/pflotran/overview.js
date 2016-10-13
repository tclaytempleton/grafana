define ([
    'angular'
  ],

  function (angular) {
    'use strict';
    var module;
    module = angular.module('grafana.directives');

    module.directive('pflotranOverview', function() {
      return {
        restrict: 'E',
        controller: 'PflotranOverviewCtrl',
        templateUrl: 'public/app/features/pflotran/overview.html',
        link: function () {
        }
      };
    });

    module.controller('PflotranOverviewCtrl', function ($scope) {
      $scope.test = "test";
    });
  });
