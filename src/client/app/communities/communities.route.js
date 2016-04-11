(function () {
  'use strict';

  angular
    .module('app.communities')
    .run(appRun);

  appRun.$inject = ['routerHelper'];
  /* @ngInject */
  function appRun(routerHelper) {
    routerHelper.configureStates(getStates());
  }

  function getStates() {
    return [
      {
        state: 'communities',
        config: {
          url: '/communities',
          templateUrl: 'app/communities/communities.html',
          controller: 'CommunitiesController',
          controllerAs: 'vm',
          title: 'Communities',
          settings: {
            nav: 2,
            content: 'Communities',
          },
        },
      },
    ];
  }
})();
