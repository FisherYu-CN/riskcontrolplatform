'use strict';

// 定义模块依赖
var path = require('path'),
    errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
    mongoose = require('mongoose'),
    passport = require('passport'),
    User = mongoose.model('User');

// 不能够在登录后重定向到的URL列表
var noReturnUrls = ['/signin', '/signup'];

/**
 * 用户注册
 *
 * @param {Object} req 用户发起的HTTP请求
 * @param {Object} res 用户得到的HTTP响应
 */
exports.signup = function(req, res) {
    // 出于安全因素考虑，删除注册请求中针对用户角色的数据定义
    // 用户的角色在注册时由系统自动赋予，之后也只可由管理员手动变更
    delete req.body.roles;

    // 初始化变量
    var user = new User(req.body);

    // 添加缺省的字段
    user.provider = 'local';

    // 保存用户
    user.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            // 登录前删除密码/salt等敏感数据
            delete user.password;
            delete user.salt;
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
};

/**
 * 用户登录
 *
 * @param {Object} req 用户发起的HTTP请求
 * @param {Object} res 用户得到的HTTP响应
 */
exports.signin = function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
        if (err || !user) {
            res.status(400).send(info);
        } else {
            // 登录前删除密码/salt等敏感数据
            delete user.password;
            delete user.salt;
            // 调用Passport的login函数来建立login session
            req.login(user, function(err) {
                if (err) {
                    res.status(400).send(err);
                } else {
                    res.json(user);
                }
            });
        }
    })(req, res, next);
};

/**
 * 用户登出
 *
 * @param {Object} req 用户发起的HTTP请求
 * @param {Object} res 用户得到的HTTP响应
 */
exports.signout = function(req, res){
    // 调用Passport的logout函数来终止login session
    req.logout();
    // 重定向回首页
    res.redirect('/');
};

/**
 * 根据Passport策略与范围，获取提供针对不同OAuth认证方的路由处理函数
 *
 * @param {string} strategy Passport认证策略，不同的策略对应不同的OAuth提供方
 * @param {Object} scope OAuth2.0中定义的访问范围对象，实际值以具体的OAuth提供方定义的为准
 *                       示例：{scope: 'email'} 或 {scope: ['email', 'sms']}
 * @return {Function} 针对特定OAuth认证方的路由处理函数
 */
exports.oauthCall = function(strategy, scope) {
    return function(req, res, next) {
        // 将请求中的重定向路径保存在Session中，在认证成功后会重定向到此路径
        // 不允许重定向回注册和登录页面，以避免给用户登录造成疑惑
        if (noReturnUrls.indexOf(req.query.redirect_to) === -1) {
            req.session.redirect_to = req.query.redirect_to;
        }
        // 根据策略和范围调用具体的Passport模块进行认证
        passport.authenticate(strategy, scope)(req, res, next);
    };
};


/**
 * 根据Passport策略，获取提供针对不同OAuth认证方的回调路由处理函数
 *
 * @param {string} strategy Passport认证策略，不同的OAuth提供方对应不同的策略
 * @return {Function} 针对特定OAuth认证方的回调路由处理函数
 */
exports.oauthCallback = function(strategy) {
    return function (req, res, next) {
        // 从Session中获取重定向的路径后移除该记录
        var sessionRedirectURL = req.session.redirect_to;
        delete req.session.redirect_to;
        // 向该Passport策略提供自定义的回调
        passport.authenticate(strategy, function(err, user, redirectURL) {
            if (err) {
                return res.redirect('/signin?err=' + encodeURIComponent(errorHandler.getErrorMessage(err)));
            }
            if (!user) {
                return res.redirect('/signin');
            }
            // 调用Passport的login函数来建立login session
            // 然后重定向到指定的页面或者首页
            req.login(user, function(err) {
                if (err) {
                    return res.redirect('/signin');
                }
                res.redirect(redirectURL || sessionRedirectURL || '/');
            });
        })(req, res, next);
    };
};

/**
 * 保存或更新一个OAuth用户的个人资料
 *
 * @param {Object} req 用户发起的HTTP请求
 * @param {Object} providerUserProfile 包含OAuth提供方相关信息的用户信息对象
 * @param {Function} done Passport的确认回调函数
 */
