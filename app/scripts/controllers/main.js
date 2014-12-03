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
        
            $scope.notes = notes.filter(function(x){
            	return x.kind == 'FieldNote' && x.medias && x.medias.length > 0
            }).reverse().slice(0,24);

        });

    });