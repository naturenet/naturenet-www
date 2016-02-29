/* jshint -W117, -W030 */
describe('ideas routes', function () {
  describe('state', function () {
    var view = 'app/ideas/ideas.html';

    beforeEach(function () {
      module('app.ideas', bard.fakeToastr);
      bard.inject('$httpBackend', '$location', '$rootScope', '$state', '$templateCache');
    });

    beforeEach(function () {
      $templateCache.put(view, '');
    });

    bard.verifyNoOutstandingHttpRequests();

    it('should map state ideas to url /ideas ', function () {
      expect($state.href('ideas', {})).to.equal('/ideas');
    });

    it('should map /ideas route to ideas View template', function () {
      expect($state.get('ideas').templateUrl).to.equal(view);
    });

    it('of ideas should work with $state.go', function () {
      $state.go('ideas');
      $rootScope.$apply();
      expect($state.is('ideas'));
    });

  });

});
