/* global google */
(function () {
  'use strict';

  angular
    .module('app.explore')
    .directive('nnMapContain', nnMapContain);

  nnMapContain.$inject = [];
  /* @ngInject */
  function nnMapContain() {
    //Usage:
    //<ng-map nn-map-contain />
    var directive = {
      link: link,
      restrict: 'A',
    };
    return directive;

    function link(scope, element, attrs) {
      var map = void 0;

      scope.$on('map:init', bindListeners);

      function bindListeners() {
        map = scope.map;
        google.maps.event
          .addListener(map, 'bounds_changed', limitMapBounds);
      }

      function limitMapBounds() {
        var newCenter = void 0;
        var newLat = void 0;
        var newLng = void 0;

        var top = map.getBounds().getNorthEast().lat();
        var right = map.getBounds().getNorthEast().lng();
        var bottom = map.getBounds().getSouthWest().lat();
        var left = map.getBounds().getSouthWest().lng();

        var currentLat = map.getCenter().lat(); // y
        var currentLng = map.getCenter().lng(); // x

        var isLatTooHigh = -85 > bottom && top > 85;
        var isLatTooLow = bottom > -85 && 85 > top;
        var isLatContained = isLatTooHigh || isLatTooLow;

        var isLngTooRight = right > 0 && 180 > right && currentLng > 0;
        var isLngTooLeft = 0 > left && left > -180 && 0 > currentLng;
        var isLngContained = isLngTooRight || isLngTooLeft;

        if (isLatContained && isLngContained) {
          return void 0;
        } else if (!isLatContained) {
          return containLat();
        } else if (!isLngContained) {
          // commenting out for now since this breaks panTo() functionality.
          return; //containLng();
        }

        function containLat() {
          if (-85 > bottom) {
            newLat = currentLat - (bottom + 85);
          } else if (top > 85) {
            newLat = currentLat - (top - 85);
          }

          newCenter = new google.maps.LatLng(newLat, currentLng);
          return void map.setCenter(newCenter);
        }

        function containLng() {
          if (-180 === left && right === 180) {
            newLng = 0;
          } else if (0 > currentLng) {
            newLng = currentLng + (180 - left);
          } else if (currentLng > 0) {
            newLng = currentLng - (180 + right);
          }

          if (newLng !== void 0) {
            newCenter = new google.maps.LatLng(currentLat, newLng);
            return map.setCenter(newCenter);
          }
        }

      }

    }
  }
})();
