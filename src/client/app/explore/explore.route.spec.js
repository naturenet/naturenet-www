/* jshint -W117, -W030 */
describe('explore routes', function () {
  describe('state', function () {
    var view = 'app/explore/explore.html';

    beforeEach(function () {
      module('app.explore', bard.fakeToastr);
      bard.inject('$httpBackend', '$location', '$rootScope', '$state', '$templateCache');
    });

    beforeEach(function () {
      $templateCache.put(view, '');
    });

    bard.verifyNoOutstandingHttpRequests();

    it('should explore state explore to url /explore ', function () {
      expect($state.href('explore', {})).to.equal('/explore');
    });

    it('should explore /explore route to explore View template', function () {
      expect($state.get('explore').templateUrl).to.equal(view);
    });

    it('of explore should work with $state.go', function () {
      $state.go('explore');
      $rootScope.$apply();
      expect($state.is('explore'));
    });

  });

});
