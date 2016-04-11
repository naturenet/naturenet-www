/* jshint -W117, -W030 */
describe('ProjectsController', function () {
  var controller;
  var scope;

  beforeEach(function () {
    bard.appModule('app.projects');
    bard.inject('$controller', '$q');
  });

  beforeEach(function () {
    controller = $controller('ProjectsController');
  });

  describe('Projects controller', function () {
    it('should be created successfully', function () {
      expect(controller).to.be.defined;
    });

    describe('after activate', function () {
      it('should have title of Projects', function () {
        expect(controller.title).to.be.equal('Projects');
      });

      it('should have projects', function () {
        expect(controller.projects).to.exist;
      });

      it('should have projectObservations', function () {
        expect(controller.projectObservations).to.exist;
      });
    });
  });

});
