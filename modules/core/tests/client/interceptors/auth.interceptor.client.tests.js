'use strict';

(function() {
    describe('AuthInterceptor', function() {
        // 初始化全局变量
        var AuthInterceptor,
            $q,
            $state,
            httpProvider;

        // 加载主应用模块
        beforeEach(module(ApplicationConfiguration.applicationModuleName));

        // 加载httpProvider
        beforeEach(module(function($httpProvider) {
            httpProvider = $httpProvider;
        }));

        // 注入Angular服务
        beforeEach(inject(function(_AuthInterceptor_, _$q_, _$state_) {
            AuthInterceptor = _AuthInterceptor_;
            $q = _$q_;
            $state = _$state_;
            spyOn($q, 'reject');
            spyOn($state, 'transitionTo');
        }));

        // 鉴权拦截器应该是对象类型
        it('Auth Interceptor should be object', function() {
            expect(typeof AuthInterceptor).toEqual('object');
        });

        // 鉴权拦截器应该包含responseError函数
        it('Auth Interceptor should contain responseError function', function() {
            expect(typeof AuthInterceptor.responseError).toEqual('function');
        });

        // 鉴权拦截器应该被加入到httpProvider的拦截器数组当中
        it('httpProvider Interceptor should have AuthInterceptor', function() {
            expect(httpProvider.interceptors).toContain('AuthInterceptor');
        });

        // 鉴权拦截器处理403禁止访问错误，应该跳转到403错误页面
        describe('Forbidden Interceptor', function() {
            it('should redirect to forbidden route', function () {
                var response = {
                    status: 403,
                    config: {}
                };
                var promise = AuthInterceptor.responseError(response);
                expect($q.reject).toHaveBeenCalled();
                expect($state.transitionTo).toHaveBeenCalledWith('forbidden');
            });
        });

        // 鉴权拦截器处理401未授权错误，应该跳转到登录页面
        describe('Authorization Interceptor', function() {
            it('should redirect to signIn page for unauthorized access', function () {
                var response = {
                    status: 401,
                    config: {}
                };
                var promise = AuthInterceptor.responseError(response);
                expect($q.reject).toHaveBeenCalled();
                expect($state.transitionTo).toHaveBeenCalledWith('signin');
            });
        });
    });
})();
