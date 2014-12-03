'use strict';

/**
 * @ngdoc function
 * @name naturenetWebApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the naturenetWebApp
 */
angular.module('naturenetWebApp')
    .controller('MainCtrl', function($scope, $http) {
        $scope.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
        ];

        $http.get('data.json').success(function(data) {

            var notes = data.data;

            $scope.notes = notes.filter(function(x) {
                return x.kind == 'FieldNote' && x.medias && x.medias.length > 0
            }).reverse().slice(0, 200);


        });

        $scope.currentPage = 1
        $scope.pageSize = 12

    })
	.controller('ObservationsCtrl', function($scope, $http) {

        $http.get('data.json').success(function(data) {

            var notes = data.data;

            $scope.notes = notes.filter(function(x) {
                return x.kind == 'FieldNote' && x.medias && x.medias.length > 0
            }).reverse().slice(0, 200);


        });

        $scope.currentPage = 1
        $scope.pageSize = 12

    })   
    .controller('OtherController', function($scope) {
        $scope.pageChangeHandler = function(num) {
            console.log('going to page ' + num);
        };
    });