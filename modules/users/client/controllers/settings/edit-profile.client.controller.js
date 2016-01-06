'use strict';

angular.module('users').controller('EditProfileController', ['$scope', '$http', '$location', 'Users', 'Authentication',
    function($scope, $http, $location, Users, Authentication) {
        $scope.user = angular.extend({}, Authentication.user);

        /**
         * 重置
         */
        $scope.reset = function() {
            $scope.success = false;
            $scope.error = null;
        };

        // Update a user profile
        $scope.updateUserProfile = function(isValid) {

            $scope.reset();

            if (!isValid) {
                $scope.$broadcast('show-errors-check-validity', 'userForm');
                return false;
            }

            var user = new Users($scope.user);
            user.$update(function(response) {
                $scope.$broadcast('show-errors-reset', 'userForm');
                $scope.success = true;
                Authentication.user = response;
            }, function (response) {
                $scope.error = response.data.message;
            });
        };
    }
]);
