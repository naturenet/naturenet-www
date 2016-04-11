(function () {
  'use strict';

  angular
    .module('app.communities')
    .controller('CommunitiesController', CommunitiesController);

  /* Communities controller
     ======================================================================== */

  CommunitiesController.$inject = [
    '$q',
    '$rootScope',
    'logger',
    'utility',
    'dataservice',
  ];

  /* @ngInject */
  function CommunitiesController(
    $q,
    $rootScope,
    logger,
    utility,
    dataservice
  ) {
    var vm = this;
    vm.title = 'Communities';

    /* Variables
       ================================================== */

    // Constants
    vm.sidebarDisplayLimit = 5;
    vm.mainDisplayLimit = 6;

    // Data
    vm.userId = void 0;
    vm.users = [];
    vm.groups = [];
    vm.userObservations = [];
    vm.userGroups = [];

    vm.peopleDisplayLimit = vm.sidebarDisplayLimit;
    vm.groupsDisplayLimit = vm.sidebarDisplayLimit;
    vm.observationsDisplayLimit = vm.mainDisplayLimit;
    vm.groupsDisplayLimit = vm.mainDisplayLimit;

    // States
    vm.isPeopleListVisible = true;
    vm.isGroupsListVisible = true;

    // Function assignments
    vm.updateUserId = updateUserId;
    vm.formatDate = utility.formatDate;

    activate();

    /* Activate function
       ================================================== */

    function activate() {
      utility.showSplash();

      var promises = [getUserRecentId(), getUsersArray(), getGroupsArray()];
      return $q.all(promises)
        .then(function () {
          var promises = [getObservationsByUserId(vm.userId), getGroupsByUserId(vm.userId)];
          $q.all(promises)
            .then(function () {
              utility.hideSplash();
              logger.info('Activated Communities View');
            });
        });
    }

    /* Data functions
       ================================================== */

    function getUserRecentId() {
      return dataservice.getUsersRecent(1)
        .then(function (data) {
          vm.userId = data[0].id;
          return vm.userId;
        });
    }

    function getUsersArray() {
      return dataservice.getArray('users')
        .then(function (data) {
          vm.users = data;
          return vm.users;
        });
    }

    function getGroupsArray() {
      return dataservice.getArray('groups')
        .then(function (data) {
          vm.groups = data;
          return vm.groups;
        });
    }

    function getObservationsByUserId(id) {
      return dataservice.getObservationsArrayByUserId(id)
        .then(function (data) {
          vm.userObservations = data;
          vm.numberOfObservations = 0;
          return vm.userObservations;
        });
    }

    function getGroupsByUserId(id) {
      return dataservice.getGroupsByUserId(id)
        .then(function (data) {
          vm.userGroups = data;
          return vm.userGroups;
        });
    }

    /* Click functions
       ================================================== */

    function updateUserId(id) {
      var promises = [getObservationsByUserId(id), getGroupsByUserId(id)];
      return $q.all(promises)
        .then(function () {
          vm.userId = id;
          vm.observationsDisplayLimit = vm.displayLimit;
          vm.groupsDisplayLimit = vm.displayLimit;
          logger.info('Updated Communities View based on new userId');
        });
    }

  }
})();
