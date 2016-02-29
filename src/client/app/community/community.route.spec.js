/* jshint -W117, -W030 */
describe('community routes', function () {
  describe('state', function () {
    var view = 'app/community/community.html';

    beforeEach(function () {
      module('app.community', bard.fakeToastr);
      bard.inject('$httpBackend', '$location', '$rootScope', '$state', '$templateCache');
    });

    beforeEach(function () {
      $templateCache.put(view, '');
    });

    bard.verifyNoOutstandingHttpRequests();

    it('should map state community to url /community ', function () {
      expect($state.href('community', {})).to.equal('/community');
    });

    it('should map /community route to community View template', function () {
      expect($state.get('community').templateUrl).to.equal(view);
    });

    it('of community should work with $state.go', function () {
      $state.go('community');
      $rootScope.$apply();
      expect($state.is('community'));
    });

  });

});
