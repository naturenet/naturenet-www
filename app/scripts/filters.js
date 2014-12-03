'use strict';

/* Filters */

angular.module('naturenetWebApp.filters', [])
    .filter('interpolate', ['version',
        function(version) {
            return function(text) {
                return String(text).replace(/\%VERSION\%/mg, version);
            };
        }
    ])
    .filter('thumb', [
        function() {
            return function(text) {
                return String(text).replace('upload/', 'upload/w_300,h_200,c_fit/');
            };
        }
    ])
    .filter('medium', [
        function() {
            return function(text) {
                return String(text).replace('upload/', 'upload/w_640/');
            };
        }
    ]);