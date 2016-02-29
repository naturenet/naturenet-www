(function () {
  'use strict';

  angular
    .module('app.community')
    .run(appRun);

  appRun.$inject = ['routerHelper'];
  /* @ngInject */
  function appRun(routerHelper) {
    routerHelper.configureStates(getStates());
  }

  function getStates() {
    return [
      {
        state: 'community',
        config: {
          url: '/community',
          templateUrl: 'app/community/community.html',
          controller: 'CommunityController',
          controllerAs: 'vm',
          title: 'Community',
          settings: {
            nav: 5,
            content: 'Community',
          },
        },
      },
    ];
  }
})();
