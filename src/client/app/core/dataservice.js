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

    //TODO: set value of database and logging in build
    (function () {
      var database = 'naturenet';
      var config = {
        apiKey: 'AIzaSyAm--uHylcDf4J5wGroMzPeKmw6uIDnVr8',
        authDomain: database + '.firebaseapp.com',
        databaseURL: 'https://' + database + '.firebaseio.com',
        storageBucket: database + '.appspot.com',
      };
      firebase.initializeApp(config);
      firebase.database.enableLogging(true);
      $firebaseRefProvider.registerUrl('https://' + database + '.firebaseio.com');
    })();

    var service = {
      // Utility functions
      getArray: getArray,

      // Authentication functions
      onAuth: onAuth,
      getAuth: getAuth,
      authWithPassword: authWithPassword,
      unAuth: unAuth,
      createUser: createUser,
      addUser: addUser,
      updateUser: updateUser,
      resetPassword: resetPassword,
      getActiveUserDetails: getActiveUserDetails,

      // User functions
      getUsers: getUsers,
      getUsersRecent: getUsersRecent,
      getActiveUser: getActiveUser,

      // Group functions
      getGroups: getGroups,
      getGroupById: getGroupById,
      getGroupsByUserId: getGroupsByUserId,

      // Site functions
      getSiteById: getSiteById,

      // Observation functions
      getObservationsArrayByUserId: getObservationsArrayByUserId,
      getObservationsArrayByProjectId: getObservationsArrayByProjectId,

      // Project functions
      getProjects: getProjects,
      getProjectsRecent: getProjectsRecent,
      getProjectForObservation: getProjectForObservation,

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
      var ref = firebase.database().ref(s)
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
      data.updated_at = firebase.database.ServerValue.TIMESTAMP;

      if (!data.hasOwnProperty('created_at')) {
        data.created_at = firebase.database.ServerValue.TIMESTAMP;
      }

      return data;
    }

    /* Authentication functions
       ================================================== */

    function onAuth() {
      var d = $q.defer();
      var auth = firebase.auth();

      auth.onAuthStateChanged(function (user) {
        d.resolve(user);
      });

      return d.promise;
    }

    function getAuth() {
      return firebase.auth().currentUser;
    }

    function authWithPassword(email, password) {
      var auth = $firebaseAuth(firebase.auth());

      return auth.$signInWithEmailAndPassword(email, password)
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
      var auth = $firebaseAuth(firebase.auth());
      return auth.$signOut();
    }

    function createUser(email, password) {
      var auth = $firebaseAuth(firebase.auth());
      return auth.$createUserWithEmailAndPassword(email, password)
        .then(success)
        .catch(fail);

      function success(response) {
        return response;
      }

      function fail(e) {
        return exception.catcher('Failed for dataservice.createUser')(e);
      }
    }

    function addUser(profile) {
      var d = $q.defer();
      var root = firebase.database().ref();

      // Create the data we want to update
      var uid = profile.uid;
      var newUserData = {};
      newUserData['users-private/' + uid] = timestamp({
        id: uid,
        name: profile.name,
      });
      newUserData['users/' + uid] = timestamp({
        id: uid,
        display_name: profile.display_name,
        affiliation: profile.affiliation,
        bio: profile.bio,
      });

      root.update(newUserData, function (error) {
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

    function updateUser(profile) {
      var d = $q.defer();
      var root = firebase.database().ref();

      // Create the data we want to update
      var uid = profile.uid;
      var updatedUserData = {};

      updatedUserData['users-private/' + uid + '/id'] = uid;
      updatedUserData['users-private/' + uid + '/name'] = profile.name;
      updatedUserData['users-private/' + uid + '/demographics'] = profile.demographics;
      updatedUserData['users-private/' + uid + '/updated_at'] = firebase.database.ServerValue.TIMESTAMP;

      updatedUserData['users/' + uid + '/id'] = uid;
      updatedUserData['users/' + uid + '/display_name'] = profile.display_name;
      updatedUserData['users/' + uid + '/affiliation'] = profile.affiliation;
      updatedUserData['users/' + uid + '/bio'] = profile.bio;
      updatedUserData['users/' + uid + '/groups'] = {};

      if (!!profile.group) {
        updatedUserData['users/' + uid + '/groups'][profile.group] = true;
      }

      updatedUserData['users/' + uid + '/updated_at'] = firebase.database.ServerValue.TIMESTAMP;

      //updatedUserData['groups' + profile.group + '/members/' + uid] = true;

      root.update(updatedUserData, function (error) {
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
        d.reject(exception.catcher('Failed for dataservice.updateUser')(e));
      }
    }

    function resetPassword(email) {
      var auth = $firebaseAuth(firebase.auth());
      return auth.$sendPasswordResetEmail({ email: email })
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
      var ref = firebase.database().ref('users');
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
      var ref = firebase.database().ref('users')
        .orderByChild('created_at')
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
        return $q.when(null);
      }

      var ref = firebase.database().ref('users/' + auth.uid);
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

    function getActiveUserDetails() {
      var auth = getAuth();

      if (auth === null || !auth.uid) {
        console.log('User is not signed in.');
        return $q.when(null);
      }

      var ref = firebase.database().ref('users/' + auth.uid);
      var publicData = $firebaseObject(ref);

      ref = firebase.database().ref('users-private/' + auth.uid);
      var privateData = $firebaseObject(ref);

      return Promise.all([publicData.$loaded(), privateData.$loaded()])
        .then(success)
        .catch(fail);

      function success(response) {
        return response;
      }

      function fail(e) {
        return exception.catcher('Failed for dataservice.getActiveUserDetails')(e);
      }
    }

    /* Group functions
       ================================================== */

    function getGroups() {
      var ref = firebase.database().ref('groups');
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

    function getGroupById(id) {
      var ref = firebase.database().ref('groups').child(id);
      var data = $firebaseObject(ref);

      return data.$loaded()
        .then(success)
        .catch(fail);

      function success(response) {
        return response;
      }

      function fail(e) {
        return exception.catcher('Failed for dataservice.getGroupById')(e);
      }
    }

    function getGroupsByUserId(id) {
      var ref = firebase.database().ref('groups')
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

    /* Site functions
       ================================================== */

    function getSiteById(id) {
      var ref = firebase.database().ref('sites').child(id);
      var data = $firebaseObject(ref);

      return data.$loaded()
        .then(success)
        .catch(fail);

      function success(response) {
        return response;
      }

      function fail(e) {
        return exception.catcher('Failed for dataservice.getSiteById')(e);
      }
    }

    /* Observation functions
       ================================================== */

    function getObservationsArrayByUserId(id) {
      var ref = firebase.database().ref('observations')
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
          var promises = [];

          for (var i in idArray) {
            var ref = firebase.database().ref('observations')
              .orderByChild('activity_location')
              .equalTo(idArray[i]);

            var data = $firebaseArray(ref);
            promises.push(data.$loaded());
          }

          d.resolve($q.all(promises)
            .then(success)
            .catch(fail));
        });

      return d.promise;

      function success(response) {
        var observations = [];
        for (var p = 0; p < response.length; ++p) {
          for (var o = 0; o < response[p].length; ++o) {
            observations.push(response[p][o]);
          }
        }

        return observations;
      }

      function fail(e) {
        return exception.catcher('Failed for dataservice.getObservationsArrayByProjectId')(e);
      }
    }

    /* Project functions
       ================================================== */

    function getProjects() {
      var ref = firebase.database().ref('activities');
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
      var ref = firebase.database().ref('activities')
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
      var ref = firebase.database().ref('geo/activities')
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

    function getProjectForObservation(obs) {
      var d = $q.defer();

      var geoId = obs.activity_location;
      var geo = firebase.database().ref('geo/activities').child(geoId);

      geo.once('value', function (geoData) {

        if (geoData.exists()) {
          var activityId = geoData.child('activity').val();
          var activity = firebase.database().ref('activities').child(activityId);

          activity.once('value', function (activityData) {

            if (activityData.exists()) {
              d.resolve(activityData.val());
            } else {
              d.reject();
            }

          });

        } else {
          d.reject();
        }
      });

      return d.promise;
    }

    /* Idea functions
       ================================================== */

    function addIdea(uid, content, group, type) {
      var root = firebase.database().ref();
      var id = root.child('ideas').push().key;

      var idea = timestamp({
        id: id,
        group: group,
        type: type,
        submitter: uid,
        content: content,
        status: 'doing',
      });

      var newData = {};
      newData['ideas/' + id] = idea;
      newData['users/' + uid + '/latest_contribution'] = firebase.database.ServerValue.TIMESTAMP;

      return root.update(newData).then(success).catch(fail);

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

      $firebaseObject(firebase.database().ref(type + '/' + record.$id + '/likes')).$loaded().then(function (likes) {
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

      var root = firebase.database().ref();
      var id = root.child('comments').push().key;

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

      root.update(newData);
    }

    function getCommentsRecent(limit) {
      var ref = firebase.database().ref('comments')
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
      var ref = firebase.database().ref('comments')
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
      var ref = firebase.database().ref('comments')
        .orderByChild('parent')
        .equalTo(record.$id || record.id);
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
