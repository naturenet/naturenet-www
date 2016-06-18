/* jshint -W117, -W030 */
describe('AuthController', function () {
  var controller;

  beforeEach(function () {
    bard.appModule('app.auth');
    bard.inject('$controller', '$q', '$rootScope', 'dataservice');
  });

  beforeEach(function () {
    sinon.spy($rootScope, '$broadcast');
    controller = $controller('AuthController');
    $rootScope.$apply();
  });

  bard.verifyNoOutstandingHttpRequests();

  describe('Auth controller', function () {
    it('should be created successfully', function () {
      expect(controller).to.be.defined;
    });

    it('should have email', function () {
      expect(controller.email).to.exist;
    });

    it('should have password', function () {
      expect(controller.password).to.exist;
    });

    it('should have name', function () {
      expect(controller.name).to.exist;
    });

    it('should start with dialogs hidden', function () {
      expect(controller.mode).to.be.null;
    });

    it('should broadcast to hide authentication form', function () {
      controller.close();
      expect($rootScope.$broadcast.calledWith('auth:hide')).to.be.true;
    });
  });
});
