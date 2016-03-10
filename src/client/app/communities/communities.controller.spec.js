/* jshint -W117, -W030 */
describe('CommunitiesController', function () {
  var controller;
  var scope;

  beforeEach(function () {
    bard.appModule('app.communities');
    bard.inject('$controller', '$q');
  });

  beforeEach(function () {
    controller = $controller('CommunitiesController');
  });

  describe('Communities controller', function () {
    it('should be created successfully', function () {
      expect(controller).to.be.defined;
    });

    describe('after activate', function () {
      it('should have title of Communities', function () {
        expect(controller.title).to.be.equal('Communities');
      });
    });
  });

});
