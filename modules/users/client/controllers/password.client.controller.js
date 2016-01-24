'use strict';

angular.module('users').controller('PasswordController', ['$scope', '$stateParams', '$http', '$state', 'Authentication',
  function ($scope, $stateParams, $http, $state, Authentication) {

      $scope.authentication = Authentication;

      /**
       * 请求重置密码
       */
      $scope.askForPasswordReset = function() {

          $http.post('/api/auth/forgot', $scope.credentials)
              .success(function(response) {
                  // 更新成功，显示成功提示信息
                  $scope.$broadcast('show-form-alert', {
                      type: 'info',
                      message: response.message
                  });
              })
              .error(function (response) {
                  // 更新失败，显示错误提示信息
                  $scope.$broadcast('show-form-alert', {
                      type: 'danger',
                      message: response.message
                  });
              });
      };

      /**
       * 重置用户密码
       */
      $scope.resetUserPassword = function(isValid) {

          if (!isValid) {
              $scope.$broadcast('show-errors-check-validity', 'passwordForm');
              return false;
          }

          $http.post('/api/auth/reset/' + $stateParams.token, $scope.passwordDetails)
              .success(function(response) {
                  $scope.passwordDetails = null;
                  Authentication.user = response;
                  // 更新失败，跳转到成功修改密码提示页面
                  $state.go('password.reset.success');
              })
              .error(function(response) {
                  // 更新失败，显示错误提示信息
                  $scope.$broadcast('show-form-alert', {
                      type: 'danger',
                      message: response.message
                  });
              });
      };
  }
]);
