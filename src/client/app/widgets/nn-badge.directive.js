(function () {
  'use strict';

  angular
    .module('app.widgets')
    .directive('nnBadge', nnBadge);

  /* @ngInject */
  function nnBadge() {
    // Usage:
    //   <nn-badge class="badge"
    //     title="John Doe"
    //     subtitle="Naturalist"
    //     avatar-url="avatarUrl">
    //   </nn-badge>
    // Creates:
    //   <div class="badge">
    //     <div class="badge__avatar"
    //       style="background-image: url('avatarUrl')">
    //     </div>
    //     <div class="badge__text">
    //       <p class="badge__title">John Doe</p>
    //       <p class="badge__subtitle">Naturalist</p>
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
      scope.showDefault = false;

      if (!scope.avatarUrl || scope.avatarUrl === '') {
        scope.showDefault = true;
      }
    }
  }
})();
