'use strict';

/**
 * @ngdoc function
 * @name naturenetWebApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the naturenetWebApp
 */
var nnWebApp = angular.module('naturenetWebApp');
nnWebApp.controller('MainCtrl', ['$scope', function($scope) {
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
        for (var i = 4; i < 9; i++) {
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


    }])
    .controller('ObservationListCtrl', ['$scope', '$http', 'Lightbox', function($scope, $http, Lightbox) {

        // var url = 'http://naturenet-dev.herokuapp.com/api/notes';
        $scope.currentYear = 2015;
        $scope.currentMonth = 3;
        var url = 'http://naturenet.herokuapp.com/api/sync/notes/within/' +
                    $scope.currentYear + '/' + $scope.currentMonth + '/at/aces';
        // var url = 'data.json';
        $http.get(url).success(function(data) {
            success(data);
        });

        var success = function(data) {
            var notes = data.data;
            $scope.notes = notes.filter(function(x) {
                return x.kind === 'FieldNote' && x.medias && x.medias.length > 0 && x.status !== 'deleted';
            }).reverse();

            $scope.notes.forEach(function(x, i) {
                x.index = i;
            });

            $scope.images = $scope.notes.map(function(x) {
                return {
                    'url': x.medias[0].link,
                    'caption': x
                };
            });
            // $scope.openLightboxModal = function(index) {
            //     console.log('open');
            //     Lightbox.openModal($scope.images, index);
            // };
        };

        $scope.currentPage = 1;
        // $scope.pageSize = 12;
        var monthForTitle = function(month, year) {
            var months = ['Jan.', 'Feb.', 'Mar.', 'Apr.', 'May', 'Jun', 'Jul', 'Aug', 'Sep.', 'Oct.', 'Nov.', 'Dec.'];
            var date = months[month-1] + ' ' + year;
            return date;
        };
        $scope.dateTitle = monthForTitle($scope.currentMonth, $scope.currentYear);

        $scope.next = function() {
            $scope.currentMonth++;
            if ($scope.currentMonth === 13) {
                $scope.currentYear++;
                $scope.currentMonth = 1;
            } 
            $scope.dateTitle = monthForTitle($scope.currentMonth, $scope.currentYear);

            var url = 'http://naturenet.herokuapp.com/api/sync/notes/within/' +
                    $scope.currentYear + '/' + $scope.currentMonth + '/at/aces';
            $http.get(url).success(function(data) {
                success(data);
            });

        };

        $scope.prev = function() {
            $scope.currentMonth--;
            if ($scope.currentMonth === 0) {
                $scope.currentYear--;
                $scope.currentMonth = 12;
            } 
            $scope.dateTitle = monthForTitle($scope.currentMonth, $scope.currentYear);
            var url = 'http://naturenet.herokuapp.com/api/sync/notes/within/' +
                    $scope.currentYear + '/' + $scope.currentMonth + '/at/aces';
            $http.get(url).success(function(data) {
                success(data);
            });
        };
    }])
    .controller('ObservationCtrl', ['$scope', '$http', '$routeParams', 'UserService', function($scope, $http, $routeParams, UserService) {
        var url = 'http://naturenet.herokuapp.com/api/note/' + $routeParams.id;
        $http.get(url).success(function(data) {
            $scope.observation = data.data;
            var feedbacksURL = 'http://naturenet.herokuapp.com/api/note/' + data.data.id + '/feedbacks';
            $http.get(feedbacksURL).success(function(data) {
                var feedbacks = data.data;
                $scope.comments = feedbacks.filter(function(x) {
                    return x.kind === 'comment';
                });
            });

        });

        $scope.account = UserService.user;
        $scope.comment = '';
        $scope.addComment = function() {
            if (!$scope.account.isSignedIn) {
                $scope.showAlert = true;
            } else {
                $scope.loading = true;
                $scope.showAlert = false;
                var addFeedbackURL = 'http://naturenet.herokuapp.com/api/feedback/new/comment/for/note/' + 
                    $routeParams.id + '/by/' + UserService.user.username;
                $http({
                    url: addFeedbackURL,
                    method:'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    data: $.param({content: $scope.comment})
                    // data: $.param({$scope.comment: 'content'})
                }).success(function(data) {
                    // console.log(data);
                    $scope.loading = false;
                    $scope.comments.push(data.data);
                    $scope.comment = '';  // clear comment input
                }).error(function(data, status) {
                    console.log('error!' + status);
                });
            }            
        };
    }])
    .controller('ObservationWindowController', ['$scope', function($scope) {
        
    }])
    .controller('ActivityListCtrl', ['$scope', '$http', function($scope, $http) {

        var url = 'http://naturenet.herokuapp.com/api/context/activities';
        $scope.activities = [];     
        $http.get(url).success(function(data) {
            //TODO: parameterize site filter
            data.data.filter(function(x) {
                return x.site.name === 'aces' || x.site.name === 'elsewhere';
            }).forEach(function(x){                
                $scope.activities.push(x);
            });
            $scope.activities.forEach(function(activity){
                activity.extras = activity.extras && angular.fromJson(activity.extras);
                var urlNotes = 'http://naturenet.herokuapp.com/api/context/' + 
                    activity.id + '/notes';

                $http.get(urlNotes).success(function(data){

                    activity.notes = data.data.filter(function(note){
                        return note.medias && note.medias.length > 0 && note.status !== 'deleted';
                    }).reverse();

                });

            });
        });
    }])
    .controller('DesignIdeaListCtrl', ['$scope', '$http', '$routeParams', 'UserService', function($scope, $http, $routeParams, UserService) {
        // var url = 'data.json'
        var url = 'http://naturenet.herokuapp.com/api/designideas/at/aces';
        $http.get(url).success(function(data) {
            $scope.designIdeas = data.data;

            $scope.designIdeas.forEach(function(x) {
                x.likes = x.feedbacks.filter(function(f) {return f.kind === 'like';}).length;
            });

            $scope.designIdeas = $scope.designIdeas.reverse();
        });
        $scope.account = UserService.user;
        $scope.addIdea = function() {
            if (!$scope.account.isSignedIn) {
                $scope.showAlert = true;
            } else {
                $scope.loading = true; // show loading icon
                $scope.showAlert = false;
                var addFeedbackURL = 'http://naturenet.herokuapp.com/api/note/new/' + UserService.user.username;              
                // var addFeedbackURL = 'http://naturenet-dev.herokuapp.com/api/note/new/catz';
                $http({
                    url: addFeedbackURL,
                    method:'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    data: $.param({
                        content: $scope.designidea,
                        kind: 'DesignIdea',
                        context:  'aces_design_idea'
                    })
                }).success(function(data) {
                    // console.log(data);
                    $scope.loading = false;
                    var nIdea = data.data;
                    nIdea.likes = nIdea.feedbacks.filter(function(f) {return f.kind === 'like';}).length;
                    $scope.designIdeas.unshift(data.data);
                    $scope.designidea = '';  // clear design input
                }).error(function(data, status) {
                    console.log('error!' + status);
                });
            }            
        };
        
        $scope.likeIdea = function(idea) {
            //TODO: array of users who like it
            idea.likes += 1;
        };

    }])
    .controller('OtherController', ['$scope', function($scope) {
        $scope.pageChangeHandler = function(num) {
            console.log('going to page ' + num);
        };
    }])
    .controller('SignUpController', ['$scope', '$http', 'UserService', function($scope, $http, UserService) {
        $scope.account = {};
        
        $scope.consent = {
            upload: '(Required) I agree that any nature photos I take using the NatureNet application may be uploaded to the tabletop at ACES and/or a website now under development.',
            share: '(Required) I agree to allow any comments, observations, and profile information that I choose to share with others via the online application to be visible to others who use the application at the same time or after me.',
            recording: '(Optional) I agree to be videotaped/audiotaped during my participation in this study.',
            survey: '(Optional) I agree to complete a short questionnaire during or after my participation in this study.'
        };
        
        $scope.submit = function() {
            var url = 'http://naturenet-dev.herokuapp.com/api/account/new/' + $scope.account.username;
            $http({
                    url: url,
                    method:'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    data: $.param({
                        name: $scope.account.name,
                        password: $scope.account.password,
                        email: $scope.account.email,
                        //TODO: concat or represent differently
                        consent: angular.toJson($scope.account.consent)
                    })
                }).success(function(data){
                    //TODO: sign in automatically (reuse code)
                    $scope.success = data;
                    console.log('User successfully created');
                }).error(function(data, status){
                    $scope.errorMessage = data;
                    console.log('Error creating user');
                });
        };
    }])
    .controller('SigninController', ['$scope', '$http', 'UserService', function($scope, $http, UserService) {
        //TODO: move state mgt to auth service
        $scope.account = {
            isSignedIn: false
        };

        $scope.signout = function() {
            $scope.account.isSignedIn = false;
            $scope.message = false;
            UserService.user.isSignedIn = false;
        };

        $scope.submit = function() {
            // console.log('sign in clicked' + $scope.account);
            var url = 'http://naturenet.herokuapp.com/api/account/' + $scope.account.username;
            $http.get(url).success(function(data) {
                if (data.status_code === 200) {
                    var user = data.data;
                    if (user.password === $scope.account.password) {
                        $scope.account.isSignedIn = true;
                        window.sessionStorage.account = $scope.account;
                        UserService.user.username = $scope.account.username;
                        UserService.user.isSignedIn = $scope.account.isSignedIn;
                        // console.log(UserService.user);
                        $scope.message = 'Welcome, ' + $scope.account.username + '!' + ' If this is not you, ';  
                    } else {
                        $scope.account.isSignedIn = false;
                        $scope.message = 'We didn\'t recognize your username and password.';
                        console.log('pass not right.');
                    }
                } 
            })
            .error(function(data, status) {
                if (data.status_code === 400) {
                    $scope.errorName = 'We didn\'t recognize your username and password.';
                    console.log('username doesn\'t exist.');
                }
            });
        };
    }])
    .controller('ObservationsCtrl', ['$scope', '$http', 'NgMap', function($scope, $http, NgMap){
        $scope.gmap = this;
        $scope.gmap.observations = [];
        
        $scope.formatExtras = function(observation) {
            if(observation && observation.id) {
                switch(observation.id) {
                    case 44:
                    case 45:
                    case 46:
                        formatBirdCountingExtras(observation);
                        break;
                }
            }
        }
        
        $scope.formatBirdCountingExtras = function(observation) {
            
        }
        
        NgMap.getMap().then(function(map) {
            $scope.gmap.map = map;
            console.log('Loaded map');
            
            return $http.get('http://naturenet.herokuapp.com/api/notes')
            .success(function(data){
                $scope.gmap.observations = data.data.filter(function(o) {
                    //TODO: put this somewhere generic
                    return o.kind === 'FieldNote' && o.status !== 'deleted';
                });
                $scope.gmap.observations.forEach(function(o) {
                    try {
                        o.context.extras = angular.fromJson(o.context.extras);
                    } catch(e) {
                        console.log("Could not format extras: ", o.context.extras);
                    }
                });
            })
            .error(function(err){
                console.log('Error getting observations: ', err);
            });
            
        });
        
        $scope.showWindow = function(event, observation) {
            var iw = new google.maps.InfoWindow({content: angular.toJson(observation)});
            iw.open($scope.gmap.map, this);
        };
        
        $scope.selectObservation = function(event, observation) {
            //TODO: switch on context.id for custom template
            // 44,45,46: BirdCounting
            $scope.obs = observation;
            $scope.gmap.map.showInfoWindow('iw', this);
            console.log(observation);
        };
    }]);

