(function () {
  'use strict';

  angular
    .module('app.ideas')
    .controller('IdeasController', IdeasController);

  /* Design Ideas controller
     ======================================================================== */

  IdeasController.$inject = [
    '$q',
    'logger',
    'utility',
    'dataservice',
  ];
  /* @ngInject */
  function IdeasController(
    $q,
    logger,
    utility,
    dataservice
  ) {
    var vm = this;
    vm.title = 'Design Ideas';

    /* Variables
       ================================================== */

    // Constants
    vm.sidebarDisplayLimit = 3;

    // Data
    vm.uid = void 0;
    vm.content = '';
    vm.ideas = [];
    vm.challenges = [];
    vm.currentIdeaId = void 0;
    vm.currentChallengeId = void 0;

    vm.ideasDisplayLimit = vm.sidebarDisplayLimit;
    vm.challengesDisplayLimit = vm.sidebarDisplayLimit;

    // States
    vm.isIdeasListVisible = true;
    vm.isChallengesListVisible = true;

    // Function assignments
    vm.addIdea = addIdea;
    vm.formatDate = utility.formatDate;

    activate();

    /* Activate function
       ================================================== */

    function activate() {
      utility.showSplash();

      var promises = [getIdeas()];
      return $q.all(promises)
        .then(function () {
          utility.hideSplash();
          logger.info('Activated Design Ideas View');
        });
    }

    /* Data functions
       ================================================== */

    function getIdeas() {
      return dataservice.getArray('ideas')
        .then(function (data) {
          var i = 0;
          var dlength = data.length;
          for (i; i < dlength; i++) {
            if (!!data[i].group) {
              if (data[i].group.toLowerCase() === 'challenge') {
                vm.challenges.push(data[i]);
              } else {
                vm.ideas.push(data[i]);
              }
            } else {
              vm.ideas.push(data[i]);
            }
          }

          console.log('updated');
          return true;
        });
    }

    function addIdeaObject(uid, content) {
      return dataservice.addIdea(uid, content)
        .then(function (data) {
          getIdeas()
            .then(function () {
              resetForm();
              logger.success('Idea successfully submitted!');
            });
        });
    }

    function onAuth() {
      return dataservice.onAuth()
        .then(function (data) {
          vm.uid = data.uid;
          return vm.uid;
        });
    }

    /* Click functions
       ================================================== */

    function addIdea() {
      if (vm.content.length !== 0) {
        onAuth().then(function () {
          addIdeaObject(vm.uid, vm.content);
        });
      }
    }

    function resetForm() {
      vm.content = '';
    }
  }

})();
