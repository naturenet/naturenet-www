(function () {
  'use strict';

  angular
    .module('app.auth')
    .controller('AuthController', AuthController);

  /* Auth controller
      ======================================================================== */

  AuthController.$inject = [
    '$q',
    '$rootScope',
    'logger',
    'dataservice',
  ];

  /* @ngInject */
  function AuthController(
    $q,
    $rootScope,
    logger,
    dataservice
  ) {
    var vm = this;

    /* Variables
       ================================================== */

    // Data
    vm.userUid = void 0;
    vm.newUserObject = void 0;
    vm.email = '';
    vm.password = '';
    vm.name = '';

    // States
    vm.isRegister = false;
    vm.isSignin = false;

    // Function assignments
    vm.login = login;
    vm.join = join;
    vm.close = close;

    activate();

    /* Activate function
       ================================================== */

    function activate() {
      var promises = [onAuth()];
      return $q.all(promises)
        .then(function () {
          logger.info('Authentication Ready');
        });
    }

    /* Data functions
       ================================================== */

    function onAuth() {
      return dataservice.onAuth()
        .then(function (data) {
          if (!!data) {
            vm.userUid = data.uid;
            $rootScope.$broadcast('auth:success', vm.userUid);
            return vm.userUid;
          } else {
            return;
          }
        });
    }

    function createUser(email, password) {
      return dataservice.createUser({
        email: email,
        password: password,
      }).then(function (data) {
        vm.userUid = data.uid;
        authWithPassword(vm.email, vm.password)
          .then(function () {
            return addUser(vm.userUid, vm.email, vm.name);
          });
      });
    }

    function authWithPassword(email, password) {
      return dataservice.authWithPassword({
        email: email,
        password: password,
      }).then(function (data) {
        vm.userUid = data.uid;

        $rootScope.$broadcast('auth:success', vm.userUid);
        close();

        logger.success('You are now logged in!');
        return vm.userUid;
      });
    }

    function addUser(uid, email, name) {
      return dataservice.addUser(uid, email, name)
        .then(function (data) {
          logger.success('Welcome to NatureNet!');
          return data;
        });
    }

    /* Listener Functions
       ================================================== */

    $rootScope.$on('register:show', showRegister);
    $rootScope.$on('signin:show', showSignin);
    $rootScope.$on('auth:hide', resetForm);

    function showRegister() {
      vm.isRegister = true;
      vm.isSignin = false;
    }

    function showSignin() {
      vm.isRegister = false;
      vm.isSignin = true;
    }

    /* Click functions
       ================================================== */

    function close() {
      $rootScope.$broadcast('auth:hide');

      resetForm();
    }

    function login(email, password) {
      if (checkValidity('login')) {
        authWithPassword(email, password);
      }
    }

    function join(email, password) {
      if (checkValidity('join')) {
        createUser(email, password);
      }
    }

    /* Utility functions
       ================================================== */

    function checkValidity(type) {
      if (vm.email.length === 0) {
        logger.error('No email address was entered.');
        return false;
      } else if (vm.password.length === 0) {
        logger.error('No password was entered.');
        return false;
      } else if (vm.name.length === 0 && type === 'join') {
        logger.error('No username was entered.');
        return false;
      } else return true;
    }

    function resetForm() {
      vm.isRegister = false;
      vm.isSignin = false;

      vm.email = '';
      vm.password = '';
      vm.name = '';
    }

  }
})();
