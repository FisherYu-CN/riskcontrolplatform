'use strict';

angular.module('core')
    .directive('breadcrumb', ['$state', function($state) {
        var linkFn = function (scope) {
            scope.title = $state.current.name;
        };

        return {
            restrict: 'A',
            templateUrl: 'modules/core/client/views/breadcrumb.client.view.html',
            link: linkFn
        };
    }]);