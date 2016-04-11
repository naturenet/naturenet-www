(function () {
  'use strict';

  angular
    .module('app.home')
    .controller('HomeController', HomeController);

  /* Home controller
     ======================================================================== */

  HomeController.$inject = [
    '$q',
    '$rootScope',
    'logger',
    'utility',
    'dataservice',
  ];

  /* @ngInject */
  function HomeController(
    $q,
    $rootScope,
    logger,
    utility,
    dataservice
  ) {
    var vm = this;
    vm.title = 'Home';

    /* Variables
       ================================================== */

    // Data
    vm.observations = [];
    vm.ideas = [];

    vm.observationsDisplayLimit = 5;
    vm.ideasDisplayLimit = 5;

    // Function assignments
    vm.showObservation = showObservation;
    vm.formatDate = utility.formatDate;

    activate();

    /* Activate function
       ================================================== */

    function activate() {
      utility.showSplash();

      var promises = [getObservations(), getIdeas()];
      return $q.all(promises)
        .then(function () {
          utility.hideSplash();
          logger.info('Activated Home View');
        });
    }

    /* Data functions
       ================================================== */

    function getObservations() {
      return dataservice.getArray('observations')
        .then(function (data) {
          vm.observations = data;
          return vm.observations;
        });
    }

    function getIdeas() {
      return dataservice.getArray('ideas')
        .then(function (data) {
          vm.ideas = data;
          return vm.ideas;
        });
    }

    /* Click functions
       ================================================== */

    function showObservation(o) {
      $rootScope.$broadcast('map:show', o);
    }

  }
})();
