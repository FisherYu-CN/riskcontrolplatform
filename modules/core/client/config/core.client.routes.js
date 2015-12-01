'use strict';

// core模块的路由设置
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
    function ($stateProvider, $urlRouterProvider) {

    // 当遇到未定义的路由时，重定向到404资源无法找到页面
    $urlRouterProvider.otherwise(function ($injector) {
        // 使用被重定向到资源无法找到页面时，不更改地址栏中的URL
        $injector.get('$state').transitionTo('not-found', null, {
            location: false
        });
    });

    // 主页路由定义
    $stateProvider
        .state('home', {
            url: '/',
            templateUrl: 'modules/core/client/views/home.client.view.html'
        })
        .state('not-found', {
            url: '/not-found',
            templateUrl: 'modules/core/client/views/404.client.view.html',
            data: {
                ignoreState: true
            }
        })
        .state('bad-request', {
            url: '/bad-request',
            templateUrl: 'modules/core/client/views/400.client.view.html',
            data: {
                ignoreState: true
            }
        })
        .state('forbidden', {
            url: '/forbidden',
            templateUrl: 'modules/core/client/views/403.client.view.html',
            data: {
                ignoreState: true
            }
        });
    }
]);
