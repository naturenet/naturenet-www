(function () {
  'use strict';

  angular
    .module('app.widgets')
    .directive('nnDropdown', nnDropdown);

  nnDropdown.$inject = ['$rootScope', 'logger'];
  /* @ngInject */
  function nnDropdown($rootScope, logger) {
    // Usage:
    //   <div nn-dropdown class="dropdown"></div>
    // Creates:
    //
    var directive = {
      scope: {
        // placeholder text for the dropdown
        placeholder: '@',

        // list of options for the dropdown
        options: '=',

        // the selected option
        selectedOption: '=',

        // name of property used to display
        property: '@',
      },
      link: link,
      templateUrl: 'app/widgets/nn-dropdown.html',
      restrict: 'EA',
    };
    return directive;

    function link(scope, element, attrs) {
      scope.listVisible = false;
      scope.isPlaceholder = true;

      scope.isCurrent = isCurrent;
      scope.toggleOptions = toggleOptions;
      scope.selectOption = selectOption;

      activate();

      function activate() {
        if (scope.options.some(function (o) { return o === scope.selectedOption; })) {

          scope.isPlaceholder = scope.selectedOption[scope.property] === undefined;
          scope.display = scope.selectedOption[scope.property];
        }
      }

      function isCurrent(item) {
        if (!scope.isPlaceholder) {
          return item[scope.property] === scope.selectedOption[scope.property] ? 'is-current' : '';

        }
      }

      function toggleOptions() {
        scope.listVisible = !scope.listVisible;
      }

      function selectOption(option) {
        scope.isPlaceholder = false;
        scope.selectedOption = option;
        scope.listVisible = false;
        scope.display = scope.selectedOption[scope.property];
      }
    }
  }
})();
