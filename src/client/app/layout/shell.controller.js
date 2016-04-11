(function () {
  'use strict';

  angular
    .module('app.layout')
    .controller('ShellController', ShellController);

  /* Shell controller
     ======================================================================== */

  ShellController.$inject = [
    '$q',
    '$rootScope',
    'logger',
    'config',
    'utility',
    'dataservice',
  ];

  /* @ngInject */
  function ShellController(
    $q,
    $rootScope,
    logger,
    config,
    utility,
    dataservice
  ) {
    var vm = this;

    /* Variables
       ================================================== */

    // States
    vm.isAuth = false;

    // Function assignments
    vm.hideAuth = hideAuth;
    vm.broadcastHideAuth = broadcastHideAuth;

    activate();

    /* Activate function
       ================================================== */

    function activate() {
      logger.info(config.appTitle + ' loaded!', null);
      utility.showSplash();

      var promises = [getUsers(), getGroups(), getProjects()];
      return $q.all(promises)
        .then(function () {
          utility.hideSplash();
        });
    }

    /* Data functions
       ================================================== */

    function getUsers() {
      return dataservice.getUsers()
        .then(function (data) {
          $rootScope.users = data;
          return $rootScope.users;
        });
    }

    function getGroups() {
      return dataservice.getGroups()
        .then(function (data) {
          $rootScope.groups = data;
          return $rootScope.groups;
        });
    }

    function getProjects() {
      return dataservice.getProjects()
        .then(function (data) {
          $rootScope.projects = data;
          return $rootScope.projects;
        });
    }

    /* Click function
       ================================================== */

    function broadcastHideAuth() {
      $rootScope.$broadcast('auth:hide');
    }

    /* Listener Functions
       ================================================== */

    $rootScope.$on('register:show', showAuth);
    $rootScope.$on('signin:show', showAuth);
    $rootScope.$on('auth:hide', hideAuth);

    function showAuth() {
      vm.isAuth = true;
    }

    function hideAuth() {
      vm.isAuth = false;
    }

  }
})();
