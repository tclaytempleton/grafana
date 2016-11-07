define([
  '../core_module',
],
function (coreModule) {
  "use strict";

  coreModule.default.controller('LoadDashboardCtrl', function ($scope, $routeParams, dashboardLoaderSrv, backendSrv, $location) {
    $scope.appEvent("dashboard-fetch-start");

    if (!$routeParams.slug) {
      backendSrv.get('/api/dashboards/home').then(function (homeDash) {
        if (homeDash.redirectUri) {
          $location.path('dashboard/' + homeDash.redirectUri);
        } else {
          var meta = homeDash.meta;
          meta.canSave = meta.canShare = meta.canStar = false;
          $scope.initDashboard(homeDash, $scope);
        }
      });
      return;
    }
    dashboardLoaderSrv.loadDashboard($routeParams.type, $routeParams.slug).then(function (result) {
      $scope.initDashboard(result, $scope);
    });

  });

  coreModule.default.controller('NewDashboardCtrl', function ($scope) {
    $scope.initDashboard({
      meta: {canStar: false, canShare: false},
      dashboard: {
        title: "New dashboard",
        rows: [{height: '250px', panels: []}]
      },
    }, $scope);
  });

  coreModule.default.controller('LoadMapDashboardCtrl', function ($scope, $routeParams, dashboardLoaderSrv, backendSrv, $location) {
    $scope.appEvent("dashboard-fetch-start");

    if (!$routeParams.slug) {
      backendSrv.get('/api/dashboards/home').then(function (homeDash) { //tct changed from 'api/dashboards/home
        if (homeDash.redirectUri) {
          $location.path('dashboard/' + homeDash.redirectUri);
        } else {
          var meta = homeDash.meta;
          meta.canSave = meta.canShare = meta.canStar = false;
          homeDash.dashboard.title = "GeoViz"; //tct
          $scope.initDashboard(homeDash, $scope);
        }
      });
      return;
    }
    dashboardLoaderSrv.loadDashboard($routeParams.type, $routeParams.slug).then(function (result) {
      $scope.initDashboard(result, $scope);
    });

  });

  coreModule.default.controller('LoadPflotranDashboardCtrl', function ($scope, $routeParams, dashboardLoaderSrv, backendSrv, $location) {
    $scope.appEvent("dashboard-fetch-start");

    if (!$routeParams.slug) {
      backendSrv.get('/api/dashboards/db/simulation').then(function (simDash) { //tct changed from 'api/dashboards/home
        console.log("simDash");
        console.log(simDash);
        if (simDash.redirectUri) {
          $location.path('dashboard/' + simDash.redirectUri);
        } else {
          var meta = simDash.meta;
          meta.canSave = meta.canShare = meta.canStar = false;
          simDash.dashboard.title = "Pflotran Simulation"; //tct
          $scope.initDashboard(simDash, $scope);
        }
      });
      return;
    }
    dashboardLoaderSrv.loadDashboard($routeParams.type, $routeParams.slug).then(function (result) {
      $scope.initDashboard(result, $scope);
    });

  });

});
