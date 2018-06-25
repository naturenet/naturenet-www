(function () {
  'use strict';

  angular
    .module('app.widgets')
    .directive('nnObservationModal', nnObservationModal);

  nnObservationModal.$inject = ['utility', 'logger', '$rootScope'];
  /* @ngInject */
  function nnObservationModal(utility, logger, $rootScope) {
    // Usage:
    // Creates:
    var directive = {
      scope: {
        observation: '=',
        comments: '=',
        show: '=',
        editable: '=',
        "avatar-url": '=',
      },
      link: link,
      templateUrl: 'app/widgets/nn-observation-modal.html',
      restrict: 'EA',
      controller: ['$scope', 'dataservice', controller],
    };
    return directive;

    function link(scope, element, attrs) {
      scope.isEditMode = false;
      scope.formatDate = utility.formatDate;
      scope.hide = hide;
      scope.getProjects();

      function hide() {
        scope.show = false;
      }

      scope.edit = function () {
        scope.isEditMode = true;
        scope.cache = angular.copy(scope.observation);
      };

      scope.search = function (e) {
        var tagText = e.target.innerText;
        console.log(tagText);
        $rootScope.$broadcast('search', tagText);
      };

      scope.cancel = function () {
        scope.isEditMode = false;
        scope.observation = scope.cache;
      };
    }
    function controller($scope, dataservice, hashtagify) {

      $scope.saveChanges = function () {
        $scope.isEditMode = false;
        dataservice.updateObservation($scope.observation.id, $scope.observation.activity, $scope.observation.data.text)
          .then(function (result) {
            logger.success('Your observation has been updated.');
          });
      };

      $scope.delete = function () {
        if (confirm('Are you sure you want to delete your observation?')) {
          dataservice.deleteContent('observations', $scope.observation.id).then(function (result) {
            $scope.$emit('delete', $scope.observation.id);
            logger.success('The observation has been deleted.');
          });
        }
      };

      $scope.deleteComment = function (comment) {
        console.log(comment);
        if (confirm('Are you sure you want to delete your comment?')) {
          dataservice.deleteComment('comments', comment.id).then(function (result) {
            $scope.$emit('delete', comment.id);
            logger.success('The observation has been deleted.');
          });
        }
      };


      $scope.getProjects = function () {
        dataservice.getArray('activities').then(function (data) {
          $scope.allProjects = data;
          return data;
        });
      };

    }
  }
})();
