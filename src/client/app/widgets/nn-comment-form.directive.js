(function () {
  'use strict';

  angular
    .module('app.widgets')
    .directive('nnCommentForm', nnCommentForm);

  /* @ngInject */
  function nnCommentForm() {
    // Usage:
    //   <nn-comment-form
    //     avatar-url="avatarUrl">
    //   </nn-comment-form>
    // Creates:
    // <div class="badge__avatar" ng-if="showDefault"
    //   style="background-image: url('/images/default-avatar.png')">
    // </div>
    // <div class="badge__avatar" ng-if="!showDefault"
    //   style="background-image: url('{{avatarUrl | thumb}}')">
    // </div>
    // <form class="comment__text clearfix" ng-submit="addComment()">
    //  <input type="text" class="masthead__textarea" placeholder="Write a comment..." ng-model="comment"/>
    //  <input type="submit" style="visibility: hidden;" />
    // </form>
    var directive = {
      scope: {
        data: '=',
        avatarUrl: '@',
        comment: '@',
      },
      link: link,
      templateUrl: 'app/widgets/nn-comment-form.html',
      restrict: 'EA',
      controller: ['$scope', 'dataservice', controller],
    };
    return directive;

    function link(scope, element, attrs) {
      scope.comment = '';
      scope.showDefault = false;

      if (!scope.avatarUrl || scope.avatarUrl === '') {
        scope.showDefault = true;
      }
    }

    function controller($scope, dataservice) {

      $scope.doComment = function () {
        dataservice.addComment($scope.data, $scope.comment);
        $scope.comment = '';
      };

    }
  }
})();
