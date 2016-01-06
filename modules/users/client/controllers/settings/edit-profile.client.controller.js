'use strict';

angular.module('users').controller('EditProfileController', ['$scope', '$http', '$location', 'Users', 'Authentication',
    function($scope, $http, $location, Users, Authentication) {
        $scope.user = angular.extend({}, Authentication.user);

        /**
         * 更新用户个人资料
         *
         * @param {boolean} isValid 表单验证是否通过
         */
        $scope.updateUserProfile = function(isValid) {

            if (!isValid) {
                $scope.$broadcast('show-errors-check-validity', 'userForm');
                return false;
            }

            var user = new Users($scope.user);
            user.$update(function(response) {
                $scope.$broadcast('show-errors-reset', 'userForm');
                // 更新成功，显示成功提示信息
                $scope.$broadcast('show-form-alert', {
                    type: 'success',
                    message: 'Profile was successfully updated'
                });
                Authentication.user = response;
            }, function (response) {
                // 更新失败，显示错误提示信息
                $scope.$broadcast('show-form-alert', {
                    type: 'danger',
                    message: response.data.message
                });
            });
        };
    }
]);
