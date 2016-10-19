(function () {
  'use strict';

  angular
    .module('app.widgets')
    .directive('nnObservation', nnObservation);

  nnObservation.$inject = ['logger'];

  function nnObservation(logger) {

    var directive = {
      scope: {
        observation: '=',
        editable: '=',
      },
      link: link,
      templateUrl: 'app/widgets/nn-observation.html',
      restrict: 'EA',
      controller: ['$scope', 'dataservice', controller],
    };
    return directive;

    function link(scope, element, attrs) {
      scope.isEditMode = false;
      scope.getProjects();

      scope.edit = function() {
        scope.isEditMode = true;
        scope.cache = angular.copy(scope.observation);
      }

      scope.cancel = function() {
        scope.isEditMode = false;
        scope.observation = scope.cache;
      }
    }

    function controller($scope, dataservice) {

      $scope.saveChanges = function () {
        $scope.isEditMode = false;
        dataservice.updateObservation($scope.observation.id, $scope.observation.activity, $scope.observation.data.text).then(function(result) {
          console.log(result);
          logger.success('Your observation has been updated.');
        });
      };

      $scope.delete = function() {
        dataservice.deleteContent('observations', $scope.observation.id).then(function(result) {
          console.log(result);
          logger.success('The observation has been deleted.');
        });
      }

      $scope.getProjects = function () {
        dataservice.getArray('activities').then(function (data) {
          console.log(data);
          $scope.allProjects = data;
          return data;
        });
      };

    }
  }
})();
