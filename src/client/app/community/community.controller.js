(function () {
  'use strict';

  angular
    .module('app.community')
    .controller('CommunityController', CommunityController);





  /* Community controller
     ======================================================================== */

  CommunityController.$inject = ['$q', 'dataservice', 'logger'];
  /* @ngInject */
  function CommunityController($q, dataservice, logger) {
    var vm = this;
    vm.title = 'Community';
    vm.community = [];

    activate();





    /* Activate function
       ================================================== */

    function activate() {
      var promises = [];
      return $q.all(promises).then(function () {
        logger.info('Activated Community View');
      });
    }
  }

})();
