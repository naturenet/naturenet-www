(function () {
  'use strict';

  angular
    .module('app.home')
    .controller('HomeController', HomeController);

  /* Home controller
     ======================================================================== */

  HomeController.$inject = [
    '$q',
    '$rootScope',
    '$uibModal',
    'logger',
    'utility',
    'dataservice',
  ];

  /* @ngInject */
  function HomeController(
    $q,
    $rootScope,
    $uibModal,
    logger,
    utility,
    dataservice
  ) {
    var vm = this;
    vm.title = 'Home';

    /* Variables
       ================================================== */

    // Data
    vm.observations = [];
    vm.ideas = [];
    vm.contactEmail = 'naturenetapp at gmail dot com';

    vm.observationsDisplayLimit = 5;
    vm.ideasDisplayLimit = 5;

    // Function assignments
    vm.showObservation = showObservation;
    vm.showMap = showMap;
    vm.formatDate = utility.formatDate;

    activate();

    /* Activate function
       ================================================== */

    function activate() {
      doMobileCheck();
      utility.showSplash();

      var promises = [getObservations(), getIdeas()];
      return $q.all(promises)
        .then(function () {
          utility.hideSplash();
          logger.info('Activated Home View');
        });
    }

    function doMobileCheck() {
      if (/iPad|iPhone|iPod|Android/.test(navigator.userAgent) && !window.MSStream) {
        $uibModal.open({
          template: '<div class="modal-header"><h3 class="modal-title" id="modal-title">Download the NatureNet app!</h3></div>'
          + '<div class="modal-body mobile-overlay" id="modal-body">'
          + '<p>NatureNet is available for iOS and Android.</p>'
          + '<p><a href="https://itunes.apple.com/us/app/naturenet/id1104382694?mt=8" style="display:inline-block;overflow:hidden;background:url(https://linkmaker.itunes.apple.com/images/badges/en-us/badge_appstore-lrg.svg) no-repeat;width:165px;height:40px;margin:10px 0 10px 28px;"></a></p>'
          + '<p><a href="https://play.google.com/store/apps/details?id=org.naturenet&utm_source=global_co&utm_medium=prtnr&utm_content=Mar2515&utm_campaign=PartBadge&pcampaignid=MKT-Other-global-all-co-prtnr-py-PartBadge-Mar2515-1"><img alt="Get it on Google Play" src="images/google-play-badge.png" style="height:60px;"/></a></p>'
          + '</div>',
        });
      }
    }

    /* Data functions
       ================================================== */

    function getObservations() {
      return dataservice.getArray('observations')
        .then(function (data) {
          vm.observations = data;
          return vm.observations;
        });
    }

    function getIdeas() {
      return dataservice.getArray('ideas')
        .then(function (data) {
          vm.ideas = data;
          return vm.ideas;
        });
    }

    /* Click functions
       ================================================== */

    function showObservation(o) {
      $rootScope.$broadcast('map:show', o);
    }

    function showMap() {
      $rootScope.$broadcast('map:show');
    }

  }
})();
