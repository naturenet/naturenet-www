(function () {
  'use strict';

  angular
    .module('app.widgets')
    .directive('nnProjectModal', nnProjectModal);

  nnProjectModal.$inject = ['utility', 'logger'];
  /* @ngInject */
  function nnProjectModal(utility, logger) {
    // Usage:
    // Creates:
    var directive = {
      scope: {
        url: '=',
        title: '=',
        description: '=',
        observation: '=',
        observations: '=',
        displayLimit: '=',
        show: '=',
      },
      link: link,
      templateUrl: 'app/widgets/nn-project-modal.html',
      restrict: 'EA',
      controller: ['$scope', 'dataservice', controller],
    };
    return directive;

    function link(scope, element, attrs) {
      scope.formatDate = utility.formatDate;
      scope.hide = hide;

      scope.open = function () {
        scope.resetObservation();
        scope.show = true;
      };

      scope.resetObservation = function () {
        scope.observation = {};
      }

      function hide() {
        scope.resetObservation();
        scope.show = false;
      }
    }

    function controller($scope, dataservice) {
    }
  }
})();
