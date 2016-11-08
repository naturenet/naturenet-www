(function () {
  'use strict';

  angular
    .module('app.widgets')
    .directive('nnBadge', nnBadge);

  /* @ngInject */
  function nnBadge() {
    // Usage:
    //   <nn-badge class="nn-badge"
    //     title="John Doe"
    //     subtitle="Naturalist"
    //     avatar-url="avatarUrl">
    //   </nn-badge>
    // Creates:
    //   <div class="nn-badge">
    //     <div class="nn-badge__avatar"
    //       style="background-image: url('avatarUrl')">
    //     </div>
    //     <div class="nn-badge__text">
    //       <p class="nn-badge__title">John Doe</p>
    //       <p class="nn-badge__subtitle">Naturalist</p>
    //     </div>
    //   </div>
    var directive = {
      scope: {
        avatarUrl: '@',
        title: '@',
        subtitle: '@',
      },
      link: link,
      templateUrl: 'app/widgets/nn-badge.html',
      restrict: 'EA',
    };
    return directive;

    function link(scope, element, attrs) {
    }
  }
})();
