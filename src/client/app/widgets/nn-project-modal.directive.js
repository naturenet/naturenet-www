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
        scope.show = true;
      };

      function hide() {
        scope.show = false;
      }
    }

    function controller($scope, dataservice) {
    }
  }
})();
