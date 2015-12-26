'use strict';

angular.module('core')
    .directive('breadcrumb', ['$state', 'Menus', function($state, Menus) {
        var linkFn = function (scope) {
            // 获取breadcrumb菜单项
            scope.breadcrumbMenuItems = Menus.findBreadcrumbMenuItemsByState('sidebar', $state.current.name);

            // 获取当前菜单项的标题
            if (scope.breadcrumbMenuItems.length > 0) {
                scope.breadcrumbTitle = scope.breadcrumbMenuItems[scope.breadcrumbMenuItems.length - 1].title;
            } else {
                scope.breadcrumbTitle = '';
            }
        };

        return {
            restrict: 'A',
            templateUrl: 'modules/core/client/views/breadcrumb.client.view.html',
            link: linkFn
        };
    }]);