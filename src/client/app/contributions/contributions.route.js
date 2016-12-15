(function () {
  'use strict';

  angular
    .module('app.contributions')
    .run(appRun);

  appRun.$inject = ['routerHelper'];
  /* @ngInject */
  function appRun(routerHelper) {
    routerHelper.configureStates(getStates());
  }

  function getStates() {
    return [
      {
        state: 'contributions',
        config: {
          url: '/contributions',
          templateUrl: 'app/contributions/contributions.html',
          controller: 'ContributionsController',
          controllerAs: 'vm',
          title: 'Contributions',
          settings: {
            nav: 5,
            content: 'Contributions',
          },
        },
      },
    ];
  }

})();
