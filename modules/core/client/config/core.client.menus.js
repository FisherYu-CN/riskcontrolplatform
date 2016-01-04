'use strict';

// core模块的菜单设置
angular.module('core').run(['Menus',
    function (Menus) {

        // Home主菜单项
        Menus.addMenuItem('sidebar', {
            title: 'Home',
            state: 'portal.home',
            isHome: true,
            class: 'fa-home',
            roles: ['user'],
            position: 0
        });
    }
]);
