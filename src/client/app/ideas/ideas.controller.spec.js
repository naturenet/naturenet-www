/* jshint -W117, -W030 */
describe('IdeasController', function () {
  var controller;
  var scope;

  beforeEach(function () {
    bard.appModule('app.ideas');
    bard.inject('$controller', '$q');
  });

  beforeEach(function () {
    controller = $controller('IdeasController');
  });

  describe('Ideas controller', function () {
    it('should be created successfully', function () {
      expect(controller).to.be.defined;
    });

    describe('after activate', function () {
      it('should have title of Design Ideas', function () {
        expect(controller.title).to.be.equal('Design Ideas');
      });
    });
  });

});
