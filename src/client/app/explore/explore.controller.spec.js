/* jshint -W117, -W030 */
xdescribe('ExploreController', function () {
  var controller;

  beforeEach(function () {
    bard.appModule('app.explore');
    bard.inject('$controller');
  });

  beforeEach(function () {
    controller = $controller('ExploreController');
    $rootScope.$apply();
  });

  bard.verifyNoOutstandingHttpRequests();

  it('should be created successfully', function () {
    expect(controller).to.be.defined;
  });

});
