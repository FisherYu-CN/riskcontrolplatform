'use strict';

var _ = require('lodash');

/**
 * 定义用户管理控制器，合并了用户认证/用户授权/密码管理/个人信息等四个控制器模块的主要功能
 */
module.exports = _.extend(
    require('./users/users.authentication.server.controller'),
    require('./users/users.authorization.server.controller'),
    require('./users/users.password.server.controller'),
    require('./users/users.profile.server.controller')
);
