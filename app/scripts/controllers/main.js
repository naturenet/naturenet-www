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
	.controller('ObservationListCtrl', function($scope, $http) {

        $http.get('data.json').success(function(data) {

            var notes = data.data;

            $scope.notes = notes.filter(function(x) {
                return x.kind == 'FieldNote' && x.medias && x.medias.length > 0
            }).reverse().slice(0, 200);


        });

        $scope.currentPage = 1
        $scope.pageSize = 12

    })   
    .controller('ObservationCtrl', function($scope, $http, $routeParams){


    	var url = 'http://naturenet.herokuapp.com/api/note/' + $routeParams.id
		
		$http.get(url).success(function(data) {
			$scope.observation = data.data;
		});

    })
    .controller('OtherController', function($scope) {
        $scope.pageChangeHandler = function(num) {
            console.log('going to page ' + num);
        };
    });