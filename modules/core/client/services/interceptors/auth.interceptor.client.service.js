'use strict';

// 鉴权拦截器，拦截所有错误响应，对401/403错误码进行相应的页面跳转
angular.module('core').factory('authInterceptor', ['$q', '$injector',
    function ($q, $injector) {
        return {
            responseError: function(rejection) {
                if (!rejection.config.ignoreAuthModule) {
                    switch (rejection.status) {
                        // 错误码401：未授权，跳转到登录页面
                        case 401:
                            $injector.get('$state').transitionTo('authentication.signin');
                            break;
                        // 错误码403：禁止访问，跳转到禁止访问页面
                        case 403:
                            $injector.get('$state').transitionTo('forbidden');
                            break;
                    }
                }

                // 对于其他错误，采用默认行为
                return $q.reject(rejection);
            }
        };
    }
]);
