/* jshint -W117, -W030 */
describe('ExploreController', function () {
  var controller;
  var scope;

  beforeEach(function () {
    bard.appModule('app.explore');
    bard.inject('$controller', '$q', '$rootScope');
  });

  beforeEach(function () {
    scope = $rootScope.$new();
    controller = $controller('ExploreController', {
      $scope: scope,
    });
  });

  describe('Explore controller', function () {
    it('should be created successfully', function () {
      expect(controller).to.be.defined;
    });

    describe('after activate', function () {
      it('should have title of Explore', function () {
        expect(controller.title).to.be.equal('Explore');
      });

      it('should have a map', function () {
        expect(controller.map).to.be.defined;
      });

      it('map view should be hidden', function () {
        expect(scope.$parent.hasMap).to.be.false;
      });

      it('sidebar should be hidden', function () {
        expect(controller.hasSidebar).to.be.false;
      });
    });

    describe('map functions', function () {
      it('should toggle the map view', function () {
        controller.toggleMap();
        expect(scope.$parent.hasMap).to.be.true;
      });
    });

    describe('sidebar functions', function () {
      it('should show the sidebar', function () {
        controller.showSidebar();
        expect(controller.hasSidebar).to.be.true;
      });

      it('should hide the sidebar', function () {
        controller.hideSidebar();
        expect(controller.hasSidebar).to.be.false;
      });
    });
  });

});
