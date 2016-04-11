(function () {
  'use strict';

  angular
    .module('blocks.exception')
    .factory('exception', exception);

  /* @ngInject */
  function exception($q, logger) {
    var service = {
      catcher: catcher,
    };
    return service;

    function catcher(message) {
      return function (e) {
        var thrownDescription;
        var newMessage;
        if (e.code && e.message) {
          thrownDescription = '\n' + e.message;
          newMessage = message + thrownDescription;
        }

        e.message = newMessage;
        logger.error(newMessage);
        return $q.reject(e);
      };
    }
  }
})();
