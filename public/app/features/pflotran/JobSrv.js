define ([
  'angular'
  ],

  function (angular) {
    'use strict';
    var module;
    module = angular.module('grafana.services');
    module.factory('jobSrv', function jobSrv($q, $http) {
      var service = {};
      service.getMetadata = function () {
        var metadata = $q.when([
          {parameter: "project", type: "text", "description": "The name of the project"},
          {parameter: "job", type: "text", "description": "The name of this job"},
          //{parameter: "submit", type: "datetime", "description": "The datetime job submitted"},
          {parameter: "start", type: "text", description: "The datetime job started"},
          {parameter: "end", type: "text", description: "The datetime job ended"},
          {parameter: "command", type: "text", description: "The name of the command"},
          //{parameter: "period", type: "text", description: "Period from the initial time"},
          //{parameter: "restart_from", type: "text", description: "Select a check point for restart"},
          {parameter: "output", type: "text", description: "Output function"}
        ]);
        return metadata;
      };

      service.getJobs = function () {
        var submitted = service.getSubmittedJobs();
        var finished = service.getFinishedJobs();
        return $q.all({
          submitted: submitted,
          finished: finished
        });
      };

      service.getSubmittedJobs = function () {
        //var submittedJobs = $http.get(window.pflotran_config.base_url + "services/jobs?status=submitted");
        var submittedJobs = $q.when([
            {
                "index": 1,
                "project": "Cranfield",
                "job":"Prepare for running pflotran for 09/25/16",
                "status":"Submitted",
                "submit":"Wed Aug 24 17:20:05 CDT 2016",
                "start": "Wed Aug 24 17:22:06",
                "end": ""
            }
        ]);
        return submittedJobs;
      };

      service.getFinishedJobs = function () {
        //var finishedJobs = $http.get(window.pflotran_config.base_url + "services/jobs?status=finished");
        var finishedJobs = $q.when([
            {
                "index": 1,
                "project": "Cranfield",
                "job": "Run pflotran for 08/25/16",
                "status": "Finished",
                "submit": "Wed Aug 24 17:20:06 CDT 2016",
                "start": "Wed Aug 24 17:22:06 CDT 2016",
                "end": "Wed Aug 24 18:25:06 CDT 2016"
            },
            {
                "index": 2,
                "project": "Cranfield",
                "job": "Run pflotran for 08/26/16",
                "status": "finished",
                "submit": "Wed Aug 24 17:20:07 CDT 2016",
                "start": "Wed Aug 24 17:25:06 CDT 2016",
                "end": "Wed Aug 24 18:25:06 CDT 2016"
            }
        ]);
        return finishedJobs;
      };

      service.postJob = function (job) {
        var url = window.pflotran_config.base_url + "services/jobs";
        $http.post(url, job).then(function (data) {
          console.log(data);
        });
      };

      return service;
    });
  });
