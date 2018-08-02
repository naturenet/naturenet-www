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

  function getStates() {
    return [
      {
        state: 'explorekey',
        config: {
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
          url: '/explore/observation/:id',
          templateUrl: 'app/explore/explore.html',
          controller: 'ExploreController',
          controllerAs: 'vm',
          title: 'Explore',
        },
      },
      {
        state: 'explore',
        config: {
          url: '/explore',
          templateUrl: 'app/explore/explore.html',
          controller: 'ExploreController',
          controllerAs: 'vm',
          title: 'Explore',
        },
      },
    ];
  }
})();
