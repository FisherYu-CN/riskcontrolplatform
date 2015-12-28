'use strict';

// 主控制器MainController
angular.module('core').controller('MainController', ['$scope', '$state',
    function ($scope, $state) {
        // 暴露服务给模板页面
        $scope.$state = $state;
    }
]);
