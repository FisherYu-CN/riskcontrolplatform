'use strict';

/**
 * 定义服务端用户管理路由
 *
 * @param {Object} app Express应用对象
 */
module.exports = function (app) {
    // 用户管理路由处理模块
    var users = require('../controllers/users.server.controller');

    // 用户信息管理相关API
    app.route('/api/users/me').get(users.me);
    app.route('/api/users').put(users.update);
    app.route('/api/users/accounts').delete(users.removeOAuthProvider);
    app.route('/api/users/password').post(users.changePassword);
    app.route('/api/users/picture').post(users.changeProfilePicture);

    // 绑定自定义中间件，统一对所有涉及userId参数的路由，提供默认的用户查找功能
    app.param('userId', users.userByID);
};
