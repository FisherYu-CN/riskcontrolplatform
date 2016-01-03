'use strict';

// 定义模块依赖
var _ = require('lodash'),
    mongoose = require('mongoose'),
    User = mongoose.model('User');

/**
 * 根据id查询用户对象的Express中间件
 *
 * @param {Object} req 用户发起的HTTP请求
 * @param {Object} res 用户得到的HTTP响应
 * @param {Function} next 调用下一个中间件的函数
 * @param {string} id 用户id
 */
exports.userByID = function(req, res, next, id) {
    // 当id不是一个合法的MongoDB对象id时，返回400错误
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send({
            message: 'User is invalid'
        });
    }

    // 根据id查询用户对象
    User.findOne({
        _id: id
    }).exec(function(err, user) {
        if (err) {
            return next(err);
        } else if (!user) {
            return next(new Error('Failed to load User ' + id));
        }
        // 成功找到用户对象，将其保存在请求对象中以便后面的中间件或路由处理函数使用
        req.profile = user;
        next();
    });
};
