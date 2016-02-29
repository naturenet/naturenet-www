(function () {
  'use strict';

  angular
    .module('app.core')
    .factory('dataservice', dataservice);

  dataservice.$inject = ['$http', '$q', 'exception', 'logger'];
  /* @ngInject */
  function dataservice($http, $q, exception, logger) {
    var url = '';
    var service = {
      getPeople: getPeople,
      getMessageCount: getMessageCount,
    };

    return service;

    function getMessageCount() { return $q.when(72); }

    function getPeople() {
      return $http.get('/api/people')
        .then(success)
        .catch(fail);

      function success(response) {
        return response.data;
      }

      function fail(e) {
        return exception.catcher('XHR Failed for getPeople')(e);
      }
    }

    function getSites() {
      return $http.get('${url}/sites')
        .then(success)
        .catch(fail);

      function success(response) {
        return response.data;
      }

      function fail(e) {
        return exception.catcher('XHR Failed for getSites')(e);
      }
    }

    function getSite(siteId) {
      return $http.get('${url}/site/${siteId}')
        .then(success)
        .catch(fail);

      function success(response) {
        return response.data;
      }

      function fail(e) {
        return exception.catcher('XHR Failed for getSite')(e);
      }
    }

    function getActivity(siteId, activityId) {
      return $http.get('${url}/site/${siteId}/activities/${activityId}')
        .then(success)
        .catch(fail);

      function success(response) {
        return response.data;
      }

      function fail(e) {
        return exception.catcher('XHR Failed for getActivity')(e);
      }
    }

    function getObservationsForUser(userId) {
      // TODO: Add offset and limit. See apiary.io
      return $http.get('${url}/observations/user/${userId}')
        .then(success)
        .catch(fail);

      function success(response) {
        return response.data;
      }

      function fail(e) {
        return exception.catcher('XHR Failed for getObservationsForUser')(e);
      }
    }

    function getObservationsForActivity(activityId) {
      // TODO: Add offset and limit. See apiary.io
      return $http.get('${url}/observations/activity/${activityId}')
        .then(success)
        .catch(fail);

      function success(response) {
        return response.data;
      }

      function fail(e) {
        return exception.catcher('XHR Failed for getObservationsForActivity')(e);
      }
    }

    function getObservationsForSite(siteId) {
      // TODO: Add offset and limit. See apiary.io
      return $http.get('${url}/observations/site/${siteId}')
        .then(success)
        .catch(fail);

      function success(response) {
        return response.data;
      }

      function fail(e) {
        return exception.catcher('XHR Failed for getObservationsForSite')(e);
      }
    }

    function getObservation(observationsId) {
      return $http.get('${url}/observations/${observationId}')
        .then(success)
        .catch(fail);

      function success(response) {
        return response.data;
      }

      function fail(e) {
        return exception.catcher('XHR Failed for getObservation')(e);
      }
    }

    function createObservation(data) {
      return $http.post('${url}/observations', data)
        .then(success)
        .catch(fail);

      function success(response) {
        return response.data;
      }

      function fail(e) {
        return exception.catcher('XHR Failed for createObservation')(e);
      }
    }

    function updateObservation(observationId, data) {
      return $http.post('${url}/observations/${observationId}', data)
        .then(success)
        .catch(fail);

      function success(response) {
        return response.data;
      }

      function fail(e) {
        return exception.catcher('XHR Failed for updateObservation')(e);
      }
    }

    // TODO: Add Delete, (Comment On)

    function getIdeas() {
      // TODO: Add offset and limit. See apiary.io
      return $http.get('${url}/ideas')
        .then(success)
        .catch(fail);

      function success(response) {
        return response.data;
      }

      function fail(e) {
        return exception.catcher('XHR Failed for getIdeas')(e);
      }
    }

    function getIdeasForUser(userId) {
      // TODO: Add offset and limit. See apiary.io
      return $http.get('${url}/ideas/user/${userId}')
        .then(success)
        .catch(fail);

      function success(response) {
        return response.data;
      }

      function fail(e) {
        return exception.catcher('XHR Failed for getIdeasForUser')(e);
      }
    }

    function getIdea(ideaId) {
      // TODO: Add offset and limit. See apiary.io
      return $http.get('${url}/ideas/${ideaId}')
        .then(success)
        .catch(fail);

      function success(response) {
        return response.data;
      }

      function fail(e) {
        return exception.catcher('XHR Failed for getIdea')(e);
      }
    }

    function createIdea(data) {
      // TODO: Add offset and limit. See apiary.io
      return $http.post('${url}/ideas', data)
        .then(success)
        .catch(fail);

      function success(response) {
        return response.data;
      }

      function fail(e) {
        return exception.catcher('XHR Failed for createIdea')(e);
      }
    }

    function updateIdea(ideaId, data) {
      // TODO: Add offset and limit. See apiary.io
      return $http.post('${url}/ideas/${ideaId}', data)
        .then(success)
        .catch(fail);

      function success(response) {
        return response.data;
      }

      function fail(e) {
        return exception.catcher('XHR Failed for updateIdea')(e);
      }
    }

    // TODO: Delete, Comment On

    // TODO: Add Signup, Login

    function getUser(userId) {
      // TODO: Add offset and limit. See apiary.io
      return $http.get('${url}/users/${userId}')
        .then(success)
        .catch(fail);

      function success(response) {
        return response.data;
      }

      function fail(e) {
        return exception.catcher('XHR Failed for getUser')(e);
      }
    }
  }
})();
