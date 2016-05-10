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
    '$filter',
    'logger',
    'dataservice',
  ];

  /* @ngInject */
  function AuthController(
    $q,
    $rootScope,
    $filter,
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
    vm.realname = '';
    vm.affiliation = '';

    // States
    vm.isRegister = false;
    vm.isSignin = false;

    // Function assignments
    vm.login = login;
    vm.join = join;
    vm.close = close;
    vm.reset = reset;

    activate();

    /* Activate function
       ================================================== */

    function activate() {
      var promises = [onAuth(), getSites()];
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
            $rootScope.$broadcast('signout');
            logger.success('You are now logged out.');
            return;
          }
        });
    }

    function createUser(email, password) {
      var profile = {
        display_name: vm.name,
        name: vm.realname,
        email: vm.email,
        affiliation: vm.affiliation,
      };
      return dataservice.createUser({
        email: email,
        password: password,
      }).then(function (data) {
        vm.userUid = data.uid;
        profile.uid = data.uid;
        authWithPassword(vm.email, vm.password)
          .then(function () {
            return addUser(profile);
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

    function unAuth() {
      return dataservice.unAuth();
    }

    function addUser(profile) {
      return dataservice.addUser(profile)
        .then(function (data) {
          logger.success('Welcome to NatureNet!');
          return data;
        });
    }

    function getSites() {
      return dataservice.getArray('sites')
        .then(function (data) {
          vm.sites = $filter('orderBy')(data, 'name');
        });
    }

    /* Listener Functions
       ================================================== */

    $rootScope.$on('register:show', showRegister);
    $rootScope.$on('signin:show', showSignin);
    $rootScope.$on('auth:hide', resetForm);
    $rootScope.$on('signout', unAuth);

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

    function reset() {
      if (vm.email.length === 0) {
        logger.error('No email address was entered.');
        return false;
      }

      return dataservice.resetPassword(vm.email)
        .then(function (data) {
          logger.success('Please check the provided email address for instructions.');
        });
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
      } else if (vm.realname.length === 0 && type === 'join') {
        logger.error('No name was entered.');
        return false;
      } else if (vm.affiliation.length === 0 && type === 'join') {
        logger.error('No affiliation was entered.');
        return false;
      } else {
        return true;
      }
    }

    function resetForm() {
      vm.isRegister = false;
      vm.isSignin = false;

      vm.email = '';
      vm.password = '';
      vm.name = '';
      vm.realname = '';
      vm.affiliation = '';
    }

  }
})();
