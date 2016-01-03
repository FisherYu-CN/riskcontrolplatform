'use strict';

// 定义模块依赖
var passport = require('passport'),
    User = require('mongoose').model('User'),
    path = require('path'),
    config = require(path.resolve('./config/config'));

/**
 * 初始化Passport基本配置
 */
module.exports = function(app) {
    // 将用户id序列化后保存到session之中
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // 反序列化session中的用户id，然后根据id查找用户对象并保存为req.user
    passport.deserializeUser(function(id, done) {
        User.findOne({
            _id: id
        }, '-salt -password', function(err, user) {
            done(err, user);
        });
    });

    // 加载所有本地Passport策略
    config.utils.getGlobbedPaths(path.join(__dirname, './strategies/**/*.js')).forEach(function(strategy) {
        require(path.resolve(strategy))(config);
    });

    // 添加Passport中间件
    app.use(passport.initialize());
    app.use(passport.session());
};
