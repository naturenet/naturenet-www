'use strict';

/**
 * @ngdoc function
 * @name naturenetWebApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the naturenetWebApp
 */
var nnWebApp = angular.module('naturenetWebApp');

nnWebApp.value('apiRoot', 'http://naturenet.herokuapp.com/api');

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
    .controller('ObservationListCtrl', ['$scope', '$http', 'Lightbox', 'apiRoot', function($scope, $http, Lightbox, apiRoot) {

        $scope.currentYear = 2015;
        $scope.currentMonth = 3;
        var url = apiRoot + '/sync/notes/within/' + $scope.currentYear + '/' + $scope.currentMonth + '/at/aces';
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

            var url = apiRoot + '/sync/notes/within/' + $scope.currentYear + '/' + $scope.currentMonth + '/at/aces';
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
            var url = apiRoot + '/sync/notes/within/' + $scope.currentYear + '/' + $scope.currentMonth + '/at/aces';
            $http.get(url).success(function(data) {
                success(data);
            });
        };
    }])
    .controller('ObservationCtrl', ['$scope', '$http', '$routeParams', 'UserService', 'apiRoot', function($scope, $http, $routeParams, UserService, apiRoot) {
        var url = apiRoot + '/note/' + $routeParams.id;
        $http.get(url).success(function(data) {
            $scope.observation = data.data;
            var feedbacksURL = apiRoot + '/note/' + data.data.id + '/feedbacks';
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
                var addFeedbackURL = apiRoot + '/feedback/new/comment/for/note/' + 
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
    .controller('ActivityListCtrl', ['$scope', '$http', 'apiRoot', function($scope, $http, apiRoot) {

        var url = apiRoot + '/context/activities';
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
                var urlNotes = apiRoot + '/context/' + activity.id + '/notes';

                $http.get(urlNotes).success(function(data){

                    activity.notes = data.data.filter(function(note){
                        return note.medias && note.medias.length > 0 && note.status !== 'deleted';
                    }).reverse();

                });

            });
        });
    }])
    .controller('DesignIdeaListCtrl', ['$scope', '$http', '$routeParams', 'UserService', 'apiRoot', function($scope, $http, $routeParams, UserService, apiRoot) {
        // var url = 'data.json'
        var url = apiRoot + '/designideas/at/aces';
        $http.get(url).success(function(data) {
            $scope.designIdeas = data.data;

            $scope.designIdeas.forEach(function(x) {
                x.likes = x.feedbacks.filter(function(f) {return f.kind === 'like';}).length;
            });

            $scope.designIdeas = $scope.designIdeas.reverse();
        });
      
        $scope.prompts = [
          { 
            name: "Wouldn't it be cool if...", 
            context: "aces_design_new", 
            text: "Tell us about new features or activities you would like on this app:" },
          { 
            name: "It would be better if...", 
            context: "aces_design_existing", 
            text: "Is there something we could do better?" },
          { 
            name: "Open Suggestion", 
            context: "aces_design_idea", 
            text: "Contribute a design idea to make NatureNet better" }
        ];
        $scope.selected_prompt = $scope.prompts[0];
        
        $scope.account = UserService.user;
        $scope.addIdea = function() {
            if (!$scope.account.isSignedIn) {
                $scope.showAlert = true;
            } else {
                $scope.loading = true; // show loading icon
                $scope.showAlert = false;
                var addFeedbackURL = apiRoot + '/note/new/' + UserService.user.username;
                $http({
                    url: addFeedbackURL,
                    method:'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    data: $.param({
                        content: $scope.designidea,
                        kind: 'DesignIdea',
                        context:  $scope.selected_prompt.context
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
            var url = apiRoot + '/feedback/new/like/for/Note/' + idea.id + '/by/' + UserService.user.username;
            $http({
                url: url,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                data: $.param({
                    content: true,
                    parent_id: 0
                })
            }).success(function(data) {
                console.log("Updated note: ", data);
            });
        };

    }])
    .controller('OtherController', ['$scope', function($scope) {
        $scope.pageChangeHandler = function(num) {
            console.log('going to page ' + num);
        };
    }])
    .controller('SignUpController', ['$scope', '$http', 'UserService', 'apiRoot', function($scope, $http, UserService, apiRoot) {
        $scope.account = {};
        
        $scope.consent = {
            notice: 'You are invited to participate in NatureNet, a research project being conducted by the researchers listed at http://research.nature-net.org/people.html. In order for us to collect and study the way people are using technology like NatureNet, we must have your consent.',
            upload: '(Required) I agree that any observations (photos) or comments I contribute to NatureNet may be publicly displayed on the web, mobile phone, or tabletop platforms that comprise NatureNet.',
            share: '(Required) I agree to allow any comments, observations, and profile information that I choose to share with others via the online application to be visible to others who use the application at the same time or after me.',
            recording: '(Optional) I agree to be videotaped/audiotaped during my participation in this study.',
            survey: '(Optional) I agree to complete a short questionnaire during or after my participation in this study.'
        };
        
        $scope.affiliations = [
            { name: "ACES in Colorado", key: "aces_user" },
            { name: "AWS in Maryland", key: "aws_user" },
            { name: "Reedy Creek in North Carolina", key: "rcnp_user" },
            { name: "Other", key: "" }
        ];
        
        $scope.submit = function() {
            if($scope.validate()) {
                var url = apiRoot + '/account/new/' + $scope.account.username;
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
                        consent: angular.toJson($scope.account.consent),
                        affiliation: $scope.account.affiliation
                    })
                }).success(function(data){
                    //TODO: sign in automatically (reuse code)
                    $scope.errorMessage = null;
                    $scope.successMessage = "Welcome to NatureNet, " + data.data.username + "!";
                    $scope.account = {};
                    console.log('User successfully created');
                }).error(function(data, status){
                    $scope.successMessage = null;
                    $scope.errorMessage = (data && data.status_txt) || "Oops, something went wrong. Please check your information and try again.";
                    console.log('Error creating user');
                });
            }
        };
        
        $scope.validate = function() {
            if(!($scope.account.consent && $scope.account.consent.upload && $scope.account.consent.share)) {
                $scope.errorMessage = "You must consent to the required terms to participate.";
                return false;
            }
            if(!($scope.account.name && $scope.account.password && $scope.account.name && $scope.account.email)) {
                $scope.errorMessage = "Please fill in all fields.";
                return false;
            }
            if(!/^[0-9]{4}$/.test($scope.account.password)) {
                $scope.errorMessage = "Please provide a 4-digit PIN.";
                return false;
            }
            $scope.errorMessage = null;
            return true;  
        };
    }])
    .controller('SigninController', ['$scope', '$http', 'UserService', 'apiRoot', function($scope, $http, UserService, apiRoot) {
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
            var url = apiRoot + '/account/' + $scope.account.username;
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
    .controller('ObservationsCtrl', ['$scope', '$http', 'NgMap', 'apiRoot', function($scope, $http, NgMap, apiRoot){
        $scope.gmap = this;
        $scope.gmap.observations = [];
        
        $scope.fixFormatting = function(observation) {
            if(observation) {
                observation.context.extras = angular.fromJson(observation.context.extras);
                if(observation.kind === "BirdCounting") {
                    observation.content = angular.fromJson(observation.content);
                    //TODO: this is ugly
                    observation.context.extras.Birds.forEach(function(be) {
                        observation.content.birds.forEach(function(b){
                            if(be.name === b.name) {
                                b.image = be.image;
                            }
                        });
                    });
                }
            }
        }
        
        NgMap.getMap().then(function(map) {
            $scope.gmap.map = map;
            console.log('Loaded map');
            
            return $http.get(apiRoot + '/notes')
            .success(function(data){
                $scope.gmap.observations = data.data.filter(function(o) {
                    //TODO: put this somewhere generic
                    return o.status !== 'deleted';
                });
                $scope.gmap.observations.forEach(function(o) {
                    try {
                        $scope.fixFormatting(o);
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

nnWebApp.factory('observations', ['$resource', 'apiRoot', function($resource, apiRoot) {
    var obsResource = $resource(apiRoot + '/sync/notes/within/:yyyy/:mm/at/aces', {yyyy: '2015', mm: '03'});
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