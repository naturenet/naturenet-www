(function () {
  'use strict';

  angular
    .module('app.widgets')
    .directive('nnProjectModal', nnProjectModal);

  nnProjectModal.$inject = ['utility', 'logger'];
  /* @ngInject */
  function nnProjectModal(utility, logger) {
    // Usage:
    // Creates:
    var directive = {
      scope: {
        url: '=',
        title: '=',
        description: '=',
        comments: '=',
        observation: '=',
        observations: '=',
        displayLimit: '=',
        show: '=',
        editable: '=',
        project: '=',
      },
      link: link,
      templateUrl: 'app/widgets/nn-project-modal.html',
      restrict: 'EA',
      controller: ['$scope', 'dataservice', controller],
    };
    return directive;

    function link(scope, element, attrs) {
      scope.formatDate = utility.formatDate;
      scope.hide = hide;
      scope.isEditMode = false;

      scope.open = function () {
        scope.resetObservation();
        scope.show = true;
      };

      scope.resetObservation = function () {
        scope.observation = {};
      }

      scope.edit = function () {
        scope.isEditMode = true;
        scope.cacheTitle = angular.copy(scope.title);
        scope.cacheDescription = angular.copy(scope.description);
      };

      scope.cancel = function () {
        scope.isEditMode = false;
        scope.description = scope.cacheDescription;
        scope.title = scope.cacheTitle;
      };

      function hide() {
        scope.resetObservation();
        scope.show = false;
      }
    }

    function controller($scope, dataservice, hashtagify) {
      $scope.saveChanges = function () {
        dataservice.updateProject($scope.project.id, $scope.project.name, $scope.project.description)
          .then(function (result) {
            logger.success('Your project has been updated.');
            $scope.isEditMode = false;
          });
      };
    }
  }
})();
