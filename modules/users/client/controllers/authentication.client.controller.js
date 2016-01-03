'use strict';

angular.module('users').controller('AuthenticationController', ['$scope', '$state', '$http', '$location', '$window', 'Authentication',
    function ($scope, $state, $http, $location, $window, Authentication) {
        // 暴露鉴权服务
        $scope.authentication = Authentication;

        // 获取URL参数中定义的错误信息
        $scope.error = $location.search().err;

        // 如果用户已经登录，重定位到系统主页面
        if ($scope.authentication.user) {
            $location.path('/portal');
        }

        /**
         * 用户注册
         *
         * @param {boolean} isValid 表单验证是否通过
         * @return {boolean} 当表单验证不通过时，返回false，其他情况没有返回结果
         */
        $scope.signup = function(isValid) {
            $scope.error = null;
            // 如果表单验证不通过，广播show-errors-check-validity事件
            if (!isValid) {
                $scope.$broadcast('show-errors-check-validity', 'userForm');
                return false;
            }

            // 调用后台注册服务
            $http
                .post('/api/auth/signup', $scope.credentials)
                .success(function(response) {
                    // 如果注册成功，将返回响应设为全局用户模型
                    $scope.authentication.user = response;
                    // 然后重定向到上一个的页面或者主页面
                    $state.go($state.previous.state.name || 'portal.home', $state.previous.params);
                })
                .error(function(response) {
                    // 如果注册失败，将返回的错误信息显示到前台页面
                    $scope.error = response.message;
                });
        };

        /**
         * 用户登录
         *
         * @param {boolean} isValid 表单验证是否通过
         * @return {boolean} 当表单验证不通过时，返回false，其他情况没有返回结果
         */
        $scope.signin = function(isValid) {
            $scope.error = null;
            // 如果表单验证不通过，广播show-errors-check-validity事件
            if (!isValid) {
                $scope.$broadcast('show-errors-check-validity', 'userForm');
                return false;
            }

            // 调用后台登录服务
            $http
                .post('/api/auth/signin', $scope.credentials)
                .success(function(response) {
                    // 如果注册成功，将返回响应设为全局用户模型
                    $scope.authentication.user = response;
                    // 然后重定向到上一个的页面或者主页面
                    $state.go($state.previous.state.name || 'portal.home', $state.previous.params);
                })
                .error(function (response) {
                    // 如果注册失败，将返回的错误信息显示到前台页面
                    $scope.error = response.message;
                });
        };

        /**
         * 调用OAuth认证服务
         * @param {string} url OAuth认证服务URL地址
         */
        $scope.callOauthProvider = function(url) {
            // 添加认证后重定向的URL
            if ($state.previous && $state.previous.href) {
                url += '?redirect_to=' + encodeURIComponent($state.previous.href);
            }
            // 调用OAuth认证
            $window.location.href = url;
        };
    }
]);
