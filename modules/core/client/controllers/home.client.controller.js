'use strict';

// 主页控制器HomeController
angular.module('core').controller('HomeController', ['$scope', 'Authentication',
    function ($scope, Authentication) {
        // 暴露验证服务给模板页面
        $scope.authentication = Authentication;
    }
]);
