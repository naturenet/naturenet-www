/* global google */
(function () {
  'use strict';

  angular
    .module('app.explore')
    .controller('ExploreController', ExploreController);

  /* Explore controller
     ======================================================================== */

  ExploreController.$inject = [
    '$q',
    '$rootScope',
    '$scope',
    '$timeout',
    'logger',
    'config',
    'utility',
    'dataservice',
    'NgMap',
  ];

  /* @ngInject */
  function ExploreController(
    $q,
    $rootScope,
    $scope,
    $timeout,
    logger,
    config,
    utility,
    dataservice,
    NgMap
  ) {
    var vm = this;
    vm.title = 'Explore';

    /* Variables
       ================================================== */

    // Data
    vm.map = void 0;
    vm.observations = void 0;
    vm.currentObservation = void 0;

    // States
    $scope.$parent.hasMap = false;
    vm.hasSidebar = false;
    vm.isObservationsListVisible = true;

    // Function assignments
    vm.toggleMap = toggleMap;
    vm.showSidebar = showSidebar;
    vm.hideSidebar = hideSidebar;
    vm.formatDate = utility.formatDate;

    activate();

    /* Activate function
       ================================================== */

    function activate() {
      utility.showSplash();

      var promises = [getObservations()];
      return NgMap.getMap()
        .then(function (map) {
          logger.info('Google Maps Ready');
          vm.map = map;
          initializeMap();

          $q.all(promises)
            .then(function () {
              utility.hideSplash();
              logger.info('Activated Map View');
            });
        });
    }

    /* Data functions
       ================================================== */

    function getObservations() {
      return dataservice.getArray('observations')
        .then(function (data) {
          vm.observations = data;
          return vm.observations;
        });
    }

    /* Listener Functions
       ================================================== */

    $scope.$watch('vm.currentObservation', currentObservationUpdated);

    function currentObservationUpdated() {
      showSidebar(vm.currentObservation);
      updateMap(vm.currentObservation);
    }

    /* Map functions
       ================================================== */

    function initializeMap() {
      config.mapOptions.center = new google.maps.LatLng(39.833333, -98.583333);
      config.mapOptions.mapTypeId = google.maps.MapTypeId.HYBRID;

      vm.map.setOptions(config.mapOptions);

      $scope.$broadcast('map:init');

      $rootScope.$on('map:toggle', toggleMap);
      $rootScope.$on('map:show', showMap);
      $rootScope.$on('map:hide', hideMap);
    }

    function resetMap() {
      vm.map.setOptions(config.mapOptions);
    }

    function updateMap(o) {
      if (!o) { return; }

      var newCenter = new google.maps
        .LatLng({ lat: o.l[0], lng: o.l[1], });
      var currentZoom = vm.map.getZoom();

      vm.map.panTo(newCenter);

      if (currentZoom < 18) {
        vm.map.setZoom(18);
      }
    }

    function toggleMap() {
      $scope.$parent.hasMap = !$scope.$parent.hasMap;
    }

    function showMap(event, o) {
      if (!!o) { vm.currentObservation = o; }

      $scope.$parent.hasMap = true;
    }

    function hideMap() {
      $scope.$parent.hasMap = false;
    }

    /* Sidebar functions
       ================================================== */

    function showSidebar(o) {
      vm.currentObservation = o;
      vm.hasSidebar = true;
    }

    function hideSidebar() {
      vm.hasSidebar = false;
    }

  }
})();
