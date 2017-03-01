(function () {
  'use strict';

  var core = angular.module('app.core');

  core.config(geoConfig);

  geoConfig.$inject = ['$geolocationProvider'];

  /* @ngInject */
  function geoConfig($geolocationProvider) {
    $geolocationProvider.$get().watchPosition({
      timeout: 60000,
      maximumAge: 250,
      enableHighAccuracy: true,
    });
  }

  core.config(cloudinaryConfig);

  cloudinaryConfig.$inject = ['cloudinaryProvider'];

  function cloudinaryConfig(cloudinaryProvider) {
    cloudinaryProvider.config({
      cloud_name: 'university-of-colorado',
      upload_preset: 'web-preset',
    });
  }

  core.config(toastrConfig);

  toastrConfig.$inject = ['toastr'];
  /* @ngInject */
  function toastrConfig(toastr) {
    toastr.options.timeOut = 8000;
    toastr.options.positionClass = 'toast-bottom-right';
  }

  var config = {
    appErrorPrefix: '[NN Error] ',
    appTitle: 'NatureNet',

    mapOptions: {
      zoom: 5,
      minZoom: 3,
      zoomControl: true,
      scaleControl: false,
      streetViewControl: false,
      keyboardShortcuts: false,
      clickableIcons: false,
    },
  };

  core.value('config', config);

  core.config(configure);

  configure.$inject = ['$logProvider', 'routerHelperProvider', 'exceptionHandlerProvider'];
  /* @ngInject */
  function configure($logProvider, routerHelperProvider, exceptionHandlerProvider) {
    if ($logProvider.debugEnabled) {
      $logProvider.debugEnabled(true);
    }

    exceptionHandlerProvider.configure(config.appErrorPrefix);
    routerHelperProvider.configure({ docTitle: ' | ' + config.appTitle, });
  }

  core.constant('FirebaseName', 'naturenet-staging');

  core.config(function (FirebaseName) {
    //TODO: set value of database and logging in build
    firebase.initializeApp({
      apiKey: 'AIzaSyAQFqNCV7kdLHzkiBhtFzMmYoQLdlivNFU',
      authDomain: FirebaseName + '.firebaseapp.com',
      databaseURL: 'https://' + FirebaseName + '.firebaseio.com',
      storageBucket: FirebaseName + '.appspot.com',
    });
    firebase.database.enableLogging(false);
  });

  core.config(function (FirebaseName, $firebaseRefProvider) {
    $firebaseRefProvider.registerUrl({
      default: 'https://' + FirebaseName + '.firebaseio.com',
      projects: 'https://' + FirebaseName + '.firebaseio.com/activities',
      comments: 'https://' + FirebaseName + '.firebaseio.com/comments',
      geo: 'https://' + FirebaseName + '.firebaseio.com/geo',
      groups: 'https://' + FirebaseName + '.firebaseio.com/groups',
      ideas: 'https://' + FirebaseName + '.firebaseio.com/ideas',
      tags: 'https://' + FirebaseName + '.firebaseio.com/tags',
      observations: 'https://' + FirebaseName + '.firebaseio.com/observations',
      sites: 'https://' + FirebaseName + '.firebaseio.com/sites',
      users: 'https://' + FirebaseName + '.firebaseio.com/users',
      usersPrivate: 'https://' + FirebaseName + '.firebaseio.com/users-private',
      usersRanks: 'https://' + FirebaseName + '.firebaseio.com/users-ranks',
    });
  });

})();
