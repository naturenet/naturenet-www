(function () {
  'use strict';

  angular
    .module('app.widgets')
    .directive('nnObservationsList', nnObservationsList);

  nnObservationsList.$inject = ['$rootScope', 'utility'];
  /* @ngInject */
  function nnObservationsList($rootScope, utility) {
    var directive = {
      scope: {
        observations: '=',
        limit: '@',
      },
      link: link,
      templateUrl: 'app/widgets/nn-observations-list.html',
      restrict: 'EA',
    };
    return directive;

    function link(scope, element, attrs) {
      scope.$watch('observations', resetLimit);

      var limitIncrement = scope.limit.slice(0);
      scope.formatDate = utility.formatDate;
      scope.showObservation = showObservation;
      scope.incrementLimit = incrementLimit;

      function showObservation(o) {
        $rootScope.$broadcast('map:show', o);
      }

      function incrementLimit() {
        scope.limit = parseInt(scope.limit) + parseInt(limitIncrement);
      }

      function resetLimit() {
        scope.limit = parseInt(limitIncrement);
      }
    }
  }
})();
