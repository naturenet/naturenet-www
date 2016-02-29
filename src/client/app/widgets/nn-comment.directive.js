(function () {
  'use strict';

  angular
    .module('app.widgets')
    .directive('nnComment', nnComment);

  /* @ngInject */
  function nnComment() {
    //Usage:
    // <div nn-comment></div>
    // Creates:
    // <div class="comment">
    //   <div nn-user-details class="user-details comment__user"></div>
    //   <div class="comment__text">{{comment}}</div>
    // </div>
    var directive = {
      scope: {
        avatarUrl: '@',
        name: '@',
        date: '@',
        comment: '@',
      },
      templateUrl: 'app/widgets/nn-comment.html',
      restrict: 'EA',
    };
    return directive;
  }
})();
