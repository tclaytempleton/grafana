define ([
  'angular',
  'agGrid'
],

  function (angular, agGrid) {
    'use strict';
    var module;
    module = angular.module('grafana.directives');
    agGrid.initialiseAgGridWithAngular1(angular);
    module.requires.push('agGrid');

    module.directive('pflotranStatus', function () {
      return {
        restrict: 'E',
        controller: 'PflotranStatusCtrl',
        templateUrl: 'public/app/features/pflotran/status.html',
        scope: {
          data: '=data'
        },
        link: function () {
      }
      };
    });

    module.controller('PflotranStatusCtrl', function ($scope) {
      var data = $scope.data.jobs.$$state.value;  //a dictionary of promises

      var columnDefs = [
        {headerName: "Index", field: "id"},
        {headerName: "Project name", field: "project"},
        {headerName: "Job name", field: "job"},
        {headerName: "Status", field: "status"},
        {headerName: "Submit time", field: "submit"},
        {headerName: "Start time", field: "start"},
        {headerName: "End time", field: "end"},
        {headerName: "Command", field: "command"},
        {headerName: "Output Fn", field: "output"}
      ];

      function grid (name) {
        return {
          options: {
            columnDefs: columnDefs,
            rowData: data[name],
            onGridReady: gridReady,
            context: {name: name}
          },
          state: {
            height: 0
          }
        };
      }

      $scope.grids = {submitted:grid("submitted"),
        finished: grid("finished")};

      function gridReady (e) {
        //e.api.sizeColumnsToFit();
        e.api.gridPanel.columnController.sizeColumnsToFit(1048); //hack; see run.js
        size_grid_vertically(e.api.gridOptionsWrapper.gridOptions);
      }

      function size_grid_vertically(gridOptions) {
        var vertical_pixels_per_row = 25; //ag-grid default
        var vertical_pixels_per_header = 27; //ag-grid default (approx)
        var num_rows = gridOptions.rowData.length;
        var name = gridOptions.context.name;
        $scope.grids[name].state.height = vertical_pixels_per_header + num_rows * vertical_pixels_per_row;
      }

    });

  });
