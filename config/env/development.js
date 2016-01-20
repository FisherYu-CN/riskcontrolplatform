'use strict';

var defaultEnvConfig = require('./default');

module.exports = {
    // 数据库配置信息
    db: {
        uri: process.env.MONGOHQ_URL || process.env.MONGOLAB_URI || 'mongodb://' + (process.env.DB_1_PORT_27017_TCP_ADDR || 'localhost') + '/rcp-dev',
        options: {
            user: 'rcpdev',
            pass: 'Welcome1'
        },
        // Mongoose调试模式
        debug: process.env.MONGODB_DEBUG || false
    },
    // 日志配置信息
    log: {
        // 可选项有：'combined', 'common', 'dev', 'short', 'tiny'
        format: 'dev',
        // 默认使用标准输出(控制台)，也可取消下面注释使日志输出到本地文件系统
        options: {
            //stream: 'access.log'
        }
    },
    // 应用配置信息
    app: {
        title: defaultEnvConfig.app.title + ' - Development Environment'
    },
    facebook: {
        clientID: process.env.FACEBOOK_ID || 'APP_ID',
        clientSecret: process.env.FACEBOOK_SECRET || 'APP_SECRET',
        callbackURL: '/api/auth/facebook/callback'
    },
    twitter: {
        clientID: process.env.TWITTER_KEY || 'CONSUMER_KEY',
        clientSecret: process.env.TWITTER_SECRET || 'CONSUMER_SECRET',
        callbackURL: '/api/auth/twitter/callback'
    },
    google: {
        clientID: process.env.GOOGLE_ID || 'APP_ID',
        clientSecret: process.env.GOOGLE_SECRET || 'APP_SECRET',
        callbackURL: '/api/auth/google/callback'
    },
    linkedin: {
        clientID: process.env.LINKEDIN_ID || 'APP_ID',
        clientSecret: process.env.LINKEDIN_SECRET || 'APP_SECRET',
        callbackURL: '/api/auth/linkedin/callback'
    },
    github: {
        clientID: process.env.GITHUB_ID || 'APP_ID',
        clientSecret: process.env.GITHUB_SECRET || 'APP_SECRET',
        callbackURL: '/api/auth/github/callback'
    },
    paypal: {
        clientID: process.env.PAYPAL_ID || 'CLIENT_ID',
        clientSecret: process.env.PAYPAL_SECRET || 'CLIENT_SECRET',
        callbackURL: '/api/auth/paypal/callback',
        sandbox: true
    },
    // 邮件配置信息
    mailer: {
        from: process.env.MAILER_FROM || 'TaiFinance<88456101@qq.com>',
        options: {
            service: process.env.MAILER_SERVICE_PROVIDER || 'QQ',
            auth: {
                user: process.env.MAILER_EMAIL_ID || '88456101@qq.com',
                pass: process.env.MAILER_PASSWORD || 'pbmqgiweyfaybhei'
            }
        }
    },
    livereload: true,
    seedDB: process.env.MONGO_SEED || false
};
