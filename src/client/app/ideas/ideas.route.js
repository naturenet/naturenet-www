(function () {
  'use strict';

  angular
    .module('app.ideas')
    .run(appRun);

  appRun.$inject = ['routerHelper'];
  /* @ngInject */
  function appRun(routerHelper) {
    routerHelper.configureStates(getStates());
  }

  function getStates() {
    return [
      {
        state: 'ideas',
        config: {
          url: '/ideas',
          templateUrl: 'app/ideas/ideas.html',
          controller: 'IdeasController',
          controllerAs: 'vm',
          title: 'Design Ideas',
          settings: {
            nav: 4,
            content: 'Design Ideas',
          },
        },
      },
    ];
  }

})();
