(function () {
  'use strict';

  angular
    .module('app.core')
    .factory('utility', utility)

    // taken from https://gist.github.com/katowulf/bee266e31aa60cb0eed6
    .factory('FilteredArray', function filteredArray($firebaseArray) {
      function FilteredArray(ref, filterFn) {
        this.filterFn = filterFn;
        return $firebaseArray.call(this, ref);
      }

      FilteredArray.prototype.$$added = function (snap) {
        var rec = $firebaseArray.prototype.$$added.call(this, snap);
        if (!this.filterFn || this.filterFn(rec)) {
          return rec;
        }
      };

      return $firebaseArray.$extend(FilteredArray);
    })
    .service('notDeleted', notDeleted)

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
    })
    .filter('img_thumb', [
      function () {
        return function (text) {
          return String(text).replace('upload/', 'upload/t_web-thumbnail/');
        };
      },
    ])
    .filter('img_preview', [
      function () {
        return function (text) {
          return String(text).replace('upload/', 'upload/t_web-preview/');
        };
      },
    ])
    .filter('img_sidebar', [
      function () {
        return function (text) {
          return String(text).replace('upload/', 'upload/t_web-sidebar/');
        };
      },
    ])
    .filter('img_large', [
      function () {
        return function (text) {
          return String(text).replace('upload/', 'upload/t_web-large/');
        };
      },
    ])
    .filter('img_fullscreen', [
      function () {
        return function (text) {
          return String(text).replace('upload/', 'upload/t_web-fullscreen');
        };
      },
    ]);

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

    var splashCounter = 0;

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
      splashCounter += 1;
    }

    function hideSplash() {
      splashCounter -= 1;
      if (splashCounter < 1) {
        $rootScope.showSplash = false;
      }
    }
  }

  /* Filter functions
   ================================================== */

  function notDeleted() {
    return function (input) {
      return !(input[i].hasOwnProperty('status') && input[i].status.toLowerCase() === 'deleted');
    };
  };
})();
