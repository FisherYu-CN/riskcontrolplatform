'use strict';

/**
 * 定义服务端鉴权管理路由
 *
 * @param {Object} app Express应用对象
 */
module.exports = function (app) {
    // 鉴权管理路由处理模块
    var users = require('../controllers/users.server.controller');

    // 鉴权密码相关API
    app.route('/api/auth/forgot').post(users.forgot);
    app.route('/api/auth/reset/:token').get(users.validateResetToken);
    app.route('/api/auth/reset/:token').post(users.reset);

    // 登录注册等相关API
    app.route('/api/auth/signup').post(users.signup);
    app.route('/api/auth/signin').post(users.signin);
    app.route('/api/auth/signout').get(users.signout);

    // Facebook的OAuth认证相关API
    app.route('/api/auth/facebook').get(users.oauthCall('facebook', {
        scope: ['email']
    }));
    app.route('/api/auth/facebook/callback').get(users.oauthCallback('facebook'));

    // Twitter的OAuth认证相关API
    app.route('/api/auth/twitter').get(users.oauthCall('twitter'));
    app.route('/api/auth/twitter/callback').get(users.oauthCallback('twitter'));

    // Google的OAuth认证相关API
    app.route('/api/auth/google').get(users.oauthCall('google', {
        scope: [
            'https://www.googleapis.com/auth/userinfo.profile',
            'https://www.googleapis.com/auth/userinfo.email'
        ]
    }));
    app.route('/api/auth/google/callback').get(users.oauthCallback('google'));

    // Linkedin的OAuth认证相关API
    app.route('/api/auth/linkedin').get(users.oauthCall('linkedin', {
        scope: [
            'r_basicprofile',
            'r_emailaddress'
        ]
    }));
    app.route('/api/auth/linkedin/callback').get(users.oauthCallback('linkedin'));

    // Github的OAuth认证相关API
    app.route('/api/auth/github').get(users.oauthCall('github'));
    app.route('/api/auth/github/callback').get(users.oauthCallback('github'));

    // Paypal的OAuth认证相关API
    app.route('/api/auth/paypal').get(users.oauthCall('paypal'));
    app.route('/api/auth/paypal/callback').get(users.oauthCallback('paypal'));
};
