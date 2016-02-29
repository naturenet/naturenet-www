/* jshint -W079 */
var mockData = (function () {
  return {
    getMockPeople: getMockPeople,
    getMockStates: getMockStates,
  };

  function getMockStates() {
    return [
      {
        state: 'home',
        config: {
          url: '/',
          templateUrl: 'app/home/home.html',
          title: 'Home',
          settings: {
            nav: 1,
            content: 'Home',
          },
        },
      },
    ];
  }

  function getMockPeople() {
    return [
      { firstName: 'John', lastName: 'Papa', age: 25, location: 'Florida', },
      { firstName: 'Ward', lastName: 'Bell', age: 31, location: 'California', },
      { firstName: 'Colleen', lastName: 'Jones', age: 21, location: 'New York', },
      { firstName: 'Madelyn', lastName: 'Green', age: 18, location: 'North Dakota', },
      { firstName: 'Ella', lastName: 'Jobs', age: 18, location: 'South Dakota', },
      { firstName: 'Landon', lastName: 'Gates', age: 11, location: 'South Carolina', },
      { firstName: 'Haley', lastName: 'Guthrie', age: 35, location: 'Wyoming', },
    ];
  }
})();
