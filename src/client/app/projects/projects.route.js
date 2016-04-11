(function () {
  'use strict';

  angular
    .module('app.projects')
    .run(appRun);

  appRun.$inject = ['routerHelper'];
  /* @ngInject */
  function appRun(routerHelper) {
    routerHelper.configureStates(getStates());
  }

  function getStates() {
    return [
      {
        state: 'projects',
        config: {
          url: '/projects',
          templateUrl: 'app/projects/projects.html',
          controller: 'ProjectsController',
          controllerAs: 'vm',
          title: 'Projects',
          settings: {
            nav: 3,
            content: 'Projects',
          },
        },
      },
    ];
  }
})();
