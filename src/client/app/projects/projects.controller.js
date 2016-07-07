(function () {
  'use strict';

  angular
    .module('app.projects')
    .controller('ProjectsController', ProjectsController);

  /* Projects controller
     ======================================================================== */

  ProjectsController.$inject = [
    '$q',
    '$filter',
    'logger',
    'utility',
    'dataservice',
  ];

  /* @ngInject */
  function ProjectsController(
    $q,
    $filter,
    logger,
    utility,
    dataservice
  ) {
    var vm = this;
    vm.title = 'Projects';

    /* Variables
       ================================================== */

    // Constants
    vm.displayLimit = 6;

    // Data
    vm.projectId = void 0;
    vm.localSite = void 0;
    vm.localProjects = [];
    vm.projects = [];
    vm.projectObservations = [];

    // States
    vm.isProjectsListVisible = true;

    // Function assignments
    vm.updateProjectId = updateProjectId;
    vm.formatDate = utility.formatDate;

    activate();

    /* Activate function
       ================================================== */

    function activate() {
      utility.showSplash();

      var promises = [getProjectRecentId(), getProjectsArray(), getLocalProjectsArray()];
      return $q.all(promises)
        .then(function () {
          var promises = [getObservationsByProjectId(vm.projectId)];
          $q.all(promises)
            .then(function () {
              utility.hideSplash();
              logger.info('Activated Projects View');
            });
        });
    }

    /* Data functions
       ================================================== */

    function getProjectRecentId() {
      return dataservice.getProjectsRecent(1)
        .then(function (data) {
          vm.projectId = data[0].id;
          return vm.projectId;
        });
    }

    function getProjectsArray() {
      return dataservice.getArray('activities')
        .then(function (data) {
          vm.projects = $filter('orderBy')(data, 'latest_contribution', true);
          return vm.projects;
        });
    }

    function getLocalProjectsArray() {
      return dataservice.getProjectsAtSite('rcnc')
        .then(function (data) {
          vm.localProjects = data;
          return vm.localProjects;
        });
    }

    function getObservationsByProjectId(id) {
      return dataservice.getObservationsArrayByProjectId(id)
        .then(function (data) {
          vm.projectObservations = data;
          return vm.projectObservations;
        });
    }

    /* Project function
       ================================================== */

    function updateProjectId(id) {
      var promises = [getObservationsByProjectId(id)];
      return $q.all(promises)
        .then(function () {
          vm.projectId = id;
          logger.info('Updated Projects View based on new projectId');
        });
    }
  }

})();
