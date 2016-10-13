///<reference path="../../headers/common.d.ts" />

import angular from 'angular';
import coreModule from '../core_module';

class DynamicDirectiveSrv {

  /** @ngInject */
  constructor(private $compile, private $parse, private $rootScope) {}

  addDirective(element, name, scope) {
    var child = angular.element(document.createElement(name));
    this.$compile(child)(scope);

    element.empty();
    element.append(child);
  }

  link(scope, elem, attrs, options) {
    console.log('in link method of DynamicDirectorSrv');
    console.log('options.directive looks like this:');
    console.log(options.directive);
    options.directive(scope).then(directiveInfo => {
      console.log("what is the nature of this thing returned by the Promise object on the directive property on the " +
                  "object passed to DynamicDirectiveSrv.create(options), and thence to link?");
      console.log(directiveInfo);
      console.log("excellent! It's precicely the directiveFn defind on the editorTab attached to scope!");
      console.log("how does editorTab get attached to scope? It's passed in to the editorTab");
      if (!directiveInfo || !directiveInfo.fn) {
        elem.empty();
        return;
      }

      if (!directiveInfo.fn.registered) {
        coreModule.directive(attrs.$normalize(directiveInfo.name), directiveInfo.fn);
        directiveInfo.fn.registered = true;
      }

      this.addDirective(elem, directiveInfo.name, scope);
    }).catch(err => {
      console.log('Plugin load:', err);
      this.$rootScope.appEvent('alert-error', ['Plugin error', err.toString()]);
    });
  }

  create(options) {
    console.log(options);
    let directiveDef = {
      restrict: 'E',
      scope: options.scope,
      link: (scope, elem, attrs) => {
        console.log("In link function of directive created by DynamicDirectiveSrv.create()");
        if (options.watchPath) {
          let childScope = null;
          scope.$watch(options.watchPath, () => {
            if (childScope) {
              childScope.$destroy();
            }
            childScope = scope.$new();
            this.link(childScope, elem, attrs, options);
          });
        } else {
          console.log("Else condition is triggerred in DynamicDirectiveSrv; link(scope, elem, attrs, options) will be called");
          this.link(scope, elem, attrs, options);
        }
      }
    };

    return directiveDef;
  }
}

coreModule.service('dynamicDirectiveSrv', DynamicDirectiveSrv);


