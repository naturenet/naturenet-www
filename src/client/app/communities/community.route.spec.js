/* jshint -W117, -W030 */
describe('Communities routes', function () {
  describe('state', function () {
    var view = 'app/communities/communities.html';

    beforeEach(function () {
      module('app.communities', bard.fakeToastr);
      bard.inject('$httpBackend', '$location', '$rootScope', '$state', '$templateCache');
    });

    beforeEach(function () {
      $templateCache.put(view, '');
    });

    bard.verifyNoOutstandingHttpRequests();

    it('should map state communities to url /communities ', function () {
      expect($state.href('communities', {})).to.equal('/communities');
    });

    it('should map /communities route to communities View template', function () {
      expect($state.get('communities').templateUrl).to.equal(view);
    });

    it('of communities should work with $state.go', function () {
      $state.go('communities');
      $rootScope.$apply();
      expect($state.is('communities'));
    });

  });

});
