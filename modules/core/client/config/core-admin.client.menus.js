'use strict';

// core.admin模块的菜单设置
angular.module('core.admin').run(['Menus',
    function (Menus) {
        Menus.addMenuItem('topbar', {
            title: 'Admin',
            state: 'admin',
            type: 'dropdown',
            roles: ['admin']
        });
    }
]);
