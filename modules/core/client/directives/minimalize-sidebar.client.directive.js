'use strict';

angular.module('core')
    .directive('minimalizeSidebar', ['$timeout', function($timeout) {
        var linkFn = function (scope) {
            scope.minimalize = function() {
                // 切换侧边菜单栏状态
                $('body').toggleClass('mini-navbar');
                // 取消最小化侧边栏菜单时，先隐藏侧边栏菜单
                // 这样可以使得最大化菜单时显示效果更加平滑
                if (!$('body').hasClass('mini-navbar') || $('body').hasClass('body-small')) {
                    $('#side-menu').hide();
                    $timeout(
                        function () {
                            $('#side-menu').fadeIn(500);
                        }, 100);
                } else {
                    // 删除所有jquery的fadeIn函数所添加的内联样式来重置菜单状态
                    $('#side-menu').removeAttr('style');
                }
            };
        };

        return {
            restrict: 'A',
            template: '<a class="navbar-minimalize minimalize-style-2 btn btn-primary" ng-click="minimalize()"><i class="fa fa-bars"></i></a>',
            link: linkFn
        };
    }]);
