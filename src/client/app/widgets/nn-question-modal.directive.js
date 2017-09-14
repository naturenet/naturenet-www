(function () {
  'use strict';

  angular
    .module('app.widgets')
    .directive('nnQuestionModal', nnQuestionModal);

  nnQuestionModal.$inject = ['utility', 'logger'];
  /* @ngInject */
  function nnQuestionModal(utility, logger) {
    // Usage:
    // Creates:
    var directive = {
      scope: {
        content: '@',
        show: '=',
      },
      link: link,
      templateUrl: 'app/widgets/nn-question-modal.html',
      restrict: 'EA',
      controller: ['$scope', 'dataservice', controller],
    };
    return directive;

    function link(scope, element, attrs) {
      scope.hide = hide;

      function hide() {
        scope.show = false;
      }
    }

    function controller($scope, dataservice) {

      $scope.submitQuestion = function(){
        console.log($scope.content);
        //make sure the question isn't empty
        if(!$scope.content ){
          console.log("Question was empty.");
          logger.error("Question cannot be empty");
        }else{
          if(confirm("Submit question?")){
            dataservice.addQuestion($scope.content).then(function(result){
              logger.success('Your question has been submitted.');
            });
            $scope.content = '';
            $scope.show = false;
          }
        }

      };
    }
  }
})();
