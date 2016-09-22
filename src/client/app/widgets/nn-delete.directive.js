(function () {
  'use strict';

  angular
    .module('app.widgets')
    .directive('nnDelete', nnDelete);

  /* @ngInject */
  function nnDelete() {
    // Usage:
    // Creates:
    var directive = {
      scope: {
        id: '=',
        context: '@',
      },
      link: link,
      templateUrl: 'app/widgets/nn-delete.html',
      restrict: 'EA',
      controller: ['$scope', '$mdDialog', 'dataservice', controller],
    };
    return directive;

    function link(scope, element, attrs) {

    }

    function controller($scope, $mdDialog, dataservice) {
      $scope.delete = function() {
        var confirm = $mdDialog.confirm()
          .title('Are you sure you want to delete this contribution?')
          .ariaLabel('Delete?')
          .targetEvent(ev)
          .ok('DELETE')
          .cancel('Cancel');
        $mdDialog.show(confirm).then(function() {
          dataservice.deleteContent($scope.context, $scope.id);
        });
      };
    }
  }
})();
