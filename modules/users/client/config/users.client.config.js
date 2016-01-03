'use strict';

// 添加拦截器，拦截401未认证与403未授权错误
angular.module('users').config(['$httpProvider', function($httpProvider) {
    $httpProvider.interceptors.push(['$q', '$location', 'Authentication',
        function($q, $location, Authentication) {
            return {
                responseError: function(rejection) {
                    switch(rejection.status) {
                        case 401:
                            // 当拦截到401未认证错误，清除全局用户信息并跳转到登录页面
                            Authentication.user = null;
                            $location.path('signin');
                            break;
                        case 403:
                            // 当拦截到403未授权错误，跳转到未授权页面
                            $location.path('forbidden');
                            break;
                    }
                    return $q.reject(rejection);
                }
            };
        }
    ]);
}]);