nnWebApp.factory('UserService', function () {
    return {
        user: {
            username: '', 
            isSignedIn: false
        }
    };
});

nnWebApp.factory('observations', ['$resource', function($resource) {
    var obsResource = $resource('http://naturenet.herokuapp.com/api/sync/notes/within/:yyyy/:mm/at/aces', {yyyy: '2015', mm: '03'});
    //TODO: let the controller define dates
	var obsData = obsResource.get({yyyy: '2015', mm: '11'}).data;
    obsData.forEach(function(o) {
        //TODO: switch on context.id for additional parsing
        // 44,45,46: content
        o.context.extras = angular.fromJson(o.context.extras);
    });
    return obsData;
}]);

nnWebApp.directive('obsMarker', function() {
    return {
        restrict: 'E',
        scope: {
            obs: '=',
        },
        templateUrl: 'scripts/directives/obsMarker.html'
    };
});

nnWebApp.directive('obsWindow', function($templateRequest, $compile) {
    return {
        scope: true,
        link: function(scope, element, attrs) {
            $templateRequest('views/obsWindow.html').then(function(html){
                element.append($compile(html)(scope));
            });
        }
    };
});

nnWebApp.directive('registerForm', function($templateRequest, $compile) {
    return {
        scope: true,
        link: function(scope, element, attrs) {
            $templateRequest('views/register.html').then(function(html){
                element.append($compile(html)(scope));
            })
        }
    }
});