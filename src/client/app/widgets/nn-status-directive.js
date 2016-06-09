(function () {
  'use strict';

  angular
    .module('app.widgets')
    .directive('nnStatus', nnStatus);

  /* @ngInject */
  function nnStatus() {
    // Usage:
    // Creates:
    var directive = {
      scope: {
        status: '=',
      },
      link: link,
      templateUrl: 'app/widgets/nn-status.html',
      restrict: 'EA',
    };
    return directive;

    function link(scope, element, attrs) {
    }
  }
})();
