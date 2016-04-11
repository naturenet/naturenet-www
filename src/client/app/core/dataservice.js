(function () {
  'use strict';

  angular
    .module('app.core')
    .factory('dataservice', dataservice);

  /* Dataservice
     ======================================================================== */

  dataservice.$inject = ['$q', '$firebaseObject', '$firebaseArray', '$firebaseAuth', '$filter', 'exception', 'logger'];
  /* @ngInject */
  function dataservice($q, $firebaseObject, $firebaseArray, $firebaseAuth, $filter, exception, logger) {
    var url = 'https://naturenet-staging.firebaseio.com/';

    var service = {
      // Utility functions
      getArray: getArray,

      // Authentication functions
      onAuth: onAuth,
      getAuth: getAuth,
      authWithPassword: authWithPassword,
      createUser: createUser,
      removeUser: removeUser,
      addUser: addUser,

      // User functions
      getUsers: getUsers,
      getUsersRecent: getUsersRecent,

      // Group functions
      getGroups: getGroups,
      getGroupsByUserId: getGroupsByUserId,

      // Observation functions
      getObservationsArrayByUserId: getObservationsArrayByUserId,
      getObservationsArrayByProjectId: getObservationsArrayByProjectId,

      // Project functions
      getProjects: getProjects,
      getProjectsRecent: getProjectsRecent,

      // Idea functions
      addIdea: addIdea,
    };

    return service;

    /* Utility functions
       ================================================== */

    function getArray(s) {
      var ref = new Firebase(url + s)
        .orderByChild('updated_at')
        .limitToLast(50);
      var data = $firebaseArray(ref);

      return data.$loaded()
        .then(success)
        .catch(fail);

      function success(response) {
        return $filter('orderBy')(response, 'updated_at', true);
      }

      function fail(e) {
        return exception.catcher('Failed for dataservice.getArray')(e);
      }
    }

    /* Authentication functions
       ================================================== */

    function onAuth() {
      var d = $q.defer();
      var ref = new Firebase(url);
      var data = $firebaseAuth(ref);

      data.$onAuth(function (snapshot) {
        success(snapshot);
      });

      return d.promise;

      function success(response) {
        d.resolve(response);
      }

      function fail(e) {
        d.reject(exception.catcher('Failed for dataservice.onAuth')(e));
      }
    }

    function getAuth() {
      var d = $q.defer();
      var ref = new Firebase(url);
      var data = $firebaseAuth(ref);

      data.$getAuth(function (snapshot) {
        success(snapshot);
      });

      return d.promise;

      function success(response) {
        d.resolve(response);
      }

      function fail(e) {
        d.reject(exception.catcher('Failed for dataservice.getAuth')(e));
      }
    }

    function authWithPassword(cred) {
      var ref = new Firebase(url);
      var data = $firebaseAuth(ref);

      return data.$authWithPassword(cred)
        .then(success)
        .catch(fail);

      function success(response) {
        return response;
      }

      function fail(e) {
        return exception.catcher('Failed for dataservice.authWithPassword')(e);
      }
    }

    function createUser(cred) {
      var ref = new Firebase(url);
      var data = $firebaseAuth(ref);

      return data.$createUser(cred)
        .then(success)
        .catch(fail);

      function success(response) {
        return response;
      }

      function fail(e) {
        return exception.catcher('Failed for dataservice.createUser')(e);
      }
    }

    function removeUser(cred) {
      var ref = new Firebase(url);
      var data = $firebaseAuth(ref);

      return data.$removeUser()
        .then(success)
        .catch(fail);

      function success(response) {
        return response;
      }

      function fail(e) {
        return exception.catcher('Failed for dataservice.removeUser')(e);
      }
    }

    function addUser(uid, email, name) {
      var d = $q.defer();
      var ref = new Firebase(url + 'users').child(uid);

      // Create the data we want to update
      var updatedUserData = {};
      updatedUserData['private'] = {
        consent: {
          required: true,
        },
      };
      updatedUserData['public'] = {
        id: uid,
        display_name: name,
        created_at: Firebase.ServerValue.TIMESTAMP,

        // TODO: update object to include other fields
      };

      ref.update(updatedUserData, function (error) {
        if (error) {
          fail(error);
        } else {
          success();
        }
      });

      return d.promise;

      function success(response) {
        d.resolve('success');
      }

      function fail(e) {
        d.reject(exception.catcher('Failed for dataservice.addUser')(e));
      }
    }

    /* User functions
       ================================================== */

    function getUsers() {
      var ref = new Firebase(url + 'users');
      var data = $firebaseObject(ref);

      return data.$loaded()
        .then(success)
        .catch(fail);

      function success(response) {
        return response;
      }

      function fail(e) {
        return exception.catcher('Failed for dataservice.getUsers')(e);
      }
    }

    function getUsersRecent(limit) {
      var ref = new Firebase(url + 'users')
        .orderByChild('public/updated_at')
        .limitToLast(limit);
      var data = $firebaseArray(ref);

      return data.$loaded()
        .then(success)
        .catch(fail);

      function success(response) {
        return $filter('orderBy')(response, 'updated_at', true);
      }

      function fail(e) {
        return exception.catcher('Failed for dataservice.getUsersRecent')(e);
      }
    }

    /* Group functions
       ================================================== */

    function getGroups() {
      var ref = new Firebase(url + 'groups');
      var data = $firebaseObject(ref);

      return data.$loaded()
        .then(success)
        .catch(fail);

      function success(response) {
        return response;
      }

      function fail(e) {
        return exception.catcher('Failed for dataservice.getGroups')(e);
      }
    }

    function getGroupsByUserId(id) {
      var ref = new Firebase(url + 'groups')
        .orderByChild('members/' + id)
        .equalTo(true);
      var data = $firebaseArray(ref);

      return data.$loaded()
        .then(success)
        .catch(fail);

      function success(response) {
        return $filter('orderBy')(response, 'updated_at', true);
      }

      function fail(e) {
        return exception.catcher('Failed for dataservice.getGroupsByUserId')(e);
      }
    }

    /* Observation functions
       ================================================== */

    function getObservationsArrayByUserId(id) {
      var ref = new Firebase(url + 'observations')
        .orderByChild('observer')
        .equalTo(id);
      var data = $firebaseArray(ref);

      return data.$loaded()
        .then(success)
        .catch(fail);

      function success(response) {
        return $filter('orderBy')(response, 'updated_at', true);
      }

      function fail(e) {
        return exception.catcher('Failed for dataservice.getObservationsArrayByUserId')(e);
      }
    }

    function getObservationsArrayByProjectId(id) {
      var d = $q.defer();

      getProjectLocationIds(id)
        .then(function (idArray) {
          var i = 0;
          var alength = idArray.length;

          var ref = void 0;
          var data = [];

          for (i; i < alength; i++) {
            ref = new Firebase(url + 'observations')
              .orderByChild('activity_location')
              .equalTo(idArray[i]);

            ref.on('value', function (snapshot) {
              for (var key in snapshot.val()) {
                data.push(snapshot.val()[key]);
              }
            });
          }

          d.resolve(data);
        });

      return d.promise;

      function success(response) {
        return response;
      }

      function fail(e) {
        return exception.catcher('Failed for dataservice.getObservationsArrayByProjectId')(e);
      }
    }

    /* Project functions
       ================================================== */

    function getProjects() {
      var ref = new Firebase(url + 'activities');
      var data = $firebaseObject(ref);

      return data.$loaded()
        .then(success)
        .catch(fail);

      function success(response) {
        return response;
      }

      function fail(e) {
        return exception.catcher('Failed for dataservice.getProjects')(e);
      }
    }

    function getProjectsRecent(limit) {
      var ref = new Firebase(url + 'activities')
        .orderByChild('updated_at')
        .limitToLast(limit);
      var data = $firebaseArray(ref);

      return data.$loaded()
        .then(success)
        .catch(fail);

      function success(response) {
        return $filter('orderBy')(response, 'updated_at', true);
      }

      function fail(e) {
        return exception.catcher('Failed for dataservice.getProjectsRecent')(e);
      }
    }

    function getProjectLocationIds(id) {
      var d = $q.defer();
      var ref = new Firebase(url + 'geo/activities')
        .orderByChild('activity')
        .equalTo(id);

      ref.on('value', success, fail);

      return d.promise;

      function success(response) {
        var a = [];

        for (var key in response.val()) {
          a.push(key);
        }

        d.resolve(a);
      }

      function fail(e) {
        d.reject(exception.catcher('Failed for dataservice.getProjectLocationIds')(e));
      }
    }

    /* Idea functions
       ================================================== */

    function addIdea(uid, content) {
      var ref = new Firebase(url + 'ideas');
      var data = $firebaseArray(ref);

      // Create the data we want to update
      var updatedIdeaData = {
        group: 'idea',
        submitter: uid,
        content: content,
        created_at: Firebase.ServerValue.TIMESTAMP,

        // TODO: update object to include other fields
      };

      return data.$add(updatedIdeaData)
        .then(success)
        .catch(fail);

      function success(response) {
        return response;
      }

      function fail(e) {
        return exception.catcher('Failed for dataservice.getProjectsRecent')(e);
      }
    }

  }
})();
