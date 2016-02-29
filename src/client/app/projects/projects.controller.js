(function () {
  'use strict';

  angular
    .module('app.projects')
    .controller('ProjectsController', ProjectsController);

  /* Projects controller
     ======================================================================== */

  ProjectsController.$inject = ['$q', 'dataservice', 'logger'];
  /* @ngInject */
  function ProjectsController($q, dataservice, logger) {
    var vm = this;
    vm.title = 'Projects';
    vm.projects = [];

    activate();

    /* Activate function
       ================================================== */

    function activate() {
      var promises = [];
      return $q.all(promises).then(function () {
        logger.info('Activated Projects View');
      });
    }
  }

})();
