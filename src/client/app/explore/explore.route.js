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
