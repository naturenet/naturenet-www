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
    NgMap,
    hashtagify
  ) {
    var vm = this;
    vm.title = 'Explore';

    /* Variables
       ================================================== */

    // Data
    vm.map = void 0;
    vm.localObservationIds = void 0;
    vm.observations = void 0;
    vm.currentObservation = void 0;
    vm.currentProject = void 0;
    vm.comments = void 0;
    vm.maxPoints = 100;
    vm.dynMarkers = [];

    //Search
    vm.query = '';

    // States
    //$scope.$parent.hasMap = false;
    vm.hasSidebar = false;
    vm.isObservationsListVisible = true;
    vm.showDetail = false;
    vm.isDrawerVisible=true;
    vm.limit = 8;

    // Function assignments
    vm.toggleMap = toggleMap;
    vm.showSidebar = showSidebar;
    vm.hideSidebar = hideSidebar;
    vm.formatDate = utility.formatDate;
    vm.onMapMoved = onMapMoved;
    vm.select = select;
    vm.updateDrawer = updateDrawer;
    vm.openDetails = openDetails;

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


          $q.all(promises)
            .then(function () {
              initializeMap();
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

    function select(id) {
      if (!!id) {
        dataservice.getObservationById(id).then(function (o) {
          if (o.$value !== null) {
            vm.currentObservation = o;
          } else {
            logger.warning('This observation cannot be displayed.');
          }
        });
      }
    }

    /* Listener Functions
       ================================================== */

    $scope.$watch('vm.currentObservation', currentObservationUpdated);

    function currentObservationUpdated() {
      showSidebar(vm.currentObservation);
      updateMap(vm.currentObservation);
    }

    $scope.$on('delete', function (event, id) {
      if (id === vm.currentObservation.id) {
        vm.currentObservation = void 0;
      }
    });

    $scope.$on('view', function (event, id) {
      if (!!id) {
        vm.showDetail = true;
      }
    });

    /* Map functions
       ================================================== */

    /*function selectObservation (one, two) {
      //console.log(one);
      //console.log(two);
      console.log(two.data.text);
      console.log(two.data.image);
      one.icon={
          path: 'M 0,0 C -2,-20 -10,-22 -10,-30 A 10,10 0 1,1 10,-30 C 10,-22 2,-20 0,0 z M -2,-30 a 2,2 0 1,1 4,0 2,2 0 1,1 -4,0',
          fillColor: '#354a5f',
          fillOpacity: 1,
          strokeColor: '#4db26a',
          strokeWeight: 3,
          scale: 1,
     }
   }*/

   function openDetails() {
     vm.showDetail = true;
     closeDrawer();
   }

   /*vm.showDetail = function(e, shop) {
     vm.currentObservation = shop;
     vm.map.showInfoWindow('bar', shop.id);
   };*/

   vm.hideDetail = function() {
     vm.map.hideInfoWindow('bar');
   };

   vm.search = function (e) {
     var tagText = e.target.innerText;
     console.log(tagText);
     $rootScope.$broadcast('search', tagText);
   };



    function initializeMap() {

      var coords = dataservice.getGeolocation();

      if (!!coords) {
        config.mapOptions.center = new google.maps.LatLng(coords.latitude, coords.longitude);
        config.mapOptions.zoom = 12;
      }
      vm.map.setOptions(config.mapOptions);

      initMarkerClusterer();

      function  createMarkerForCity (observation) {

        function pinSymbol() {
        //Function code taken from:
        //https://stackoverflow.com/questions/7095574/google-maps-api-3-custom-marker-color-for-default-dot-marker
            return {
                path: 'M 0,0 C -2,-20 -10,-22 -10,-30 A 10,10 0 1,1 10,-30 C 10,-22 2,-20 0,0 z M -2,-30 a 2,2 0 1,1 4,0 2,2 0 1,1 -4,0',
                fillColor: '#4db26a',
                fillOpacity: 1,
                strokeColor: '#354a5f',
                strokeWeight: 3,
                scale: 1,
           };
        }

        var position = observation.l

        var marker = new google.maps.Marker({
          position: new google.maps.LatLng(position[0], position[1]),
          title: observation.data.text,
          id: observation['$id'],
          icon: pinSymbol('#354a5f')
        });
        google.maps.event.addListener(marker, 'click', function () {
          vm.currentObservation = observation;
          vm.map.showInfoWindow('bar', this);
        });
        return marker;
      }

      function initMarkerClusterer () {
        vm.markers = vm.observations.map(function (city) {
           return createMarkerForCity(city);
        });
        var mcOptions = { cssClass: 'custom-pin', maxZoom: 13, imagePath: '/bower_components/gmaps-marker-clusterer/images/m' };
        return new MarkerClusterer(vm.map, vm.markers, mcOptions);
      };

      $scope.$broadcast('map:init');

      $rootScope.$on('map:toggle', toggleMap);
      $rootScope.$on('map:show', showMap);
      $rootScope.$on('map:hide', hideMap);
      $rootScope.$on('auth:success', showSite);
      $rootScope.$on('search', function(event, tag) {
        console.log(tag);
        vm.query = tag;
        vm.showDetail=false;
        vm.isDrawerVisible=true;
      });
    }

    function onMapMoved() {
      if (!!vm.map) {
        //dataservice.getObservationsNear(vm.map.getCenter(), getMapRadiusKm(), vm.maxPoints)
        //  .then(function (response) {
        //    vm.localObservationIds = response;
        //  });
      }
    }

    function getMapRadiusKm() {
      var radius = 1;
      var bounds = vm.map.getBounds();
      var center = vm.map.getCenter();
      if (bounds && center) {
        var ne = bounds.getNorthEast();

        var radius = google.maps.geometry.spherical.computeDistanceBetween(center, ne);
        radius = Math.floor(radius * 10);
      }

      return radius;
    }

    function showSite(userId) {
      dataservice.getActiveUser().then(function (user) {
        dataservice.getSiteById(user.affiliation)
          .then(function (site) {
            if (!!site) {
              var newCenter = new google.maps.LatLng({ lat: site.l[0], lng: site.l[1], });
              vm.map.panTo(newCenter);
              vm.map.setZoom(12);
            }
          });
      });
    }

    function resetMap() {
      config.mapOptions.center = new google.maps.LatLng({ lat: 37.2758365, lng: -104.6536539, });
      config.mapOptions.zoom = 4;
      vm.map.setOptions(config.mapOptions);
    }

    function updateMap(o) {
      if (!!vm.map) {
        if (!o || !o.l || angular.equals(o.l, [0, 0])) {
      //    return resetMap();
        }

        var newCenter = new google.maps
          .LatLng({ lat: o.l[0], lng: o.l[1], });
        var currentZoom = vm.map.getZoom();

        vm.map.panTo(newCenter);

        if (currentZoom < 14) {
          vm.map.setZoom(14);
        }
      }
    }

    function toggleMap() {
      //$scope.$parent.hasMap = !$scope.$parent.hasMap;
    }

    function showMap(event, o) {
      if (!!o) { vm.currentObservation = o; }

      //$scope.$parent.hasMap = true;
    }

    function hideMap() {
      //$scope.$parent.hasMap = false;
    }

    /* Sidebar functions
       ================================================== */

    function showSidebar(o) {

      vm.currentObservation = o;

      if (!!o) {
        dataservice.getProjectById(o.activity).then(function (data) {
          vm.currentProject = data;
        });
      }
      if (vm.markers) {
        var selected = vm.markers.filter(function(marker) {
          return marker.id == o['$id'];
        })

        //the best solution I could come up with to
        //deal with a glitch in ng-maps.
        setTimeout(function() {
          google.maps.event.trigger(selected[0], 'click')
        }, 600)

        loadComments(vm.currentObservation);
      }
    }

    function hideSidebar() {
      vm.hasSidebar = false;
    }

    function loadComments() {
      vm.comments = void 0;
      if (!!vm.currentObservation) {
        return dataservice.getCommentsForRecord(vm.currentObservation)
          .then(function (data) {
            vm.comments = data;
            return vm.comments;
          });
      }
    }

    function updateDrawer() {
      console.log('close');
      vm.isDrawerVisible=!vm.isDrawerVisible;
      setTimeout(function() {
        google.maps.event.trigger(vm.map, "resize");
      }, 1500);
    }

    function closeDrawer() {
      console.log('close');
      vm.isDrawerVisible=false;
      google.maps.event.trigger(vm.map, "resize");
    }

  }
})();
