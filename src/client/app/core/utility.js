(function () {
  'use strict';

  angular
    .module('app.core')
    .factory('utility', utility);

  /* Utility
     ======================================================================== */

  utility.$inject = ['$rootScope', '$timeout'];
  /* @ngInject */
  function utility($rootScope, $timeout) {
    var service = {
      formatDate: formatDate,
      showSplash: showSplash,
      hideSplash: hideSplash,
    };

    return service;

    /* Date functions
       ================================================== */

    function formatDate(date) {
      var formatedDate = moment(date).format('MMM DD YYYY').toString();

      //MMMM Do YYYY, h:mm:ss a

      return formatedDate;
    }

    /* Overlay function
       ================================================== */

    function showSplash() {
      $rootScope.showSplash = true;
    }

    function hideSplash() {
      //Force a 1 second delay so we can see the splash.
      $timeout(function () {
        $rootScope.showSplash = false;
      }, 1000);
    }
  }
})();