exports.saveOAuthUserProfile = function(req, providerUserProfile, done) {

    // 当用户尚未登录时，尝试新建一个用户并包含OAuth提供方的相关信息
    if (!req.user) {

        // 定义查询字段名称
        var searchMainProviderIdentifierField = 'providerData.' + providerUserProfile.providerIdentifierField;
        var searchAdditionalProviderIdentifierField = 'additionalProvidersData.' + providerUserProfile.provider + '.' + providerUserProfile.providerIdentifierField;

        // 定义主OAuth提供方查询对象
        // 示例：{provider: 'facebook', providerData.id: 'someid'}
        var mainProviderSearchQuery = {};
        mainProviderSearchQuery.provider = providerUserProfile.provider;
        mainProviderSearchQuery[searchMainProviderIdentifierField] = providerUserProfile.providerData[providerUserProfile.providerIdentifierField];

        // 定义附加OAuth提供方查询对象
        // 示例：{additionalProvidersData.facebook.id: 'someid'}
        var additionalProviderSearchQuery = {};
        additionalProviderSearchQuery[searchAdditionalProviderIdentifierField] = providerUserProfile.providerData[providerUserProfile.providerIdentifierField];

        // 定义查询对象以查找满足以下任意条件的用户对象：
        // 1. 该用户的主OAuth提供方信息中的标识字段值与给定的值相等
        // 2. 该用户的其他附加OAuth提供方信息中的任意一个的标识字段值与给定的值相符
        var searchQuery = {
            $or: [mainProviderSearchQuery, additionalProviderSearchQuery]
        };

        User.findOne(searchQuery, function(err, user) {
            if (err) {
                return done(err);
            } else {
                // 如果该用户不存在，说明此用户为新用户，需要为其创建一个用户账号
                if (!user) {
                    // 尝试使用该用户在其OAuth提供方处使用的用户名或者电子邮箱名(去掉域名)为新用户账号的用户名
                    var possibleUsername = providerUserProfile.username || ((providerUserProfile.email) ? providerUserProfile.email.split('@')[0] : '');
                    // 如果用户名唯一，则使用该用户名创建新的用户账号并保存
                    User.findUniqueUsername(possibleUsername, null, function (availableUsername) {
                        user = new User({
                            firstName: providerUserProfile.firstName,
                            lastName: providerUserProfile.lastName,
                            username: availableUsername,
                            displayName: providerUserProfile.displayName,
                            email: providerUserProfile.email,
                            profileImageURL: providerUserProfile.profileImageURL,
                            provider: providerUserProfile.provider,
                            providerData: providerUserProfile.providerData
                        });
                        user.save(function(err) {
                            return done(err, user);
                        });
                    });
                } else {
                    return done(err, user);
                }
            }
        });
    }
    // 用户已经登录，则将OAuth提供方的相关数据添加到当前用户
    else {
        var user = req.user;

        // 如果当前登录用户的主OAuth提供方和其他附加OAuth提供方均不是当前使用的OAuth提供方
        // 需要将当前使用的OAuth提供方的相关信息添加到该用户的附加OAuth提供方列表之中
        if (user.provider !== providerUserProfile.provider &&
            (!user.additionalProvidersData || !user.additionalProvidersData[providerUserProfile.provider])) {

            if (!user.additionalProvidersData) {
                user.additionalProvidersData = {};
            }
            user.additionalProvidersData[providerUserProfile.provider] = providerUserProfile.providerData;

            // 将用户的additionalProvidersData字段标记为已修改并保存用户对象
            user.markModified('additionalProvidersData');
            user.save(function (err) {
                return done(err, user, '/settings/accounts');
            });
        } else {
            return done(new Error('User is already connected using this provider'), user);
        }
    }
};

/**
 * 删除OAuth提供方配置信息
 *
 * @param {Object} req 用户发起的HTTP请求
 * @param {Object} res 用户得到的HTTP响应
 */
exports.removeOAuthProvider = function(req, res) {
    // 获取当前用户与URL参数中OAuth提供方名称
    var user = req.user;
    var provider = req.query.provider;

    if (!user) {
        // 如果用户为登录，返回401错误
        return res.status(401).json({
            message: 'User is not authenticated'
        });
    } else if (!provider) {
        // 如果请求参数中没有指定需要删除的OAuth提供方名称，返回400错误
        return res.status(400).send();
    }

    // 如果当前用户配置过给定的OAuth提供方信息，删除该配置并标记additionalProvidersData为已修改
    if (user.additionalProvidersData[provider]) {
        delete user.additionalProvidersData[provider];
        user.markModified('additionalProvidersData');
    }

    // 保存修改过的用户信息
    user.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            // 重新建立login session以更新请求对象中的用户信息
            req.login(user, function(err) {
                if (err) {
                    return res.status(400).send(err);
                } else {
                    return res.json(user);
                }
            });
        }
    });
};
