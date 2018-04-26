(function () {
  'use strict';

  angular
    .module('app.widgets')
    .directive('nnIdeaModal', nnIdeaModal);

  nnIdeaModal.$inject = ['utility', 'logger'];
  /* @ngInject */
  function nnIdeaModal(utility, logger) {
    // Usage:
    // Creates:
    var directive = {
      scope: {
        idea: '=',
        comments: '=',
        show: '=',
        editable: '=',
        isEditMode: '@',
      },
      link: link,
      templateUrl: 'app/widgets/nn-idea-modal.html',
      restrict: 'EA',
      controller: ['$scope', 'dataservice', controller],
    };
    return directive;

    function link(scope, element, attrs) {
      scope.formatDate = utility.formatDate;
      scope.hide = hide;
      scope.isEditMode = false;
      scope.groups = [
        { id: 'idea', name: 'Design Idea' },
        { id: 'challenge', name: 'Design Challenge' },
      ];
      scope.types = ['New Features', 'Project Ideas', 'Community Ideas', 'Improvement Ideas'];

      scope.edit = function () {
        scope.isEditMode = true;
        scope.cache = angular.copy(scope.idea);
      };

      scope.cancel = function () {
        scope.isEditMode = false;
      };

      function hide() {
        scope.show = false;
      }
    }

    function controller($scope, dataservice) {

      $scope.saveChanges = function () {
        $scope.isEditMode = false;
        console.log($scope.cache);
        dataservice.updateIdea($scope.cache.id, $scope.cache.content, $scope.cache.status)
          .then(function (result) {
            logger.success('Your idea has been updated.');
          });
      };

      $scope.delete = function () {
        if (confirm('Are you sure you want to delete your idea?')) {
          dataservice.deleteContent('ideas', $scope.idea.id).then(function (result) {
            $scope.$emit('delete', $scope.idea.id);
            logger.success('The idea has been deleted.');
          });
        }
      };

    }
  }
})();
