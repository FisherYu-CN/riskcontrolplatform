'use strict';

(function () {
    describe('HomeController', function () {
        // 初始化全局变量
        var scope,
            HomeController,
            Authentication;

        // 加载主应用模块
        beforeEach(module(ApplicationConfiguration.applicationModuleName));

        // 注入Angular服务并创建一个HomeController
        beforeEach(inject(function($controller, $rootScope, _Authentication_) {
            scope = $rootScope.$new();
            Authentication = _Authentication_;

            HomeController = $controller('HomeController', {
                $scope: scope
            });
        }));

        // 鉴权服务应该被暴露在HomeController中
        it('should expose the authentication service', function() {
            expect(scope.authentication).toBe(Authentication);
        });
    });
})();
