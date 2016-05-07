(function () {
  'use strict';

  angular
    .module('app.comments')
    .controller('CommentsController', CommentsController);

  /* Comments controller
     ======================================================================== */

  CommentsController.$inject = [
    'dataservice',
  ];
  /* @ngInject */
  function CommentsController(
    dataservice
  ) {

  }
})();
