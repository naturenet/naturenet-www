'use strict';

/**
 * @ngdoc overview
 * @name naturenetWebApp
 * @description
 * # naturenetWebApp
 *
 * Main module of the application.
 */
angular
  .module('naturenetWebApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'naturenetWebApp.filters',
    'angularUtils.directives.dirPagination'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/home.html',
        controller: 'MainCtrl'
      })
      .when('/observations', {
        templateUrl: 'views/observations.html',
        controller: 'ObservationsCtrl'
      })      
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
