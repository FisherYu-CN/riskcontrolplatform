'use strict';

angular.module('users').controller('ChangePasswordController', ['$scope', '$http', 'Authentication',
    function ($scope, $http, Authentication) {

        $scope.user = Authentication.user;

        /**
         * 忘记密码时，发送重置密码邮件到注册邮箱
         */
        $scope.forgotPassword = function() {

            $http.post('/api/auth/forgot', $scope.user)
                .success(function(response) {
                    // 提交重置密码请求成功，显示成功提示信息
                    $scope.$broadcast('show-form-alert', {
                        type: 'info',
                        message: response.message
                    });
                })
                .error(function(response) {
                    // 提交重置密码请求失败，显示错误提示信息
                    $scope.$broadcast('show-form-alert', {
                        type: 'danger',
                        message: response.message
                    });
                });
        };

        /**
         * 修改用户密码
         *
         * @param {boolean} isValid 表单验证是否通过
         */
        $scope.changeUserPassword = function(isValid) {

            if (!isValid) {
                $scope.$broadcast('show-errors-check-validity', 'passwordForm');
                return false;
            }

            $http.post('/api/users/password', $scope.passwordDetails)
                .success(function(response) {
                    $scope.$broadcast('show-errors-reset', 'passwordForm');
                    // 更新成功，显示成功提示信息
                    $scope.$broadcast('show-form-alert', {
                        type: 'success',
                        message: response.message
                    });
                    $scope.passwordDetails = null;
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
