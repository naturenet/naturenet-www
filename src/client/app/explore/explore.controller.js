/* global google */
(function () {
  'use strict';

  angular
    .module('app.explore')
    .controller('ExploreController', ExploreController);





  /* Explore controller
     ======================================================================== */

  ExploreController.$inject = ['$rootScope', '$scope', '$q', '$timeout',
                               'dataservice', 'logger', 'NgMap'];
  /* @ngInject */
  function ExploreController($rootScope, $scope, $q, $timeout, dataservice, logger, NgMap) {
    var vm = this;
    vm.title = 'Explore';
    vm.options = [{
        name: 'Recent',
      }, {
        name: 'Featured',
      },
    ];
    vm.option = vm.options[0];

    $scope.$parent.hasMap = false;
    vm.toggleMap = toggleMap;
    vm.hasSidebar = false;
    vm.showSidebar = showSidebar;
    vm.hideSidebar = hideSidebar;

    vm.map = void 0;
    
    // TODO: move to core/config.js
    vm.mapOptions = {
      zoom: 15, // 15
      minZoom: 3,

      //disableDefaultUI: true,
      //mapTypeId: google.maps.MapTypeId.HYBRID,
      //mapTypeControlOptions: {
      //    style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
      //    position: google.maps.ControlPosition.RIGHT_BOTTOM,
      //},
      zoomControl: true,
      //zoomControlOptions: {
      //    position: google.maps.ControlPosition.LEFT_BOTTOM,
      //},
      scaleControl: false,
      streetViewControl: false,

      keyboardShortcuts: false,
    };

    activate();





    /* Activate function
       ================================================== */

    function activate() {
      var promises = [];
      return NgMap.getMap()
        .then(function (map) {
          logger.info('Google Maps Ready');
          vm.map = map;
          initializeMap();

          $q.all(promises)
            .then(function () {
              logger.info('Activated Map View');
            });
        });
    }





    /* Map functions
       ================================================== */

    function initializeMap() {
      vm.map.setOptions(vm.mapOptions);

      $scope.$broadcast('map:init');

      $rootScope.$on('map:toggle', toggleMap);
      $rootScope.$on('map:show', showMap);
      $rootScope.$on('map:hide', hideMap);
    }

    function toggleMap() {
      $scope.$parent.hasMap = !$scope.$parent.hasMap;
    }

    function showMap() {
      $scope.$parent.hasMap = true;
    }

    function hideMap() {
      $scope.$parent.hasMap = false;
    }





    /* Sidebar functions
       ================================================== */

    function showSidebar() {
      vm.hasSidebar = true;
      // $timeout(function () {
      //   google.maps.event.trigger(vm.map, 'resize');
      // }, 500);
    }

    function hideSidebar() {
      vm.hasSidebar = false;
      // $timeout(function () {
      //   google.maps.event.trigger(vm.map, 'resize');
      // }, 100);
    }

  }

})();