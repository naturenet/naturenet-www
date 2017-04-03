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

      animateSplash();

      var promises = [getUsers(), getGroups(), getProjects()];
      return $q.all(promises)
        .then(function () {
          utility.hideSplash();
        });
    }

    function animateSplash() {
      // Increment splash counter again so it stays visible until this animation completes
      utility.showSplash();
      var dX = $('#overlay__two').width() / 2;
      $('#overlay__logo').animate({ left: '-=' + (dX + 140) }, function () {
        $('#overlay__one').fadeToggle(1000).fadeToggle(1000, function () {
          $('#overlay__two').fadeToggle(1000).delay(1000).fadeToggle(1000, function () {
            $('#overlay__logo').animate({ left: '+=' + (dX + 140) }, utility.hideSplash);
          });
        });
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

    $rootScope.$on('account:edit', showAuth);
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
