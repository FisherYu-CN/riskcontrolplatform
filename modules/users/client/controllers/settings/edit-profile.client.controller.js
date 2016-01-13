'use strict';

angular.module('users').controller('EditProfileController', ['$scope', '$http', '$location', '$timeout', '$window', 'Users', 'Authentication', 'FileUploader',
    function($scope, $http, $location, $timeout, $window, Users, Authentication, FileUploader) {

        $scope.user = angular.extend({}, Authentication.user);
        $scope.imageURL = $scope.user.profileImageURL;

        /**
         * 更新用户个人资料
         */
        var updateUserProfile = function() {
            // 复制一个用户对象用以更新，不直接使用scope的用户的原因
            // 是为了能在更新失败后在有必要时可以回退头像状态到更新前
            var userToBeUpdated = angular.extend({}, $scope.user);
            userToBeUpdated.profileImageURL = $scope.imageURL;

            var user = new Users(userToBeUpdated);
            user.$update(function(response) {
                $scope.$broadcast('show-errors-reset', 'userForm');
                // 更新成功，显示成功提示信息
                $scope.$broadcast('show-form-alert', {
                    type: 'success',
                    message: 'Profile was successfully updated'
                });
                // 将更新后的结果反馈回相应对象
                Authentication.user = response;
                $scope.user = response;
                $scope.cancelSelect();
            }, function (response) {
                // 更新失败，显示错误提示信息
                $scope.$broadcast('show-form-alert', {
                    type: 'danger',
                    message: response.data.message
                });
            });
        };

        // 初始化文件上传服务
        $scope.uploader = new FileUploader({
            url: 'api/users/picture'
        });

        // 添加文件类型过滤，仅支持图片类型
        $scope.uploader.filters.push({
            name: 'imageFilter',
            fn: function(item) {
                var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
                return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
            }
        });

        /**
         * 当用户选择了新图片后，调用更新页面图片
         *
         * @param {Object} fileItem 头像文件图片对象
         */
        $scope.uploader.onAfterAddingFile = function(fileItem) {
            if ($window.FileReader) {
                var fileReader = new FileReader();
                fileReader.readAsDataURL(fileItem._file);

                fileReader.onload = function(fileReaderEvent) {
                    $timeout(function () {
                        $scope.imageURL = fileReaderEvent.target.result;
                    }, 0);
                };
            }
        };

        /**
         * 上传成功的回调处理函数
         *
         * @param {Object} fileItem 头像文件图片对象
         * @param {Object} response 上传图片获取的响应对象
         */
        $scope.uploader.onSuccessItem = function(fileItem, response) {
            $scope.imageURL = response;
            updateUserProfile();
        };

        /**
         * 上传失败的回调处理函数
         *
         * @param {Object} fileItem 头像文件图片对象
         * @param {Object} response 上传图片获取的响应对象
         */
        $scope.uploader.onErrorItem = function(fileItem, response) {
            // 清除选择的图片
            $scope.cancelSelect();
            // 更新失败，显示错误提示信息
            $scope.$broadcast('show-form-alert', {
                type: 'danger',
                message: response.data.message
            });
        };

        /**
         * 取消选择新的头像图片
         */
        $scope.cancelSelect = function() {
            $scope.uploader.clearQueue();
            $scope.imageURL = $scope.user.profileImageURL;
        };

        /**
         * 提交用户资料表单以更新用户信息
         *
         * @param {boolean} isValid 表单验证是否通过
         */
        $scope.submitUserForm = function(isValid) {

            if (!isValid) {
                $scope.$broadcast('show-errors-check-validity', 'userForm');
                return false;
            }

            // 只有在用户选择了新的头像图片，并且图片没有被上传时才调用上传方法
            // 可能存在图片已被上传但由于其他原因更新用户资料没有成功，在上述情况下
            // 无需再一次上传图片，而图片URL已经更新为之前上传后获取的URL，因此只需更新用户资料即可
            if ($scope.uploader.queue.length && $scope.uploader.progress === 0) {
                $scope.uploader.uploadAll();
            } else {
                updateUserProfile();
            }
        };
    }
]);
