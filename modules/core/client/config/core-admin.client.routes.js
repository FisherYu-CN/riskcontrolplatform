'use strict';

// core.admin模块路由设置
angular.module('core.admin.routes').config(['$stateProvider',
    function ($stateProvider) {
        $stateProvider
            .state('portal.admin', {
                abstract: true,
                url: '/admin',
                template: '<ui-view/>',
                data: {
                    roles: ['admin']
                }
            });
    }
]);
