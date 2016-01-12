'use strict';

angular.module('users').controller('EditProfileController', ['$scope', '$http', '$location', '$timeout', '$window', 'Users', 'Authentication', 'FileUploader',
    function($scope, $http, $location, $timeout, $window, Users, Authentication, FileUploader) {

        $scope.user = angular.extend({}, Authentication.user);
        $scope.imageURL = $scope.user.profileImageURL;

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
            $scope.user.profileImageURL = response.profileImageURL;
            $scope.cancelUpload();
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
         * 更新用户个人资料
         *
         * @param {boolean} isValid 表单验证是否通过
         */
        $scope.updateUserProfile = function(isValid) {

            if (!isValid) {
                $scope.$broadcast('show-errors-check-validity', 'userForm');
                return false;
            }

            // 用户选择了新的头像图片
            if ($scope.uploader.queue.length) {
                $scope.uploader.uploadAll();
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
