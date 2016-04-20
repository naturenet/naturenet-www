(function () {
  'use strict';

  angular
    .module('app.core')
    .factory('utility', utility)
    .filter('notDeleted', notDeleted)

    //taken from http://stackoverflow.com/a/18604674
    .filter('emptyToEnd', function () {
      return function (array, key) {
        if (!angular.isArray(array)) return;
        var present = array.filter(function (item) {
          return item[key];
        });

        var empty = array.filter(function (item) {
          return !item[key];
        });

        return present.concat(empty);
      };
    });

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

  function notDeleted() {
    return function (input) {
      var out = [];
      for (var i = 0; i < input.length; ++i) {
        if (!(input[i].hasOwnProperty('status') && input[i].status.toLowerCase() === 'deleted')) {
          out.push(input[i]);
        }
      }

      return out;
    };
  };
})();
