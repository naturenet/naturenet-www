(function () {
  'use strict';

  angular
    .module('app.explore')
    .run(appRun);

  appRun.$inject = ['routerHelper'];
  /* @ngInject */
  function appRun(routerHelper) {
    routerHelper.configureStates(getStates());
  }

  //function routing($stateParams, $q, $location) {
  //  var deferred = $q.defer();
  //  console.log('bones');
  //  console.log($stateParams.id);
  //  $location.search("observation", $stateParams.id);
  //  setTimeout(function(){
  //    deferred.resolve("Allo!");
  //    $location.search("observation", $stateParams.id);
  //  },2000);
  //  return deferred.promise;
  //}

  function getStates() {
    return [
      {
        state: 'explorekey',
        config: {
          reloadOnSearch: false,
          url: '/explore/tagged/:query',
          templateUrl: 'app/explore/explore.html',
          controller: 'ExploreController',
          controllerAs: 'vm',
          title: 'Explore',
        },
      },
      {
        state: 'exploreid',
        config: {
          reloadOnSearch: false,
          url: '/explore/observation/:id',
          templateUrl: 'app/explore/explore.html',
          controller: 'ExploreController',
          controllerAs: 'vm',
          title: 'Explore',
          //resolve: {factory: routing},
        },
      },
      {
        state: 'explore',
        config: {
          url: '/explore',
          reloadOnSearch: false,
          templateUrl: 'app/explore/explore.html',
          controller: 'ExploreController',
          controllerAs: 'vm',
          title: 'Explore',
        },
      },
    ];
  }
})();
