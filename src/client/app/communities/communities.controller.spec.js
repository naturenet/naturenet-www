/* jshint -W117, -W030 */
describe('CommunitiesController', function () {
  var controller;
  var scope;

  beforeEach(function () {
    bard.appModule('app.communities');
    bard.inject('$controller', '$q', '$rootScope');
  });

  beforeEach(function () {
    controller = $controller('CommunitiesController');
  });

  describe('Communities controller', function () {
    it('should be created successfully', function () {
      expect(controller).to.be.defined;
    });

    it('should show splash screen', function () {
      expect($rootScope.showSplash).to.be.true;
    });

    describe('after activate', function () {
      it('should have title of Communities', function () {
        expect(controller.title).to.be.equal('Communities');
      });

      it('should have users', function () {
        expect(controller.users).to.exist;
      });

      it('should have groups', function () {
        expect(controller.groups).to.exist;
      });

      it('should have userObservations', function () {
        expect(controller.userObservations).to.exist;
      });

      it('should have userGroups', function () {
        expect(controller.userGroups).to.exist;
      });

    });
  });

});
