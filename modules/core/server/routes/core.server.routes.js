'use strict';

/**
 * 定义服务端基础路由
 *
 * @param {Object} app Express应用对象
 */
module.exports = function (app) {
    // 基础路由处理模块
    var core = require('../controllers/core.server.controller');

    // 当遇到500服务器错误路由，跳转到相应错误页面
    app.route('/server-error').get(core.renderServerError);
    // 对API/模块/类库访问遇到404资源无法找到错误时，跳转到相应错误页面
    app.route('/:url(api|modules|lib)/*').get(core.renderNotFound);
    // 其他路由则跳转到平台主页
    app.route('/*').get(core.renderIndex);
};
