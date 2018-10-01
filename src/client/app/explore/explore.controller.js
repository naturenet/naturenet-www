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
    '$location',
    '$state',
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
    $location,
    $state,
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

    //Search
    vm.query = "";

    //for emails only (legacy)
    var paramID=null;
    if ($state.params) {
      if ($state.params.query) vm.query = $state.params.query
      if ($state.params.id) {
        var paramID = $state.params.id //if loaded this way, pass to activate
      }
    }

    activate(paramID);


    /* Routes
       ================================================== */

    $rootScope.$on('$locationChangeSuccess', function(event){
      console.log('there');
            var url = $location.url(),
                params = $location.search();
                console.log(params);
            routeHandler();
    })

    function routeHandler() {
      // get observation or tagged
      if ($location.search()) {
        if ($location.search().observation) { //not also tagged (set id! delete tagged)
          var paramID =$location.search().observation;
          console.log(paramID);
          select(paramID);
        }
        if ($location.search().tagged) { //not also id (set tagged! deleted id)
          var id =$location.search().tagged;
          console.log(tagged);
        }
      }
    }

    /* Activate function
       ================================================== */

    function activate(paramID) {

      if (vm.map) {
        console.log(vm.map);
        return null;
      }

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
              if (paramID) {
                return select(paramID); //for emails only (legacy)
               }
              routeHandler();
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

    function setUrl (context, id) {
      vm.toggleNotifications=false;
      if (context=="observations") {
        var result = $location.path('explore');
        $location.search('observation',id)
      }
    }

    function select(id) { //close any boxes that are open!
      console.log('select');
      if (!!id) {
        dataservice.getObservationById(id).then(function (o) {
          if (o.$value !== null) {
            vm.currentObservation = o;
            loadComments(vm.currentObservation);
            console.log(vm.currentObservation);
            console.log(vm.showDetail);
            //center the map on the observation...
            console.log('update');
            currentObservationUpdated();
            //updateMap(o);
          } else {
            logger.warning('This observation cannot be displayed.');
          }
        });
      }
    }

    /* Listener Functions
       ================================================== */

    $scope.$watch('vm.currentObservation', dataservice.debounce(function () {
      $scope.$apply(function(){
          console.log('debounce');
          currentObservationUpdated();
      })
    }, 1000));
//currentObservationUpdated);

    function currentObservationUpdated() { //updated twice quickly
      showSidebar(vm.currentObservation);
      if (vm.currentObservation) {
        if (vm.currentObservation.id) {
          console.log($location);
          setTimeout(function() {
            updateMap(vm.currentObservation);
          }, 1500)
        }
      } else {
        console.log('here');
      }
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
     //$location.path('/explore/observation/'+vm.currentObservation.id, false);
     setTimeout(function () {
       updateMap(vm.currentObservation);
     }, 1000);
     //closeDrawer();
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
        config.mapOptions.zoom = 11;
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
      config.mapOptions.zoom = 5;
      vm.map.setOptions(config.mapOptions);
    }

    function updateMap(o) {
      if (!!vm.map) {
        if (!o || !o.l || angular.equals(o.l, [0, 0])) {
          // return resetMap();
          //open modal with a warning...
          //or use google API to place it.
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


    //var filteredData;

    //{{o.data.text}} -
    //{{o.id}} -
    //{{o.observer}} -
    //or search comments...

    //filteredData = $filter('filter')(data, function(data) {
    // if (vm.query || vm.id ) {
         //match the username
    //   if (vm.query[0]=="@") { return data.name.toString().indexOf(vm.query) > -1 }

         //match the id or the content of items
    //   return data.id.toString().indexOf(vm.id) > -1 || data.text.toString().indexOf(vm.query) > -1;
    // } else {
    //   return true;
    // }
    //});


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
          setUrl('observations', vm.currentObservation.id);
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
