(function () {
  'use strict';

  angular
    .module('app.core')
    .factory('dataservice', dataservice);

  /* Dataservice
     ======================================================================== */

  dataservice.$inject = [
    '$q',
    '$firebaseObject',
    '$firebaseArray',
    '$firebaseAuth',
    '$filter',
    'FilteredArray',
    'exception',
    'logger',
  ];
  /* @ngInject */
  function dataservice($q, $firebaseObject, $firebaseArray, $firebaseAuth, $filter, FilteredArray, exception, logger) {
    var dataUrl = 'https://naturenet.firebaseio.com/';

    var service = {
      // Utility functions
      getArray: getArray,

      // Authentication functions
      onAuth: onAuth,
      getAuth: getAuth,
      authWithPassword: authWithPassword,
      unAuth: unAuth,
      createUser: createUser,
      removeUser: removeUser,
      addUser: addUser,
      resetPassword: resetPassword,

      // User functions
      getUsers: getUsers,
      getUsersRecent: getUsersRecent,
      getActiveUser: getActiveUser,

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

      // Feedback functions
      likeContent: likeContent,
      addComment: addComment,

      getCommentsRecent: getCommentsRecent,
      getCommentsForRecord: getCommentsForRecord,
      getCommentsByUserId: getCommentsByUserId,
    };

    return service;

    /* Utility functions
       ================================================== */

    function getArray(s) {
      var ref = new Firebase(dataUrl + s)
        .orderByChild('updated_at')
        .limitToLast(50);
      var data = notDeletedArray(ref);

      return data.$loaded()
        .then(success)
        .catch(fail);

      function success(response) {
        return response;
      }

      function fail(e) {
        return exception.catcher('Failed for dataservice.getArray')(e);
      }
    }

    function notDeletedArray(ref) {
      return new FilteredArray(ref, function (item) {
        return !(item.hasOwnProperty('status') && item.status.toLowerCase() === 'deleted');
      });
    }

    function timestamp(data) {
      data.updated_at = Firebase.ServerValue.TIMESTAMP;

      if (!data.hasOwnProperty('created_at')) {
        data.created_at = Firebase.ServerValue.TIMESTAMP;
      }

      return data;
    }

    /* Authentication functions
       ================================================== */

    function onAuth() {
      var d = $q.defer();
      var ref = new Firebase(dataUrl);
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
      var ref = new Firebase(dataUrl);
      var data = $firebaseAuth(ref);

      return data.$getAuth();
    }

    function authWithPassword(cred) {
      var ref = new Firebase(dataUrl);
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

    function unAuth() {
      var ref = new Firebase(dataUrl);
      var data = $firebaseAuth(ref);

      return data.$unauth();
    }

    function createUser(cred) {
      var ref = new Firebase(dataUrl);
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
      var ref = new Firebase(dataUrl);
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

    function addUser(profile) {
      var d = $q.defer();
      var ref = new Firebase(dataUrl);

      // Create the data we want to update
      var uid = profile.uid;
      var updatedUserData = {};
      updatedUserData['users-private/' + uid] = timestamp({
        id: uid,
        name: profile.name,
        consent: profile.consent,
      });
      updatedUserData['users/' + uid] = timestamp({
        id: uid,
        display_name: profile.display_name,
        affiliation: profile.affiliation,
      });

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

    function resetPassword(email) {
      var ref = new Firebase(dataUrl);
      var data = $firebaseAuth(ref);
      return data.$resetPassword({ email: email })
        .then(success)
        .catch(fail);

      function success(response) {
        return response;
      }

      function fail(e) {
        return exception.catcher('Failed for dataservice.resetPassword')(e);
      }
    }

    /* User functions
       ================================================== */

    function getUsers() {
      var ref = new Firebase(dataUrl + 'users');
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
      var ref = new Firebase(dataUrl + 'users')
        .orderByChild('public/updated_at')
        .limitToLast(limit);
      var data = notDeletedArray(ref);

      return data.$loaded()
        .then(success)
        .catch(fail);

      function success(response) {
        return response;
      }

      function fail(e) {
        return exception.catcher('Failed for dataservice.getUsersRecent')(e);
      }
    }

    function getActiveUser() {
      var auth = getAuth();

      if (auth === null || !auth.uid) {
        console.log('User is not signed in.');
        return;
      }

      var ref = new Firebase(dataUrl + 'users/' + auth.uid);
      var data = $firebaseObject(ref);

      return data.$loaded()
        .then(success)
        .catch(fail);

      function success(response) {
        return response;
      }

      function fail(e) {
        return exception.catcher('Failed for dataservice.getCurrentUser')(e);
      }
    }

    /* Group functions
       ================================================== */

    function getGroups() {
      var ref = new Firebase(dataUrl + 'groups');
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
      var ref = new Firebase(dataUrl + 'groups')
        .orderByChild('members/' + id)
        .equalTo(true);
      var data = notDeletedArray(ref);

      return data.$loaded()
        .then(success)
        .catch(fail);

      function success(response) {
        return response;
      }

      function fail(e) {
        return exception.catcher('Failed for dataservice.getGroupsByUserId')(e);
      }
    }

    /* Observation functions
       ================================================== */

    function getObservationsArrayByUserId(id) {
      var ref = new Firebase(dataUrl + 'observations')
        .orderByChild('observer')
        .equalTo(id);
      var data = notDeletedArray(ref);

      return data.$loaded()
        .then(success)
        .catch(fail);

      function success(response) {
        return response;
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
            ref = new Firebase(dataUrl + 'observations')
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
        return $filter('notDeleted')(response);
      }

      function fail(e) {
        return exception.catcher('Failed for dataservice.getObservationsArrayByProjectId')(e);
      }
    }

    /* Project functions
       ================================================== */

    function getProjects() {
      var ref = new Firebase(dataUrl + 'activities');
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
      var ref = new Firebase(dataUrl + 'activities')
        .orderByChild('updated_at')
        .limitToLast(limit);
      var data = notDeletedArray(ref);

      return data.$loaded()
        .then(success)
        .catch(fail);

      function success(response) {
        return response;
      }

      function fail(e) {
        return exception.catcher('Failed for dataservice.getProjectsRecent')(e);
      }
    }

    function getProjectLocationIds(id) {
      var d = $q.defer();
      var ref = new Firebase(dataUrl + 'geo/activities')
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

    function addIdea(uid, content, group, type) {
      var ref = new Firebase(dataUrl + 'ideas');

      var id = ref.push().key();

      var idea = timestamp({
        id: id,
        group: group,
        type: type,
        submitter: uid,
        content: content,
        status: 'doing',
      });

      return ref.child(id).set(idea).then(success).catch(fail);

      function success(response) {
        return response;
      }

      function fail(e) {
        return exception.catcher('Failed for dataservice.addIdea')(e);
      }
    }

    /* Feedback functions
       ================================================== */

    function likeContent(type, record, isPositive) {
      var auth = getAuth();

      if (auth === null || !auth.uid) {
        console.log('You must be signed in to do that!');
        return;
      }

      var uid = auth.uid;

      $firebaseObject(new Firebase(dataUrl + type + '/' + record.$id + '/likes')).$loaded().then(function (likes) {
        if (likes[uid] === isPositive) {
          delete likes[uid];
        } else {
          likes[uid] = isPositive;
        }

        likes.$save();
      });

    }

    function addComment(context, record, text) {
      var auth = getAuth();

      if (auth === null || !auth.uid) {
        console.log('You must be signed in to do that!');
        return;
      }

      var ref = new Firebase(dataUrl);
      var id = ref.child('comments').push().key();

      var newComment = timestamp({
        id: id,
        parent: record.$id,
        context: context,
        comment: text,
        commenter: auth.uid,
      });

      var newData = {};
      newData['comments/' + id] = newComment;
      newData[context + '/' + record.$id + '/comments/' + id] = true;

      ref.update(newData);
    }

    function getCommentsRecent(limit) {
      var ref = new Firebase(dataUrl + 'comments')
        .orderByChild('updated_at')
        .limitToLast(limit);
      var data = notDeletedArray(ref);

      return data.$loaded()
        .then(success)
        .catch(fail);

      function success(response) {
        return response;
      }

      function fail(e) {
        return exception.catcher('Failed for dataservice.getCommentsRecent')(e);
      }
    }

    function getCommentsByUserId(id) {
      var ref = new Firebase(dataUrl + 'comments')
        .orderByChild('commenter')
        .equalTo(id);
      var data = notDeletedArray(ref);

      return data.$loaded()
        .then(success)
        .catch(fail);

      function success(response) {
        return response;
      }

      function fail(e) {
        return exception.catcher('Failed for dataservice.getCommentsByUserId')(e);
      }
    }

    function getCommentsForRecord(record) {
      var ref = new Firebase(dataUrl + 'comments')
        .orderByChild('parent')
        .equalTo(record.$id);
      var data = notDeletedArray(ref);

      return data.$loaded()
        .then(success)
        .catch(fail);

      function success(response) {
        return response;
      }

      function fail(e) {
        return exception.catcher('Failed for dataservice.getCommentsForRecord')(e);
      }
    }
  }
})();
