'use strict';

// 定义模块依赖
var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    User = require('mongoose').model('User');

/**
 * 初始化Passport本地验证策略
 */
module.exports = function() {

    // 使用本地验证策略
    passport.use(new LocalStrategy({
            usernameField: 'username',
            passwordField: 'password'
        },
        function (username, password, done) {
            // 根据用户名从本地MongoDB获取用户信息
            User.findOne({
                username: username.toLowerCase()
            }, function(err, user) {
                if (err) {
                    return done(err);
                }
                // 不存在用户或者密码不正确
                if (!user || !user.authenticate(password)) {
                    return done(null, false, {
                        message: 'Invalid username or password'
                    });
                }

                return done(null, user);
            });
        }
    ));
};
