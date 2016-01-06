'use strict';

angular.module('users').directive('mobilePhoneNumber', function() {
    return {
        require: 'ngModel',
        link: function(scope, elem, attr, ngModel) {

            // 匹配中国地区电话号码的正则表达式
            var regex = /^(\+?0?86\-?)?1[345789]\d{9}$/;

            // DOM到Model的验证
            ngModel.$parsers.unshift(function(value) {
                var valid = regex.test(value);
                ngModel.$setValidity('mobile', valid);
                return valid ? value : undefined;
            });

            // Model到DOM的验证
            ngModel.$formatters.unshift(function(value) {
                var valid = regex.test(value);
                ngModel.$setValidity('mobile', valid);
                return value;
            });
        }
    };
});
