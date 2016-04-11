(function () {
  'use strict';

  angular
    .module('app.layout')
    .controller('HeaderController', HeaderController);

  /* Header controller
     ======================================================================== */

  HeaderController.$inject = [
    '$rootScope',
    '$state',
    'routerHelper',
    'logger',
    'dataservice',
  ];

  /* @ngInject */
  function HeaderController(
    $rootScope,
    $state,
    routerHelper,
    logger,
    dataservice
  ) {
    var vm = this;
    var states = routerHelper.getStates();

    /* Variables
       ================================================== */

    // Data
    vm.userUid = void 0;

    // States
    vm.isMapActive = false;
    vm.isAuthenticated = false;

    // Function assignments
    vm.getClasses = getClasses;
    vm.toggleMap = toggleMap;
    vm.showRegister = showRegister;
    vm.showSignin = showSignin;

    activate();

    /* Activate function
       ================================================== */

    function activate() {
      getNavRoutes();
    }

    /* Data functions
       ================================================== */

    function onAuth() {
      return dataservice.onAuth()
        .then(function (data) {
          vm.isAuthenticated = true;
          vm.userUid = data.uid;
          return vm.userUid;
        });
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
      return $state.current.title.substr(0, menuName.length) === menuName
        ? 'is-current'
        : '';
    }

    /* Map function
       ================================================== */

    function toggleMap(isActive) {
      if (typeof (isActive) === 'boolean' && isActive) {
        $rootScope.$broadcast('map:show');
        vm.isMapActive = isActive;
      } else if (typeof (isActive) === 'boolean' && !isActive) {
        $rootScope.$broadcast('map:hide');
        vm.isMapActive = isActive;
      } else if (typeof (isActive) !== 'boolean') {
        $rootScope.$broadcast('map:toggle');
        vm.isMapActive = !vm.isMapActive;
      }
    }

    /* Click function
       ================================================== */

    function showRegister() {
      $rootScope.$broadcast('register:show');
    }

    function showSignin() {
      $rootScope.$broadcast('signin:show');
    }

    /* Listener Functions
       ================================================== */

    $rootScope.$on('auth:success', showUserInfo);
    $rootScope.$on('map:show', showMap);

    function showUserInfo() {
      onAuth();
    }

    function showMap() {
      vm.isMapActive = true;
    }
  }
})();
