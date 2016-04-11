/* jshint -W117, -W030 */
xdescribe('HeaderController', function () {
  var controller;

  beforeEach(function () {
    bard.appModule('app.layout');
    bard.inject('$controller', '$location', '$rootScope', '$state', 'routerHelper');
  });

  beforeEach(function () {
    routerHelper.configureStates(mockData.getMockStates(), '/');
    controller = $controller('HeaderController');
    $rootScope.$apply();
  });

  bard.verifyNoOutstandingHttpRequests();

  describe('Header controller', function () {
    it('should be created successfully', function () {
      expect(controller).to.be.defined;
    });

    it('should have isCurrent() for / to return `is-current`', function () {
      $location.path('/');
      expect(controller.isCurrent($state.current)).to.equal('is-current');
    });

    it('should have isCurrent() for non route not return `is-current`', function () {
      $location.path('/invalid');
      expect(controller.isCurrent({ title: 'invalid' })).not.to.equal('is-current');
    });

    describe('states', function () {
      it('starts with map inactive', function () {
        expect(controller.isMapActive).to.be.false;
      });

      it('starts unauthenticated', function () {
        expect(controller.isAuthenticated).to.be.false;
      });
    });
  });
});
