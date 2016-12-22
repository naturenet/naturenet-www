(function () {
  'use strict';

  angular
    .module('app.ideas')
    .controller('IdeasController', IdeasController);

  /* Design Ideas controller
     ======================================================================== */

  IdeasController.$inject = [
    '$q',
    '$rootScope',
    '$scope',
    'logger',
    'utility',
    'dataservice',
  ];
  /* @ngInject */
  function IdeasController(
    $q,
    $rootScope,
    $scope,
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
    vm.ideaTypes = ['New Features', 'Project Ideas', 'Community Ideas', 'Improvement Ideas'];
    vm.allTags = [];
    vm.type = vm.ideaTypes[0];
    vm.ideas = [];
    vm.currentIdeaId = void 0;
    vm.comments = void 0;
    vm.showDetail = false;

    vm.ideasDisplayLimit = vm.sidebarDisplayLimit;

    // States

    // Function assignments
    vm.addIdea = addIdea;
    vm.formatDate = utility.formatDate;
    vm.selectIdea = selectIdea;

    activate();

    /* Activate function
       ================================================== */

    function activate() {
      utility.showSplash();

      var promises = [getIdeas(), getAllTags()];
      return $q.all(promises)
        .then(function () {
          utility.hideSplash();
          logger.info('Activated Design Ideas View');
        });
    }

    /* Listener Functions
       ================================================== */

    $scope.$watch('vm.selectedIdea', loadComments);

    $scope.$on('delete', function (event, id) {
      if (id === vm.selectedIdea.id) {
        vm.selectedIdea = void 0;
      }
    });

    function loadComments() {
      vm.comments = void 0;
      if (!!vm.selectedIdea) {
        return dataservice.getCommentsForRecord(vm.selectedIdea)
          .then(function (data) {
            vm.comments = data;
            return vm.comments;
          });
      }
    }

    /* Data functions
       ================================================== */

    function getIdeas() {
      return dataservice.getArray('ideas')
        .then(function (data) {
          vm.ideas = data;
          return vm.ideas;
        });
    }

    function addIdeaObject(content, type) {
      return dataservice.addIdea(content, type)
        .then(function (data) {
          getIdeas()
            .then(function () {
              resetForm();
              logger.success('Idea successfully submitted!');
            });
        });
    }

    function getAllTags() {
      return dataservice.getTags()
        .then(function (data) {
          angular.forEach(data, function (tag) {
            vm.allTags.push(tag.$id);
          });

          return vm.allTags;
        });
    }

    /* Click functions
       ================================================== */

    function addIdea() {
      if (vm.content.length !== 0) {
        addIdeaObject(vm.content, vm.type);
      }
    }

    function selectIdea(idea) {
      vm.selectedIdea = idea;
      vm.showDetail = true;
    }

    function resetForm() {
      vm.content = '';
    }
  }

})();
