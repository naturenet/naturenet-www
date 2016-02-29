(function () {
  'use strict';

  angular
    .module('app.layout')
    .controller('ShellController', ShellController);





  /* Shell controller
     ======================================================================== */

  ShellController.$inject = ['$rootScope', '$timeout', 'config', 'logger'];
  /* @ngInject */
  function ShellController($rootScope, $timeout, config, logger) {
    var vm = this;
    vm.busyMessage = 'Please wait ...';
    vm.isBusy = true;
    $rootScope.showSplash = true;

    activate();





    /* Activate function
       ================================================== */

    function activate() {
      logger.success(config.appTitle + ' loaded!', null);
      hideSplash();
    }





    /* Overlay function
       ================================================== */

    function hideSplash() {
      //Force a 1 second delay so we can see the splash.
      $timeout(function () {
        $rootScope.showSplash = false;
      }, 1000);
    }
  }
})();
