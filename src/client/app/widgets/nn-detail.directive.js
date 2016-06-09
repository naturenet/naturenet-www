(function () {
  'use strict';

  angular
    .module('app.widgets')
    .directive('nnDetail', nnDetail);

  nnDetail.$inject = ['utility'];
  /* @ngInject */
  function nnDetail(utility) {
    // Usage:
    // Creates:
    var directive = {
      scope: {
        item: '=',
        comments: '=',
        context: '@',
        show: '=',
      },
      link: link,
      templateUrl: 'app/widgets/nn-detail.html',
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
