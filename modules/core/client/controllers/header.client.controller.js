'use strict';

// 标题栏控制器HeaderController
angular.module('core').controller('HeaderController', ['$scope', '$state', 'Authentication', 'Menus',
    function ($scope, $state, Authentication, Menus) {
        // 暴露服务给模板页面
        $scope.$state = $state;
        $scope.authentication = Authentication;

        // 获取标题栏菜单
        $scope.menu = Menus.getMenu('sidebar');

    }
]);
