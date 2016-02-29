(function () {
  'use strict';

  angular
    .module('app.layout')
    .controller('HeaderController', HeaderController);

  /* Header controller
     ======================================================================== */

  HeaderController.$inject = ['$rootScope', '$scope', '$state', 'routerHelper', 'logger'];
  /* @ngInject */
  function HeaderController($rootScope, $scope, $state, routerHelper, logger) {
    var vm = this;
    var states = routerHelper.getStates();

    vm.getClasses = getClasses;

    vm.isMapActive = false;
    vm.toggleMap = toggleMap;
    vm.hideMap = hideMap;

    activate();

    /* Activate function
       ================================================== */

    function activate() {
      getNavRoutes();
    }

    /* Route function
       ================================================== */

    function getNavRoutes() {
      vm.navRoutes = states.filter(function (r) {
        return r.settings && r.settings.nav;
      }).sort(function (r1, r2) {
        return r1.settings.nav - r2.settings.nav;
      });
    }

    /* Css class function
       ================================================== */

    function getClasses(route) {
      return getRouteName(route) + ' ' + isCurrent(route);
    }

    function getRouteName(route) {
      return 'item-' + route.name;
    }

    function isCurrent(route) {
      if (!route.title || !$state.current || !$state.current.title) {
        return '';
      }

      var menuName = route.title;
      return $state.current.title.substr(0, menuName.length) === menuName ? 'is-current' : '';
    }

    /* Map function
       ================================================== */

    function toggleMap() {
      $rootScope.$broadcast('map:toggle');
      vm.isMapActive = !vm.isMapActive;
    }

    function hideMap() {
      $rootScope.$broadcast('map:hide');
      vm.isMapActive = false;
    }
  }
})();
