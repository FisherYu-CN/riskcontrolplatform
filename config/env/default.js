'use strict';

module.exports = {
    // 应用基本信息
    app: {
        title: 'Risk Control Platform',
        description: 'TaiFinance Risk Control Platform',
        keywords: 'MEAN.JS RiskControl',
        googleAnalyticsTrackingID: process.env.GOOGLE_ANALYTICS_TRACKING_ID || 'GOOGLE_ANALYTICS_TRACKING_ID'
    },
    // 运行端口
    port: process.env.PORT || 3000,
    // 模板引擎
    templateEngine: 'swig',
    // Session和Cookie设置
    sessionCookie: {
        // Session默认24小时过期
        maxAge: 24 * (60 * 60 * 1000),
        // 确保Session只可以通过HTTP协议访问，而不是通过JS或者浏览器
        httpOnly: true,
        // 启动安全Cookie将提供额外的安全保障，限制Cookie
        // 只可以在HTTPS模式下被更改，默认关闭安全模式
        secure: false
    },
    // Session秘钥
    sessionSecret: 'TaiFinanceRCP',
    // Session主键采用被PHP应用程序广泛使用的sessionId
    sessionKey: 'sessionId',
    sessionCollection: 'sessions',
    logo: 'modules/core/client/img/brand/logo.png',
    favicon: 'modules/core/client/img/brand/favicon.ico'
};
