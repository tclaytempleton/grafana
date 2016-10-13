///<reference path="../../headers/common.d.ts" />

import angular from 'angular';
import config from 'app/core/config';

var directiveModule = angular.module('grafana.directives');

/** @ngInject */
function panelEditorTab(dynamicDirectiveSrv) {
  return dynamicDirectiveSrv.create({
    scope: {
      ctrl: "=",
      editorTab: "=",
      index: "=",
    },
    directive: scope => { //this scope is passed when directive is called. since scope (defined above) is passed to
                          // create and then passed to link, when this.directive() is called, the scope is the scope
                          //defined above, and so "editorTab" is whatever was passed into the panelEditorTab add set via EditorTab:'='
      console.log("inside the directive function passed to dynamicDirectiveSrv by panelEditorTab");
      console.log("the editorTab looks like this:");
      console.log(scope.editorTab);
      var pluginId = scope.ctrl.pluginId;
      var tabIndex = scope.index;
      console.log('the name of the object passed to Promise.resolve is:');
      console.log(`panel-editor-tab-${pluginId}${tabIndex}`);
      return Promise.resolve({
        name: `panel-editor-tab-${pluginId}${tabIndex}`,
        fn: scope.editorTab.directiveFn, //this function just returns a templateURL,
                                         // the templateURL that's passed as an argument
                                         // to addEditorTab in a controller that extends PanelCtrl
      });
    }
  });
}

directiveModule.directive('panelEditorTab', panelEditorTab);
