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


        var slides = $scope.slides = [];
        $scope.addSlide = function() {
            // var newWidth = 600 + slides.length + 1;
            slides.push({
                image: 'images/slide-' + i + '.jpg',
                text: 'ACES'
            });
        };
        for (var i = 1; i < 4; i++) {
            $scope.addSlide(i);
        }


        // $http.get('data.json').success(function(data) {

        //     var notes = data.data;

        //     $scope.images = []
        //     $scope.notes = notes.reverse().slice(0, 200).filter(function(x) {
        //         return x.kind == 'FieldNote' && x.medias && x.medias.length > 0
        //     });

        //     $scope.notes.forEach(function(x, i) {
        //         x.index = i
        //     });

        //     $scope.images = $scope.notes.map(function(x) {
        //         return {
        //             'url': x.medias[0].link,
        //             'caption': 'some caption'
        //         };
        //     });

        //     $scope.openLightboxModal = function(index) {
        //         console.log('open')
        //         Lightbox.openModal($scope.images, index);
        //     };

        // });


        // $scope.currentPage = 1
        // $scope.pageSize = 12


    })
    .controller('ObservationListCtrl', function($scope, $http, Lightbox) {

        $http.get('data.json').success(function(data) {

            var notes = data.data;

            $scope.notes = notes.filter(function(x) {
                return x.kind == 'FieldNote' && x.medias && x.medias.length > 0
            }).reverse().slice(0, 200);

            $scope.notes.forEach(function(x, i) {
                x.index = i
            });

            $scope.images = $scope.notes.map(function(x) {
                return {
                    'url': x.medias[0].link,
                    'caption': x.content
                };
            });

            $scope.openLightboxModal = function(index) {
                console.log('open')
                Lightbox.openModal($scope.images, index);
            };


        });

        $scope.currentPage = 1
        $scope.pageSize = 12

    })
    .controller('ObservationCtrl', function($scope, $http, $routeParams) {


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