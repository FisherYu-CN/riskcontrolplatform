'use strict';

// 管理菜单的菜单服务
angular.module('core').service('Menus', [
    function () {
        // 定义默认的角色，普通用户与管理员
        this.defaultRoles = ['user', 'admin'];

        // 定义菜单栏对象Map集合，key为菜单栏ID，value为菜单栏对象
        this.menus = {};

        /**
         * 确定菜单栏/菜单项是否应该渲染（显示）
         *
         * @param {Object} user 登录用户对象
         * @return {boolean} 菜单栏/菜单项应该被渲染时返回true，否则返回false
         */
        var shouldRender = function (user) {
            // 当菜单栏/菜单项的角色列表中包含*，意味着允许一切角色，则渲染菜单栏/菜单项
            if (!!~this.roles.indexOf('*')) {
                return true;
            }
            else {
                // 当用户未登录，不渲染菜单栏/菜单项
                if(!user) {
                    return false;
                }
                // 若用户拥有菜单栏/菜单项所要求的角色列表之中任意一个角色，则渲染菜单栏/菜单项
                for (var userRoleIndex = 0; userRoleIndex < user.roles.length; userRoleIndex++) {
                    for (var roleIndex = 0; roleIndex < this.roles.length; roleIndex++) {
                        if (this.roles[roleIndex] === user.roles[userRoleIndex]) {
                            return true;
                        }
                    }
                }
            }

            return false;
        };

        /**
         * 验证菜单栏是否存在
         *
         * @param {string} menuId 菜单栏ID
         * @return {boolean} 菜单栏存在时返回true，否则抛出异常并返回false
         */
        this.validateMenuExistance = function (menuId) {
            // 菜单栏ID为非空字符串
            if (menuId && menuId.length) {
                if (this.menus[menuId]) {
                    return true;
                } else {
                    throw new Error('Menu does not exist');
                }
            }
            else {
                throw new Error('MenuId was not provided');
            }

            return false;
        };

        /**
         * 根据菜单栏ID获取菜单栏
         *
         * @param {string} menuId 菜单栏ID
         * @return {Object} 菜单栏对象
         */
        this.getMenu = function (menuId) {
            // 验证菜单栏是否存在，不存在时会抛出异常
            this.validateMenuExistance(menuId);
            // 返回菜单栏对象
            return this.menus[menuId];
        };

        /**
         * 添加一个菜单栏对象
         *
         * @param {string} menuId 菜单栏ID
         * @param {Object} options 菜单栏选项（角色列表/菜单项等）
         * @return {Object} 创建好的菜单栏对象
         */
        this.addMenu = function (menuId, options) {
            options = options || {};
            // 创建新的菜单栏对象，默认不包含菜单项
            // 若未指定角色列表，则使用默认角色列表
            this.menus[menuId] = {
                roles: options.roles || this.defaultRoles,
                items: options.items || [],
                shouldRender: shouldRender
            };

            return this.menus[menuId];
        };

        /**
         * 根据菜单栏ID删除菜单栏对象
         *
         * @param {string} menuId 菜单栏ID
         */
        this.removeMenu = function (menuId) {
            // 验证菜单栏是否存在，不存在时会抛出异常
            this.validateMenuExistance(menuId);
            // 从菜单栏集合中删除指定的菜单栏对象
            delete this.menus[menuId];
        };

        /**
         * 添加一个主菜单项对象
         *
         * @param {string} menuId 主菜单项所属的菜单栏ID
         * @param {Object} options 主菜单项选项（标题/状态名/角色等等）
         * @return {Object} 新建的主菜单项所属的菜单栏对象
         */
        this.addMenuItem = function (menuId, options) {
            options = options || {};
            // 验证菜单栏是否存在，不存在时会抛出异常
            this.validateMenuExistance(menuId);

            // 在菜单栏的主菜单项列表中新增一个主菜单项
            this.menus[menuId].items.push({
                title: options.title || '',
                state: options.state || '',
                type: options.type || 'item',
                class: options.class,
                roles: ((options.roles === null || typeof options.roles === 'undefined') ? this.defaultRoles : options.roles),
                position: options.position || 0,
                items: [],
                shouldRender: shouldRender
            });

            // 添加子菜单项
            if (options.items) {
                for (var i = 0; i < options.items.length; i++) {
                    this.addSubMenuItem(menuId, options.state, options.items[i]);
                }
            }

            return this.menus[menuId];
        };

        /**
         * 添加一个子菜单项对象
         *
         * @param {string} menuId 子菜单项所属的菜单栏ID
         * @param {string} parentItemState 父菜单项的状态名
         * @param {Object} options 子菜单项选项（标题/状态名/角色列表等）
         * @return {Object} 新建的子菜单项所属的菜单栏对象
         */
        this.addSubMenuItem = function (menuId, parentItemState, options) {
            options = options || {};
            // 验证菜单栏是否存在，不存在时会抛出异常
            this.validateMenuExistance(menuId);

            // 查找该子菜单项所属的主菜单项
            for (var itemIndex = 0; itemIndex < this.menus[menuId].items.length; itemIndex++) {
                if (this.menus[menuId].items[itemIndex].state === parentItemState) {
                    // 创建子菜单项并添加到主菜单项的子菜单项列表中
                    this.menus[menuId].items[itemIndex].items.push({
                        title: options.title || '',
                        state: options.state || '',
                        roles: ((options.roles === null || typeof options.roles === 'undefined') ? this.menus[menuId].items[itemIndex].roles : options.roles),
                        position: options.position || 0,
                        shouldRender: shouldRender
                    });
                }
            }

            return this.menus[menuId];
        };

        /**
         * 删除一个主菜单项
         *
         * @param {string} menuId 主菜单项所属的菜单栏ID
         * @param {string} menuItemState 主菜单项状态名
         * @return {Object} 被删除的主菜单项所属的菜单栏对象
         */
        this.removeMenuItem = function (menuId, menuItemState) {
            // 验证菜单栏是否存在，不存在时会抛出异常
            this.validateMenuExistance(menuId);

            // 查找主菜单项并删除
            for (var itemIndex = 0; itemIndex < this.menus[menuId].items.length; itemIndex++) {
                if (this.menus[menuId].items[itemIndex].state === menuItemState) {
                    this.menus[menuId].items.splice(itemIndex, 1);
                }
            }

            return this.menus[menuId];
        };

        /**
         * 删除一个子菜单项
         *
         * @param {string} menuId 子菜单项所属的菜单栏ID
         * @param {string} submenuItemState 子菜单项状态名
         * @return {Object} 被删除的主菜单项所属的菜单栏对象
         */
        this.removeSubMenuItem = function (menuId, submenuItemState) {
            // 验证菜单栏是否存在，不存在时会抛出异常
            this.validateMenuExistance(menuId);

            //  查找子菜单项并删除
            for (var itemIndex = 0; itemIndex < this.menus[menuId].items.length; itemIndex++) {
                for (var subitemIndex = 0; subitemIndex < this.menus[menuId].items[itemIndex].items.length; subitemIndex++) {
                    if (this.menus[menuId].items[itemIndex].items[subitemIndex].state === submenuItemState) {
                         this.menus[menuId].items[itemIndex].items.splice(subitemIndex, 1);
                    }
                }
            }

            return this.menus[menuId];
        };

        // 添加顶部菜单栏
        this.addMenu('topbar', {
            roles: ['*']
        });
    }
]);
