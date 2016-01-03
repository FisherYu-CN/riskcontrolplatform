'use strict';

/**
 * 渲染平台主页面
 *
 * @param {Object} req 用户发起的HTTP请求
 * @param {Object} res 用户得到的HTTP响应
 */
exports.renderIndex = function (req, res) {
    res.render('modules/core/server/views/index', {
        user: req.user || null
    });
};

/**
 * 渲染平台500服务器错误页面
 *
 * @param {Object} req 用户发起的HTTP请求
 * @param {Object} res 用户得到的HTTP响应
 */
exports.renderServerError = function (req, res) {
    res.status(500).render('modules/core/server/views/500', {
        error: 'Oops! Something went wrong...'
    });
};

/**
 * 渲染平台404资源无法找到错误页面，将针对接受的HTTP头提供内容协商
 *
 * @param {Object} req 用户发起的HTTP请求
 * @param {Object} res 用户得到的HTTP响应
 */
exports.renderNotFound = function (req, res) {
    res.status(404).format({
        'text/html': function () {
            res.render('modules/core/server/views/404', {
                url: req.originalUrl
            });
        },
        'application/json': function () {
            res.json({
                error: 'Path not found'
            });
        },
        'default': function () {
            res.send('Path not found');
        }
    });
};
