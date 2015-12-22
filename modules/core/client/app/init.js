'use strict';

// 定义全局Angular主模块与依赖
angular.module(
    ApplicationConfiguration.applicationModuleName,
    ApplicationConfiguration.applicationModuleVendorDependencies
);

// 更改应用主模块的基础配置
angular.module(ApplicationConfiguration.applicationModuleName)
    .config(['$locationProvider', '$httpProvider', function ($locationProvider, $httpProvider) {
        // 启用HTML5模型的路由，改变Angular默认在URL中添加#的行为，并将hash的前缀改为!
        $locationProvider.html5Mode(true).hashPrefix('!');
        // 添加验证拦截器
        $httpProvider.interceptors.push('AuthInterceptor');
    }]);

// 运行应用主模块预处理函数
angular.module(ApplicationConfiguration.applicationModuleName)
    .run(function ($rootScope, $state, Authentication) {
        // 监听状态变更开始事件，检查用户是否有足够权限
        $rootScope.$on('$stateChangeStart', function (event, toState) {
            // 当变更后的状态需要用户具备某些角色
            if (toState.data && toState.data.roles && toState.data.roles.length > 0) {
                var allowed = false;
                // 角色列表中用户只需要符合一项即可
                toState.data.roles.forEach(function (role) {
                    if (Authentication.user.roles !== undefined && Authentication.user.roles.indexOf(role) !== -1) {
                        allowed = true;
                        return true;
                    }
                });

                // 如果用户没有相应角色，则取消默认的跳转行为
                if (!allowed) {
                    event.preventDefault();
                    if (Authentication.user !== undefined  && typeof Authentication.user === 'object') {
                        // 对已登录用户，跳转到禁止查看页面
                        $state.go('forbidden');
                    }
                    else {
                        // 对未登录用户，跳转到登录页面
                        $state.go('authentication.signin');
                    }
                }
            }
        });

        // 监听状态改变成功事件，记录之前的状态信息（状态/参数/URL）
        $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
            if (!fromState.data || !fromState.data.ignoreState) {
                $state.previous = {
                    state: fromState,
                    params: fromParams,
                    href: $state.href(fromState, fromParams)
                };
            }
        });
    });

    // 应用启动时，当文档加载完成后执行初始化函数
    angular.element(document).ready(function () {
        // 通过重定向解决facebook的bug
        if (window.location.hash && window.location.hash === '#_=_') {
            if (window.history && history.pushState) {
                window.history.pushState('', document.title, window.location.pathname);
            }
            else {
                // 保存页面当前滚动条位置来防止重定向后页面滚动
                var scroll = {
                    top: document.body.scrollTop,
                    left: document.body.scrollLeft
                };
                window.location.hash = '';
                // 恢复页面滚动条位置
                document.body.scrollTop = scroll.top;
                document.body.scrollLeft = scroll.left;
            }
        }

        // 当HTML文档加载完毕后，手动加载应用主模块
        angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
    });
