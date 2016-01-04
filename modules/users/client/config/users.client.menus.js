'use strict';

// users模块的菜单设置
angular.module('users').run(['Menus',
    function (Menus) {
        // 用户管理主菜单项
        Menus.addMenuItem('sidebar', {
            title: 'Users',
            state: 'portal.users',
            type: 'dropdown',
            class: 'fa-user',
            roles: ['*'],
            position: 4
        });

        // 编辑个人信息子菜单项
        Menus.addSubMenuItem('sidebar', 'portal.users', {
            title: 'Edit Profile',
            state: 'portal.users.profile',
            roles: ['user']
        });

        // 修改密码子菜单项
        Menus.addSubMenuItem('sidebar', 'portal.users', {
            title: 'Change Password',
            state: 'portal.users.password',
            roles: ['user']
        });
    }
]);