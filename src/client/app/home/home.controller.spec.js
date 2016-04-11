/* jshint -W117, -W030 */
describe('HomeController', function () {
  var controller;

  //var people = mockData.getMockPeople();

  beforeEach(function () {
    bard.appModule('app.home');
    bard.inject('$controller', '$log', '$q', '$rootScope', 'dataservice');
  });

  beforeEach(function () {

    //sinon.stub(dataservice, 'getPeople').returns($q.when(people));
    sinon.spy($rootScope, '$broadcast');
    controller = $controller('HomeController');
    $rootScope.$apply();
  });

  bard.verifyNoOutstandingHttpRequests();

  describe('Home controller', function () {
    it('should be created successfully', function () {
      expect(controller).to.be.defined;
    });

    it('should show splash screen', function () {
      expect($rootScope.showSplash).to.be.true;
    });

    describe('after activate', function () {
      it('should have title of Home', function () {
        expect(controller.title).to.equal('Home');
      });

      it('should have observations', function () {
        expect(controller.observations).to.exist;
      });

      it('should have ideas', function () {
        expect(controller.ideas).to.exist;
      });

    });

    describe('map functions', function () {
      it('should broadcast to show map', function () {
        controller.showObservation();
        expect($rootScope.$broadcast.calledWith('map:show')).to.be.true;
      });
    });

  });

});
