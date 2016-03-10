(function () {
  'use strict';

  angular
    .module('app.communities')
    .controller('CommunitiesController', CommunitiesController);

  /* Communities controller
     ======================================================================== */

  CommunitiesController.$inject = ['$q', 'dataservice', 'logger'];
  /* @ngInject */
  function CommunitiesController($q, dataservice, logger) {
    var vm = this;
    vm.title = 'Communities';
    vm.communities = [];

    activate();

    /* Activate function
       ================================================== */

    function activate() {
      var promises = [];
      return $q.all(promises).then(function () {
        logger.info('Activated Communities View');
      });
    }
  }

})();
