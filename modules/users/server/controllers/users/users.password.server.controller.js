'use strict';

// 定义模块依赖
var path = require('path'),
    config = require(path.resolve('./config/config')),
    errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    nodemailer = require('nodemailer'),
    async = require('async'),
    crypto = require('crypto');

var smtpTransport = nodemailer.createTransport(config.mailer.options);

/**
 * 忘记密码(POST)
 *
 * @param {Object} req 用户发起的HTTP请求
 * @param {Object} res 用户得到的HTTP响应
 * @param {Function} next 下一步处理回调
 */
exports.forgot = function(req, res, next) {

    async.waterfall([
        // 步骤一：生成随机令牌
        function(done) {
            crypto.randomBytes(20, function(err, buffer) {
                var token = buffer.toString('hex');
                done(err, token);
            });
        },
        // 步骤二：根据用户名查找用户
        function(token, done) {
            if (req.body.username) {
                User.findOne(
                    {username: req.body.username.toLowerCase()},
                    '-salt -password',
                    function(err, user) {
                        if (!user) {
                            return res.status(400).send({
                                message: 'No account with that username has been found'
                            });
                        } else if (user.provider !== 'local') {
                            return res.status(400).send({
                                message: 'It seems like you signed up using your ' + user.provider + ' account'
                            });
                        } else {
                            // 为用户设置重置密码令牌并默认1小时后过期
                            user.resetPasswordToken = token;
                            user.resetPasswordExpires = Date.now() + 3600000;

                            user.save(function(err) {
                                done(err, token, user);
                            });
                        }
                    });
            } else {
                return res.status(400).send({
                    message: 'Username field must not be blank'
                });
            }
        },
        // 步骤三：渲染模板邮件
        function(token, user, done) {
            res.render(path.resolve('modules/users/server/templates/reset-password-email'), {
                name: user.name,
                appName: config.app.title,
                url: 'http://' + req.headers.host + '/api/auth/reset/' + token
            }, function(err, emailHTML) {
                done(err, emailHTML, user);
            });
        },
        // 步骤四：发送重置密码邮件
        function(emailHTML, user, done) {
            var mailOptions = {
                to: user.email,
                from: config.mailer.from,
                subject: 'Password Reset',
                html: emailHTML
            };
            // 发送邮件
            smtpTransport.sendMail(mailOptions, function(err) {
                if (!err) {
                    res.send({
                        message: 'An email has been sent to the provided email with further instructions.'
                    });
                } else {
                    return res.status(400).send({
                        message: 'Failure sending email'
                    });
                }
                done(err);
            });
        }
    ], function(err) {
        if (err) {
            return next(err);
        }
    });
};

/**
 * 通过邮件重置密码的令牌验证(GET)
 *
 * @param {Object} req 用户发起的HTTP请求
 * @param {Object} res 用户得到的HTTP响应
 */
exports.validateResetToken = function(req, res) {
    User.findOne({
        resetPasswordToken: req.params.token,
        resetPasswordExpires: {
            $gt: Date.now()
        }
    }, function(err, user) {
        // 验证失败，跳转到非法令牌页面
        if (!user) {
            return res.redirect('/password/reset/invalid');
        }
        // 跳转到密码重置页面
        res.redirect('/password/reset/' + req.params.token);
    });
};

/**
 * 通过邮件重置密码(POST)
 *
 * @param {Object} req 用户发起的HTTP请求
 * @param {Object} res 用户得到的HTTP响应
 * @param {Function} next 下一步处理回调
 */
exports.reset = function(req, res, next) {

    async.waterfall([
        // 步骤一：验证并重置密码
        function(done) {
            User.findOne({
                resetPasswordToken: req.params.token,
                resetPasswordExpires: {
                    $gt: Date.now()
                }
            }, function(err, user) {
                if (!err && user) {
                    if (req.body.newPassword === req.body.verifyPassword) {
                        user.password = req.body.newPassword;
                        user.resetPasswordToken = undefined;
                        user.resetPasswordExpires = undefined;

                        user.save(function(err) {
                            if (err) {
                                return res.status(400).send({
                                    message: errorHandler.getErrorMessage(err)
                                });
                            } else {
                                // 登录前删除密码/salt等敏感数据
                                user.password = undefined;
                                user.salt = undefined;
                                // 调用Passport的login函数来建立login session
                                req.login(user, function(err) {
                                    if (err) {
                                        res.status(400).send(err);
                                    } else {
                                        res.json(user);
                                        done(err, user);
                                    }
                                });
                            }
                        });
                    } else {
                        return res.status(400).send({
                            message: 'Passwords do not match'
                        });
                    }
                } else {
                    return res.status(400).send({
                        message: 'Password reset token is invalid or has expired.'
                    });
                }
            });
        },
        // 步骤二：渲染密码重置确认邮件
        function(user, done) {
            res.render('modules/users/server/templates/reset-password-confirm-email', {
                name: user.displayName,
                appName: config.app.title
            }, function(err, emailHTML) {
                done(err, emailHTML, user);
            });
        },
        // 步骤三：发送密码重置确认邮件
        function(emailHTML, user, done) {
            var mailOptions = {
                to: user.email,
                from: config.mailer.from,
                subject: 'Your password has been changed',
                html: emailHTML
            };

            smtpTransport.sendMail(mailOptions, function(err) {
                done(err, 'done');
            });
        }
    ], function(err) {
        if (err) {
            return next(err);
        }
    });
};

/**
 * 修改密码
 *
 * @param {Object} req 用户发起的HTTP请求
 * @param {Object} res 用户得到的HTTP响应
 */
exports.changePassword = function(req, res) {

    // 检查用户是否登录
    if (req.user) {
        // 检查用户是否设定了新的密码
        if (req.body.newPassword) {
            User.findById(req.user.id, function(err, user) {
                // 检查用户是否存在
                if (!err && user) {
                    // 检查旧密码是否正确
                    if (user.authenticate(req.body.currentPassword)) {
                        // 检查新密码和确认密码是否一致
                        if (req.body.newPassword === req.body.verifyPassword) {
                            user.password = req.body.newPassword;
                            user.save(function(err) {
                                if (err) {
                                    return res.status(400).send({
                                        message: errorHandler.getErrorMessage(err)
                                    });
                                } else {
                                    // 登录前删除密码/salt等敏感数据
                                    user.password = undefined;
                                    user.salt = undefined;
                                    // 调用Passport的login函数来建立login session
                                    req.login(user, function(err) {
                                        if (err) {
                                            res.status(400).send(err);
                                        } else {
                                            res.send({
                                                message: 'Password changed successfully'
                                            });
                                        }
                                    });
                                }
                            });
                        } else {
                            res.status(400).send({
                                message: 'Passwords do not match'
                            });
                        }
                    } else {
                        res.status(400).send({
                            message: 'Current password is incorrect'
                        });
                    }
                } else {
                    res.status(400).send({
                        message: 'User is not found'
                    });
                }
            });
        } else {
            res.status(400).send({
                message: 'Please provide a new password'
            });
        }
    } else {
        res.status(400).send({
            message: 'User is not signed in'
        });
    }
};
