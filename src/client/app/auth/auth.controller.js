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
    'cloudinary',
    'logger',
    'dataservice',
  ];

  /* @ngInject */
  function AuthController(
    $q,
    $rootScope,
    $filter,
    cloudinary,
    logger,
    dataservice
  ) {
    var vm = this;

    /* Variables
       ================================================== */

    // Data
    vm.userUid = void 0;
    vm.newUserObject = void 0;
    vm.avatarFile = void 0;
    vm.avatar = null;
    vm.email = '';
    vm.password = '';
    vm.name = '';
    vm.realname = '';
    vm.bio = '',
    vm.affiliation = '';
    vm.membership = {};

    // Demographics
    vm.ageOptions = [
      '8-14',
      '15-17',
      '18-24',
      '25-44',
      '45-64',
      '65+',
      'Prefer not to disclose',
    ];
    vm.genderOptions = [
      'Male',
      'Female',
      'Other',
      'Prefer not to disclose',
    ];
    vm.raceOptions = [
      'Black or African American',
      'American Indian or Alaskan Native',
      'Asian',
      'Native Hawaiian or Other Pacific Islander',
      'White',
      'Some other race',
    ];
    vm.age = '';
    vm.gender = '';
    vm.race = {};

    // States
    vm.mode = null;

    // Function assignments
    vm.login = login;
    vm.apply = apply;
    vm.close = close;
    vm.reset = reset;

    activate();

    /* Activate function
       ================================================== */

    function activate() {
      var promises = [getSites(), getGroups()];
      return $q.all(promises)
        .then(function () {
          onAuth();
          logger.info('Authentication Ready');
        });
    }

    /* Data functions
       ================================================== */

    function onAuth() {
      return dataservice.onAuthStateChanged(function (user) {
          if (!!user) {
            vm.userUid = user.uid;
            $rootScope.$broadcast('auth:success', vm.userUid);
            return vm.userUid;
          }
        });
    }

    function createUser() {
      var profile = {
        display_name: vm.name,
        name: vm.realname,
        bio: vm.bio,
        email: vm.email,
        affiliation: vm.affiliation.$id,
      };
      return dataservice.createUser(vm.email, vm.password)
        .then(function (data) {
          vm.userUid = data.uid;
          profile.uid = data.uid;
          authWithPassword(vm.email, vm.password)
            .then(function () {
              return addUser(profile);
            });
        });
    }

    function updateUser() {
      setAvatar().then(function () {
        console.log('updating profile');
        var profile = {
          avatar: vm.avatar,
          display_name: vm.name,
          name: vm.realname,
          bio: vm.bio,
          affiliation: vm.affiliation.$id,
          groups: vm.membership,
          uid: vm.userUid,
          demographics: {
            age: vm.age || null,
            gender: vm.gender || null,
            race: vm.race || null,
          },
        };

        return dataservice.updateUser(profile)
          .then(function (data) {
            logger.success('Your profile has been updated!');
            close();
            return vm.userUid;
          });
      });

    }

    function setAvatar() {
      var p = $q.when(null);
      if (!!vm.avatarFile) {
        console.log('uploading avatar');
        p = cloudinary.upload(vm.avatarFile, {
          upload_preset: 'avatar-preset',
        }).then(function (resp) {
          console.log('avatar uploaded');
          vm.avatar = resp.data.secure_url;
        }).catch(function (resp) {
          logger.error('The image you selected could not be uploaded.');
          vm.avatarFile = null;
        });
      }

      return p;
    }

    function authWithPassword(email, password) {
      return dataservice.authWithPassword(email, password)
        .then(function (data) {
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
          vm.sites = data;
        });
    }

    function getGroups() {
      return dataservice.getArray('groups')
        .then(function (data) {
          vm.groups = data;
        });
    }

    function loadUserData() {
      var auth = dataservice.getAuth();
      if (!!auth) {
        dataservice.getActiveUserDetails()
          .then(function (data) {
            var publicData = data[0];
            var privateData = data[1];
            vm.avatar = publicData.avatar || null;
            vm.name = publicData.display_name;
            vm.realname = privateData.name;
            vm.affiliation = vm.sites.$getRecord(publicData.affiliation);
            vm.bio = publicData.bio || '';
            vm.membership = publicData.groups || {};
            var demos = privateData.demographics || {};
            vm.age = demos.age || '';
            vm.gender = demos.gender || '';
            vm.race = demos.race || {};
          });
      } else {
        logger.warning('User is not logged in! Nothing to update.');
      }
    }

    /* Listener Functions
       ================================================== */

    $rootScope.$on('account:edit', showAccountUpdate);
    $rootScope.$on('register:show', showRegister);
    $rootScope.$on('signin:show', showSignin);
    $rootScope.$on('auth:hide', resetForm);
    $rootScope.$on('signout', unAuth);

    function showAccountUpdate() {
      vm.mode = 'update';
      loadUserData();
    }

    function showRegister() {
      vm.mode = 'register';
    }

    function showSignin() {
      vm.mode = 'signin';
    }

    /* Click functions
       ================================================== */

    function close() {
      $rootScope.$broadcast('auth:hide');

      resetForm();
    }

    function login(email, password) {
      if (checkValidity()) {
        authWithPassword(email, password);
      }
    }

    function apply() {
      if (checkValidity()) {
        if (vm.mode === 'update') {
          updateUser();
        } else {
          createUser();
        }
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

    function checkValidity() {
      if (vm.email.length === 0 && vm.mode !== 'update') {
        logger.error('No email address was entered.');
        return false;
      } else if (vm.password.length === 0 && vm.mode !== 'update') {
        logger.error('No password was entered.');
        return false;
      } else if (vm.name.length === 0 && vm.mode !== 'signin') {
        logger.error('No username was entered.');
        return false;
      } else if (vm.realname.length === 0 && vm.mode !== 'signin') {
        logger.error('No name was entered.');
        return false;
      } else if (vm.affiliation.length === 0 && vm.mode !== 'signin') {
        logger.error('No affiliation was entered.');
        return false;
      } else {
        return true;
      }
    }

    function resetForm() {
      vm.mode = null;
      vm.avatarFile = null;
      vm.avatar = null;
      vm.email = '';
      vm.password = '';
      vm.name = '';
      vm.realname = '';
      vm.bio = '';
      vm.affiliation = '';
      vm.membership = {};
      vm.age = '';
      vm.gender = '';
      vm.race = {};
    }

  }
})();
