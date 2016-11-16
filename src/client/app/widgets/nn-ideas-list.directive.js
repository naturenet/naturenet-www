(function () {
  'use strict';

  angular
    .module('app.widgets')
    .directive('nnIdeasList', nnIdeasList);

  nnIdeasList.$inject = ['$rootScope', 'utility'];
  /* @ngInject */
  function nnIdeasList($rootScope, utility) {
    var directive = {
      scope: {
        ideas: '=',
        limit: '@',
        expandable: '@',
      },
      link: link,
      templateUrl: 'app/widgets/nn-ideas-list.html',
      restrict: 'EA',
    };
    return directive;

    function link(scope, element, attrs) {
      scope.$watch('ideas', resetLimit);

      var limitIncrement = scope.limit.slice(0);
      scope.formatDate = utility.formatDate;
      scope.showIdea = showIdea;
      scope.incrementLimit = incrementLimit;

      function showIdea(i) {
        
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
