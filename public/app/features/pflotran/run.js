define ([
    'angular',
    'lodash',
    'agGrid'
  ],

  function (angular, lodash, agGrid) {
    'use strict';
    var module;
    module = angular.module('grafana.directives');
    agGrid.initialiseAgGridWithAngular1(angular);
    module.requires.push('agGrid');

    module.directive('pflotranSubmission', function() {
      return {
        restrict: 'E',
        controller: 'PflotranSubmissionCtrl',
        templateUrl: 'public/app/features/pflotran/run.html',
        scope: {
          data: '=data'
        },
        link: function () {
        }
      };
    });

    module.controller('PflotranSubmissionCtrl', function ($scope, jobSrv) {
      var editable_function = function (params) {
        return params.context.editable;
      };

      var columnDefs = [
        {headerName: "Input parameter", field: "parameter"},
        {headerName: "Value", field: "value", editable: editable_function},
        {headerName: "Unit", field: "unit", editable: editable_function},
        {headerName: "Description", field: "description"}
      ];

      var metadata = $scope.data.metadata.$$state.value;//loose end: assign cell editor based on "type" value in metadata

      console.log(metadata);
      var rowData = lodash.map(metadata, function (row) {
        delete row["type"];
        row["value"] = "";
        row["unit"] = "";
        return row;
      });

      $scope.gridOptions = {
        columnDefs: columnDefs,
        rowData: rowData,
        onGridReady: gridReady,
        context: {editable: false},
        singleClickEdit: true
      };

      function gridReady (e) {
        size_grid_vertically(e.api.gridOptionsWrapper.gridOptions);
        e.api.gridPanel.columnController.sizeColumnsToFit(1048); //hack hack hack! but it works. see
        //https://github.com/ceolter/ag-grid/blob/e149fa477f9a97c03e489aa908b0f429567e5c70/src/ts/gridApi.ts
        //https://github.com/ceolter/ag-grid/blob/58a41268cd31bea8de8f14b8d48dc9731fa434ed/src/ts/gridPanel/gridPanel.ts
        //https://github.com/ceolter/ag-grid/blob/99d9ca5d372a2e58dc9f219d0b53f1e2e09176d6/src/ts/columnController/columnController.ts
        //e.api.sizeColumnsToFit();
      }

      function size_grid_vertically(gridOptions) {
        var num_rows = gridOptions.rowData.length;
        var vertical_pixels_per_row = 25; //ag-grid default
        var vertical_pixels_per_header = 27; //ag-grid default (approx)
        $scope.gridHeight = vertical_pixels_per_header + num_rows * vertical_pixels_per_row;
      }

      $scope.toggleEditable = function(value) {
        if (value === false) {
          $scope.gridOptions.api.stopEditing();//call stopEditing() to save the current value
        }
        $scope.gridOptions.context.editable = value;
        $scope.gridOptions.api.refreshView();
        $scope.gridOptions.api.refreshHeader();
      };

      $scope.sendJob = function() {
        $scope.gridOptions.api.selectAll();
        var rows = $scope.gridOptions.api.getSelectedRows();
        var job = {};
        for (var i = 0; i < rows.length; i++) {
          job[rows[i].parameter] = rows[i].value;
        }
        jobSrv.postJob(job);
        //parameter = $scope.gridOptions.columnApi.getColumn("parameter")
        //value = $scope.gridOptions.columnApi.getColumn("value")
        //console.log(parameter)
        //console.log(value)
      };

    });
  });
