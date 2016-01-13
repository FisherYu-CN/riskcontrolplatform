'use strict';

// 定义模块依赖
var _ = require('lodash'),
    fs = require('fs'),
    path = require('path'),
    errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
    mongoose = require('mongoose'),
    User = mongoose.model('User');

/**
 * 更新用户信息
 *
 * @param {Object} req 用户发起的HTTP请求
 * @param {Object} res 用户得到的HTTP响应
 */
exports.update = function(req, res) {
    // 获取当前登录用户对象
    var user = req.user;
    // 出于安全因素考虑，删除信息更新请求中针对用户角色的数据定义
    // 用户的角色在注册时由系统自动赋予，之后也只可由管理员手动变更
    delete req.body.roles;

    if (user) {
        // 将用户的更新合并到当前用户对象之中
        user = _.extend(user, req.body);
        user.updated = Date.now();
        // 保存用户信息
        user.save(function(err) {
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            } else {
                // 调用Passport的login函数来建立login session
                req.login(user, function(err) {
                    if (err) {
                        res.status(400).send(err);
                    } else {
                        res.json(user);
                    }
                });
            }
        });
    } else {
        res.status(400).send({
            message: 'User is not signed in'
        });
    }
};

/**
 * 更新用户头像
 *
 * @param {Object} req 用户发起的HTTP请求
 * @param {Object} res 用户得到的HTTP响应
 */
exports.changeProfilePicture = function(req, res) {
    // 获取当前登录用户对象
    var user = req.user;
    // 上传用户头像并更新信息
    if (user) {
        fs.writeFile('./modules/users/client/img/profile/uploads/' + req.files.file.name, req.files.file.buffer, function(uploadError) {
            if (uploadError) {
                return res.status(400).send({
                    message: 'Error occurred while uploading profile picture'
                });
            } else {
                // 用户头像图片上传成功，返回图片URL
                res.json('modules/users/client/img/profile/uploads/' + req.files.file.name);
            }
        });
    } else {
        res.status(400).send({
            message: 'User is not signed in'
        });
    }
};

/**
 * 获取用户个人信息
 *
 * @param {Object} req 用户发起的HTTP请求
 * @param {Object} res 用户得到的HTTP响应
 */
exports.me = function(req, res) {
    // 返回当前登录用户对象
    res.json(req.user || null);
};
