(function () {
  'use strict';

  angular
    .module('app.widgets')
    .directive('nnComment', nnComment);

  nnComment.$inject = ['utility'];
  /* @ngInject */
  function nnComment(utility) {
    // Usage:
    //   <nn-comment class="comment"
    //     comment="The comment."
    //     name="John Doe"
    //     date="Jan 28 2016"
    //     avatar-url="avatarUrl">
    //   </nn-comment>
    // Creates:
    //   <div class="comment">
    //     <nn-badge></nn-badge>
    //     <div class="comment__text">The comment.</div>
    //   </div>
    var directive = {
      scope: {
        avatarUrl: '@',
        name: '@',
        date: '@',
        comment: '@',
      },
      link: link,
      templateUrl: 'app/widgets/nn-comment.html',
      restrict: 'EA',
    };
    return directive;

    function link(scope, element, attrs) {
      scope.formatDate = utility.formatDate;

      if (scope.comment === '[no description]') {
        scope.text = '';
      } else {
        scope.text = scope.comment;
      }
    }
  }
})();
