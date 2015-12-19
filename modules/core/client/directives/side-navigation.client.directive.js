'use strict';

angular.module('core')
    .directive('sideNavigation', ['$timeout', function($timeout) {
        var linkFn = function (scope, el) {
            // 对sideNavigation指令标记的元素初始化metisMenu插件
            $timeout(function(){
                el.metisMenu();
            });
        };

        return {
            restrict: 'A',
            link: linkFn
        };
    }]);