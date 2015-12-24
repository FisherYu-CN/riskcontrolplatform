'use strict';

// core.admin模块的菜单设置
angular.module('core.admin').run(['Menus',
    function (Menus) {

        Menus.addMenuItem('sidebar', {
            title: 'Home',
            state: 'portal.home',
            class: 'fa-home',
            roles: ['user'],
            position: 0
        });

        //Menus.addMenuItem('sidebar', {
        //    title: 'Admin',
        //    state: 'admin',
        //    type: 'dropdown',
        //    roles: ['admin']
        //});
    }
]);
