/* jshint -W117, -W030 */
describe('ShellController', function () {
  var controller;

  beforeEach(function () {
    bard.appModule('app.layout');
    bard.inject('$controller', '$q', '$rootScope', '$timeout', 'dataservice');
  });

  beforeEach(function () {
    sinon.spy($rootScope, '$broadcast');
    controller = $controller('ShellController');
    $rootScope.$apply();
  });

  bard.verifyNoOutstandingHttpRequests();

  describe('Shell controller', function () {
    it('should be created successfully', function () {
      expect(controller).to.be.defined;
    });

    it('should show splash screen', function () {
      expect($rootScope.showSplash).to.be.true;
    });

    it('should start with authentication form hidden', function () {
      expect(controller.isAuth).to.be.false;
    });

    describe('Auth functions', function () {
      it('should hide authentication form', function () {
        controller.hideAuth();
        expect(controller.isAuth).to.be.false;
      });

      it('should broadcast to hide authentication form', function () {
        controller.broadcastHideAuth();
        expect($rootScope.$broadcast.calledWith('auth:hide')).to.be.true;
      });
    });
  });
});
