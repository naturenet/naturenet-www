(function () {
  'use strict';

  angular
    .module('app.widgets')
    .directive('nnStatus', nnStatus);

  /* @ngInject */
  function nnStatus() {
    // Usage:
    // Creates:
    var directive = {
      scope: {
        idea_: '=',
        cache_: '=',
        item: '=',
      },
      link: link,
      templateUrl: 'app/widgets/nn-status.html',
      restrict: 'EA',
    };
    return directive;

    function link(scope, element, attrs) {

      scope.options = [
        {lab: "Discussing", val: "doing"},
        {lab: "Developing", val: "developing"},
        {lab: "Testing", val: "testing"},
        {lab: "Done", val: "done"},
        {lab: "Superceded", val: "superceded"}
      ]
    }
  }
})();
