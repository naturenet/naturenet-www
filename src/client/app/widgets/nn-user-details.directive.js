(function () {
  'use strict';

  angular
    .module('app.widgets')
    .directive('nnUserDetails', nnUserDetails);

  /* @ngInject */
  function nnUserDetails() {
    //Usage:
    // <div nn-user-details class="user-details"></div>
    // Creates:
    // <div class="user-details">
    //   <div class="user-details__avatar"
    //     style="background-image: url('avatarUrl')">
    //   </div>
    //   <div class="user-details__text">
    //     <p class="user-details__name">name</p>
    //     <p class="user-details__date">date</p>
    //   </div>
    // </div>
    var directive = {
      scope: {
        avatarUrl: '@',
        name: '@',
        date: '@',
      },
      link: link,
      templateUrl: 'app/widgets/nn-user-details.html',
      restrict: 'EA',
    };
    return directive;

    function link(scope, element, attrs) {
      if(!attrs.avatarUrl || attrs.avatarUrl === '') {
        // TODO: get proper avatar image
        attrs.avatarUrl = 'https://1.viki.io/a/ph/avatar_profile-acc6c5a5a9d35bd7d292dfd776cfec76.png';
      }
    }
  }
})();
