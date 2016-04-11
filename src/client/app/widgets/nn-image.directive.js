(function () {
  'use strict';

  angular
    .module('app.widgets')
    .directive('nnImage', nnImage);

  /* @ngInject */
  function nnImage() {
    // Usage:
    //   <nn-image image-url="imageUrl">
    //   </nn-badge>
    // Creates:
    //   <div class="badge">
    //     <div style="background-image: url('imageUrl')"></div>
    //   </div>
    var directive = {
      scope: {
        imageUrl: '@',
      },
      link: link,
      templateUrl: 'app/widgets/nn-image.html',
      restrict: 'EA',
    };
    return directive;

    function link(scope, element, attrs) {
      scope.showDefault = false;

      if (!scope.imageUrl || scope.imageUrl === '') {
        scope.showDefault = true;
      }
    }
  }
})();
