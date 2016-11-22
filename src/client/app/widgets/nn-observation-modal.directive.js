(function () {
  'use strict';

  angular
    .module('app.widgets')
    .directive('nnObservationModal', nnObservationModal);

  nnObservationModal.$inject = ['utility'];
  /* @ngInject */
  function nnObservationModal(utility) {
    // Usage:
    // Creates:
    var directive = {
      scope: {
        observation: '=',
        comments: '=',
        show: '=',
      },
      link: link,
      templateUrl: 'app/widgets/nn-observation-modal.html',
      restrict: 'EA',
    };
    return directive;

    function link(scope, element, attrs) {
      scope.formatDate = utility.formatDate;
      scope.hide = hide;

      function hide() {
        scope.show = false;
      }
    }
  }
})();
