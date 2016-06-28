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
    '$filter',
    'logger',
    'utility',
    'dataservice',
  ];

  /* @ngInject */
  function CommunitiesController(
    $q,
    $rootScope,
    $filter,
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
    vm.userSite = '';
    vm.userAvatar = '';
    vm.isSelf = false;
    vm.users = [];
    vm.groups = [];
    vm.sites = [];
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
    vm.showUpdate = showUpdate;
    vm.formatDate = utility.formatDate;

    activate();

    /* Activate function
       ================================================== */

    function activate() {
      utility.showSplash();

      var promises = [getUserRecentId(), getUsersArray(), getGroupsArray(), getSitesArray()];
      return $q.all(promises)
        .then(function () {
          utility.hideSplash();
          logger.info('Activated Communities View');
        });
    }

    /* Data functions
       ================================================== */

    function getUserRecentId() {
      return dataservice.getUsersRecent(1)
        .then(function (data) {
          updateUserId(data[0].id);
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

    function getSitesArray() {
      return dataservice.getArray('sites')
        .then(function (data) {
          vm.sites = data;
          return vm.sites;
        })
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

    function getAvatarByUserId(id) {
      if ($rootScope.users[id] && $rootScope.users[id].avatar) {
        vm.userAvatar = $rootScope.users[id].avatar;
      } else {
        vm.userAvatar = 'images/default-avatar.png';
      }
    }

    function getSiteNameByUserId(id) {
      if ($rootScope.users[id].affiliation) {
        return dataservice.getSiteById($rootScope.users[id].affiliation)
          .then(function (data) {
            vm.userSite = data.name;
            return vm.userSite;
          });
      } else {
        vm.userSite = '';
        return vm.userSite;
      }
    }

    function checkForSelf() {
      var auth = dataservice.getAuth();
      vm.isSelf = (auth && auth.uid === vm.userId);
    }

    /* Click functions
       ================================================== */

    function updateUserId(id) {
      var promises = [getObservationsByUserId(id), getGroupsByUserId(id), getSiteNameByUserId(id)];
      return $q.all(promises)
        .then(function () {
          vm.userId = id;
          vm.observationsDisplayLimit = vm.displayLimit;
          vm.groupsDisplayLimit = vm.displayLimit;
          getAvatarByUserId(id);
          checkForSelf();
          logger.info('Updated Communities View based on new userId');
        });
    }

    function showUpdate() {
      $rootScope.$broadcast('account:edit');
    }

  }
})();
