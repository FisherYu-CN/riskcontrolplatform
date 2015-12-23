'use strict';

(function () {
    describe('HeaderController', function () {
        // 初始化全局变量
        var scope,
            HeaderController,
            $state,
            Authentication;

        // 加载主应用模块
        beforeEach(module(ApplicationConfiguration.applicationModuleName));

        // 注入Angular服务并创建一个HeaderController
        beforeEach(inject(function($controller, $rootScope, _$state_, _Authentication_) {
            scope = $rootScope.$new();
            $state = _$state_;
            Authentication = _Authentication_;

            HeaderController = $controller('HeaderController', {
                $scope: scope
            });
        }));

        // 鉴权服务应该被暴露在HeaderController中
        it('should expose the authentication service', function() {
            expect(scope.authentication).toBe(Authentication);
        });

        // $state服务应该被暴露在HeaderController中
        it('should expose the $state service', function() {
            expect(scope.$state).toBe($state);
        });
    });
})();
