(function () {
  'use strict';

  angular
    .module('app.ideas')
    .controller('IdeasController', IdeasController);

  /* Design Ideas controller
     ======================================================================== */

  IdeasController.$inject = ['$q', 'dataservice', 'logger'];
  /* @ngInject */
  function IdeasController($q, dataservice, logger) {
    var vm = this;
    vm.title = 'Design Ideas';

    activate();

    /* Activate function
       ================================================== */

    function activate() {
      var promises = [];
      return $q.all(promises).then(function () {
        logger.info('Activated Design Ideas View');
      });
    }
  }

})();
