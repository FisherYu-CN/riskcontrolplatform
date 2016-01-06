'use strict';

angular.module('core')
    .directive('formAlert', function() {

        var linkFn = function(scope) {

            // 初始化表单提示对象
            scope.formAlert = {
                display: false,
                type: '',
                message: ''
            };

            // 监听显示表单提示信息事件，更新提示对象
            scope.$on('show-form-alert', function(event, data) {
                scope.formAlert.display = true;
                scope.formAlert.type = data.type;
                scope.formAlert.message = data.message;
            });

            // 关闭表单提示栏
            scope.closeFormAlert = function() {
                scope.formAlert.display = false;
            };
        };

        return {
            restrict: 'A',
            template: '<alert ng-show="formAlert.display" type="{{formAlert.type}}" close="closeFormAlert()">{{formAlert.message}}</alert>',
            link: linkFn
        };
    });