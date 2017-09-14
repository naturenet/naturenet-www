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
    vm.mainDisplayLimit = 4;

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
    vm.groupId = void 0;
    vm.group = {};
    vm.observations = {};
    vm.ideas = {};

    vm.peopleDisplayLimit = vm.sidebarDisplayLimit;
    vm.groupsDisplayLimit = vm.sidebarDisplayLimit;
    vm.observationsDisplayLimit = vm.mainDisplayLimit;
    vm.ideasDisplayLimit = vm.mainDisplayLimit;
    vm.groupsDisplayLimit = vm.mainDisplayLimit;

    // States
    vm.isPeopleListVisible = true;
    vm.isGroupsListVisible = true;

    // Function assignments
    vm.updateUserId = updateUserId;
    vm.updateGroupId = updateGroupId;
    vm.showUpdate = showUpdate;
    vm.showMore = showMore;
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
      var auth = dataservice.getAuth();
      if (auth && auth.uid) {
        updateUserId(auth.uid);
      } else {
        return dataservice.getUsersRecent(1)
          .then(function (data) {
            updateUserId(data[0].id);
            return vm.userId;
          });
      }
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
      return dataservice.getSites()
        .then(function (data) {
          vm.sites = data;
          return vm.sites;
        });
    }

    function getObservationsByUserId(id) {
      return dataservice.getObservationsByUserId(id)
        .then(function (data) {
          vm.observations[id] = data;
          vm.numberOfObservations = 0;
          return vm.observations[id];
        });
    }

    function getIdeasByUserId(id) {
      return dataservice.getIdeasByUserId(id)
        .then(function (data) {
          vm.ideas[id] = data;
          vm.numberOfIdeas = 0;
          return vm.ideas[id];
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
        vm.userAvatar = '';
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
      vm.groupId = void 0;
      var promises = [getObservationsByUserId(id), getIdeasByUserId(id), getGroupsByUserId(id), getSiteNameByUserId(id)];
      return $q.all(promises)
        .then(function () {
          vm.userId = id;
          vm.observationsDisplayLimit = vm.displayLimit;
          vm.ideasDisplayLimit = vm.displayLimit;
          vm.groupsDisplayLimit = vm.displayLimit;
          getAvatarByUserId(id);
          checkForSelf();
          logger.info('Updated Communities View based on new userId');
        });
    }

    function updateGroupId(id) {
      vm.userId = void 0;
      return dataservice.getGroupById(id)
        .then(function (data) {
          vm.groupId = id;
          vm.group = data;
          vm.groupMembers = Object.keys(data.members || {});
          for (var m in data.members) {
            getObservationsByUserId(m);
          }
        });
    }

    function showUpdate() {
      $rootScope.$broadcast('account:edit');
    }

    function showMore() {
      vm.query = '';
      vm.peopleDisplayLimit = vm.peopleDisplayLimit + vm.sidebarDisplayLimit;
    }

  }
})();
