'use strict';

(function() {
    describe('Menus', function() {
        // 初始化全局变量
        var Menus;

        // 加载主应用模块
        beforeEach(module(ApplicationConfiguration.applicationModuleName));

        // 注入菜单服务
        beforeEach(inject(function(_Menus_) {
            Menus = _Menus_;
        }));

        // 侧边菜单栏应该已被添加
        it('should have sidebar added', function() {
            expect(Menus.menus.sidebar).toBeDefined();
        });

        // 菜单服务的默认角色应该为user和admin
        it('should have default roles to user and admin', function() {
            expect(Menus.defaultRoles).toEqual(['user', 'admin']);
        });

        // 测试添加菜单
        describe('addMenu', function() {

            // 不使用选项参数的默认行为
            describe('with no options', function() {

                // 初始化变量
                var menu;

                // 添加测试菜单menu1
                beforeEach(function() {
                    menu = Menus.addMenu('menu1');
                });

                // 应该返回菜单对象
                it('should return menu object', function() {
                    expect(menu).toBeDefined();
                });

                // 菜单对象应该有默认的角色
                it('should default roles', function() {
                    expect(menu.roles).toEqual(Menus.defaultRoles);
                });

                // 应该包含空的菜单项列表
                it('should have empty items', function() {
                    expect(menu.items).toEqual([]);
                });

                // 用户未登录，shouldRender函数应该返回false
                it('should set shouldRender to shouldRender function handle', function() {
                    expect(menu.shouldRender()).toBeFalsy();
                });
            });

            // 使用选项参数
            describe('with options', function() {

                // 初始化变量
                var menu,
                    options = {
                        roles: ['a', 'b', 'c'],
                        items: ['d', 'e', 'f']
                    };

                // 添加测试菜单menu1
                beforeEach(function() {
                    menu = Menus.addMenu('menu1', options);
                });

                // 菜单包含的菜单项应与选项参数中给定的一致
                it('should set items to options.items list', function() {
                    expect(menu.items).toBe(options.items);
                });

                // 菜单包含的角色列表应与选项参数中给定的一致
                it('should set roles to options.roles list', function() {
                    expect(menu.roles).toBe(options.roles);
                });
            });
        });

        // 测试shouldRender函数
        describe('shouldRender', function() {

            // 初始化变量
            var menu1Options = {
                    roles: ['*', 'menurole']
                },
                menu2Options = {
                    roles: ['b', 'menurole', 'c']
                },
                menu1,
                menu2,
                user1 = {
                    roles: ['1', 'menurole', '2']
                },
                user2 = {
                    roles: ['1', '2', '3']
                };

            // 添加测试菜单menu1
            beforeEach(function() {
                menu1 = Menus.addMenu('menu1', menu1Options);
                menu2 = Menus.addMenu('menu2', menu2Options);
            });

            // 用户登出时，shouldRender应该返回false
            it('should not render when user logged out', function() {
                expect(menu1.shouldRender()).toBeFalsy();
            });

            // 用户登入时，若菜单角色包含*通配符，shouldRender应该对所有用户返回true
            it('should render if the menu with * role when user logged in', function() {
                expect(menu1.shouldRender(user1)).toBeTruthy();
            });

            // 用户登入时，若菜单角色不包含*通配符，shouldRender在用户和菜单拥有相同的角色时返回true
            it('should render if user has same role as menu', function() {
                expect(menu2.shouldRender(user1)).toBeTruthy();
            });

            // 用户登入时，若菜单角色不包含*通配符，shouldRender在用户和菜单拥有完全不同的角色时返回false
            it('should not render if user has different roles', function() {
                expect(menu2.shouldRender(user2)).toBeFalsy();
            });
        });

        // 验证validateMenuExistance函数
        describe('validateMenuExistance', function() {

            // 当menuId没有提供
            describe('when menuId not provided', function() {

                // 当未提供菜单ID时，应该抛出相应错误
                it('should throw menuId error', function() {
                    expect(Menus.validateMenuExistance).toThrowError('MenuId was not provided');
                });
            });

            // 当菜单不存在时
            describe('when menu does not exist', function() {

                // 当菜单不存在时，应该抛出相应错误
                it('should throw no menu error', function() {
                    expect(Menus.validateMenuExistance('noMenuId')).toThrowError('Menu does not exist');
                });
            });

            // 当菜单存在时
            describe('when menu exists', function() {

                // 初始化变量
                var menuId = 'menuId';

                beforeEach(function() {
                    Menus.menus[menuId] = {};
                });

                // 当菜单存在时，应该返回true
                it('should return truthy', function() {
                    expect(Menus.validateMenuExistance(menuId)).toBeTruthy();
                });
            });
        });


        // 测试removeMenu函数
        describe('removeMenu', function() {

            // 初始化变量
            var menu = {
                id: 'menuId'
            };

            // 先添加菜单，再通过removeMenu函数将其删除
            beforeEach(function() {
                Menus.menus[menu.id] = menu;
                Menus.validateMenuExistance = jasmine.createSpy();
                Menus.removeMenu(menu.id);
            });

            // 应该已经从菜单列表中删除给定的菜单
            it('should remove existing menu from menus', function() {
                expect(Menus.menus).not.toContain(menu.id);
            });

            // 在删除菜单前应该会调用validateMenuExistance函数来检查菜单是否存在
            it('validates menu existance before removing', function() {
                expect(Menus.validateMenuExistance).toHaveBeenCalledWith(menu.id);
            });
        });

        // 测试添加菜单项
        describe('addMenuItem', function() {

            // 初始化变量
            var subMenuItem1 = {
                    title: 'sub1'
                },
                subMenuItem2 = {
                    title: 'sub2'
                },
                menuItemOptions = {
                    title: 'title',
                    state: 'state',
                    type: 'type',
                    class: 'class',
                    roles: ['a', 'b'],
                    position: 2,
                    items: [subMenuItem1, subMenuItem2]
                },
                menuItem,
                menuId = 'menu1',
                menu;

            // 添加菜单和菜单项
            beforeEach(function() {
                Menus.validateMenuExistance = jasmine.createSpy();
                Menus.addSubMenuItem = jasmine.createSpy();
                Menus.addMenu(menuId, {
                    roles: ['a', 'b']
                });
                menu = Menus.addMenuItem(menuId, menuItemOptions);
                menuItem = menu.items[0];
            });

            // 在添加菜单项前应该会调用validateMenuExistance函数来检查菜单是否存在
            it('should validate menu existance', function() {
                expect(Menus.validateMenuExistance).toHaveBeenCalledWith(menuId);
            });

            // 添加菜单项后应该返回菜单对象
            it('should return the menu', function() {
                expect(menu).toBeDefined();
            });

            // 菜单项的shouldRender函数应该被定义
            it('should set menu item shouldRender function', function() {
                expect(menuItem.shouldRender).toBeDefined();
            });

            // 使用选项参数
            describe('with options set', function() {

                // 菜单项应该被添加到菜单的菜单项列表中
                it('should add menu item to menu', function() {
                    expect(menu.items.length).toBe(1);
                });

                // 菜单项的标题应该与选项参数中给定的值一致
                it('should set menu item title to options title', function() {
                    expect(menuItem.title).toBe(menuItemOptions.title);
                });

                // 菜单项的状态应该与选项参数中给定的值一致
                it('should set menu item state to options state', function() {
                    expect(menuItem.state).toBe(menuItemOptions.state);
                });

                // 菜单项的类型应该与选项参数中给定的值一致
                it('should set menu item type to options type', function() {
                    expect(menuItem.type).toBe(menuItemOptions.type);
                });

                // 菜单项的CSS类应该与选项参数中给定的值一致
                it('should set menu item class to options class', function() {
                    expect(menuItem.class).toBe(menuItemOptions.class);
                });

                // 菜单项的位置应该与选项参数中给定的值一致
                it('should set menu item position to options position', function() {
                    expect(menuItem.position).toBe(menuItemOptions.position);
                });

                // 应该调用过addSubMenuItem函数来添加选项中的每个子菜单项
                it('should call addSubMenuItem for each item in options', function() {
                    expect(Menus.addSubMenuItem).toHaveBeenCalledWith(menuId, menuItemOptions.state, subMenuItem1);
                    expect(Menus.addSubMenuItem).toHaveBeenCalledWith(menuId, menuItemOptions.state, subMenuItem2);
                });
            });

            // 不使用选项参数
            describe('without options set', function() {

                // 添加菜单
                beforeEach(function() {
                    menu = Menus.addMenuItem(menuId);
                    menuItem = menu.items[1];
                });

                // 菜单项类型应该被设为item
                it('should set menu item type to item', function() {
                    expect(menuItem.type).toBe('item');
                });

                // 菜单项标题应该被设为空字符串
                it('should set menu item title to empty', function() {
                    expect(menuItem.title).toBe('');
                });

                // 菜单项角色应该被设为默认角色
                it('should set menu item roles to default roles', function() {
                    expect(menuItem.roles).toEqual(Menus.defaultRoles);
                });

                // 菜单项位置应该被设为0
                it('should set menu item position to 0', function() {
                    expect(menuItem.position).toBe(0);
                });
            });
        });

        // 测试removeMenuItem函数
        describe('removeMenuItem', function() {

            // 初始化变量
            var menuId = 'menuId',
                menuItemState = 'menu.state1',
                menuItemState2 = 'menu.state2',
                menu;

            // 添加菜单和菜单项然后删除其中一个菜单项
            beforeEach(function() {
                Menus.addMenu(menuId);
                Menus.addMenuItem(menuId, { state: menuItemState });
                Menus.addMenuItem(menuId, { state: menuItemState2 });
                Menus.validateMenuExistance = jasmine.createSpy();
                menu = Menus.removeMenuItem(menuId, menuItemState);
            });

            // 删除菜单项后应该返回菜单对象
            it('should return menu object', function() {
                expect(menu).not.toBeNull();
            });

            // 在删除菜单项前应该会调用validateMenuExistance函数来检查菜单是否存在
            it('should validate menu existance', function() {
                expect(Menus.validateMenuExistance).toHaveBeenCalledWith(menuId);
            });

            // 应该成功删除一个包含给定状态的菜单项
            it('should remove sub menu items with same state', function() {
                expect(menu.items.length).toBe(1);
                expect(menu.items[0].state).toBe(menuItemState2);
            });
        });

        // 测试addSubMenuItem函数
        describe('addSubMenuItem', function() {

            // 初始化变量
            var subItemOptions = {
                    title: 'title',
                    state: 'sub.state',
                    roles: ['a', 'b'],
                    position: 4
                },
                menuId = 'menu1',
                menuItem1Options = {
                    state: 'item1.state',
                    items: []
                },
                menuItem2Options = {
                    state: 'item2.state2',
                    items: [],
                    roles: ['a']
                },
                menuItem1,
                menuItem2,
                menuItem3,
                subItem1,
                subItem2,
                menu;

            // 创建菜单并添加菜单项和子菜单项
            beforeEach(function() {
                Menus.validateMenuExistance = jasmine.createSpy();
                Menus.addMenu(menuId);
                Menus.addMenuItem(menuId, menuItem1Options);
                Menus.addMenuItem(menuId, menuItem2Options);
                Menus.addMenuItem(menuId, { state:'something.else' });
                Menus.addSubMenuItem(menuId, menuItem1Options.state, subItemOptions);
                menu = Menus.addSubMenuItem(menuId, menuItem1Options.state);
                menuItem1 = menu.items[0];
                menuItem2 = menu.items[1];
                menuItem3 = menu.items[2];
                subItem1 = menuItem1.items[0];
                subItem2 = menuItem1.items[1];
            });

            // 删除菜单
            afterEach(function() {
                Menus.removeMenu(menuId);
            });

            // 添加子菜单项后应该返回菜单对象
            it('should return menu object', function() {
                expect(menu).not.toBeNull();
            });

            // 在添加子菜单项前应该会调用validateMenuExistance函数来检查菜单是否存在
            it('should validate menu existance', function() {
                expect(Menus.validateMenuExistance).toHaveBeenCalledWith(menuId);
            });

            // 不应该对包含状态与给定状态不同的菜单项添加子菜单项
            it('should not add sub menu item to menu item of different state', function() {
                expect(menuItem3.items.length).toBe(0);
            });

            // 添加的子菜单项应该包含shouldRender函数
            it('should set shouldRender', function() {
                expect(subItem1.shouldRender).toBeDefined();
            });

            // 使用了选项参数
            describe('with options set', function() {

                // 子菜单项应该已被创建
                it('should add sub menu item to menu item', function() {
                    expect(subItem1).toBeDefined();
                });

                // 子菜单项的标题应该与选项参数中的一致
                it('should set title to options title', function() {
                    expect(subItem1.title).toBe(subItemOptions.title);
                });

                // 子菜单项的状态应该与选项参数中的一致
                it('should set state to options state', function() {
                    expect(subItem1.state).toBe(subItemOptions.state);
                });

                // 子菜单项的角色列表应该与选项参数中的一致
                it('should set roles to options roles', function() {
                    expect(subItem1.roles).toEqual(subItemOptions.roles);
                });

                // 子菜单项的位置应该与选项参数中的一致
                it('should set position to options position', function() {
                    expect(subItem1.position).toEqual(subItemOptions.position);
                });
            });

            // 不使用选项参数
            describe('without optoins set', function() {

                // 子菜单项应该已被创建
                it('should add sub menu item to menu item', function() {
                    expect(subItem2).toBeDefined();
                });

                // 子菜单项的标题应该为空字符串
                it('should set title to blank', function() {
                  expect(subItem2.title).toBe('');
                });

                // 子菜单项的状态应该为空字符串
                it('should set state to blank', function() {
                    expect(subItem2.state).toBe('');
                });

                // 子菜单项的角色列表应该与其父菜单项一致
                it('should set roles to parent roles', function() {
                    expect(subItem2.roles).toEqual(menuItem1.roles);
                });

                // 子菜单项的位置应该为0
                it('should set position to 0', function() {
                    expect(subItem2.position).toBe(0);
                });
            });
      
            // 测试removeSubMenuItem函数
            describe('then removeSubMenuItem', function() {

                // 删除一个子菜单项
                beforeEach(function() {
                    Menus.validateMenuExistance = jasmine.createSpy();
                    menu = Menus.removeSubMenuItem(menuId, subItem1.state);
                });

                // 删除子菜单项后应该返回菜单对象
                it('should return menu object', function() {
                    expect(menu).toBeDefined();
                });

                // 在删除子菜单项前应该会调用validateMenuExistance函数来检查菜单是否存在
                it('should validate menu existance', function() {
                    expect(Menus.validateMenuExistance).toHaveBeenCalledWith(menuId);
                });

                // 应该成功删除了一个子菜单项
                it('should remove sub menu item', function() {
                    expect(menuItem1.items.length).toBe(1);
                    expect(menuItem1.items[0].state).toEqual(subItem2.state);
                });
            });
        });
    });
})();
