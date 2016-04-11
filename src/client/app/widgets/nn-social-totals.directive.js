(function () {
  'use strict';

  angular
    .module('app.widgets')
    .directive('nnSocialTotals', nnSocialTotals);

  /* @ngInject */
  function nnSocialTotals() {
    // Usage:
    //   <nn-social-totals class="totals" data="obj">
    //   </nn-social-totals>
    // Creates:
    //   <div class="totals">
    //     <div class="totals__likes">1</div>
    //     <div class="totals__dislikes">2</div>
    //     <div class="totals__comments">3</div>
    //   </div>
    var directive = {
      scope: {
        data: '=',
        showDislikes: '@',
      },
      link: link,
      templateUrl: 'app/widgets/nn-social-totals.html',
      restrict: 'EA',
    };
    return directive;

    function link(scope, element, attrs) {
      scope.$watch('data', findTotals);

      function findTotals() {
        scope.likes = findTotal('likes');
        scope.dislikes = findTotal('dislikes');
        scope.comments = findTotal('comments');
      }

      function findTotal(key) {
        if (!!scope.data[key]) {
          var total = 0;
          var k = void 0;

          for (k in scope.data[key]) {
            if (scope.data[key][k]) {
              total++;
            }
          }

          return total;
        } else {
          return 0;
        }
      }
    }
  }
})();
