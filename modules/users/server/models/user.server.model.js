'use strict';

// 定义模块依赖
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    crypto = require('crypto'),
    validator = require('validator');

/**
 * 对于使用本地策略的用户账户，验证其属性（字符串或数组）值的是否非空
 * 对于使用其他策略新建的用户账户，不验证其属性值，直接通过验证
 *
 * @param {(string | Array)} property 用户对象的属性值
 * @return {boolean} 验证通过返回true，验证失败或对象属性不为字符串及数组类型则返回false
 */
var validateLocalStrategyProperty = function(property) {
    return ((this.provider !== 'local' && !this.updated) || property.length);
};

/**
 * 对于使用本地策略的用户账户，验证其密码属性值的长度是否不小于6位
 * 对于使用其他策略的用户账户，不验证其属性值，直接通过验证
 *
 * @param {string} password 用户对象的密码
 * @return {boolean} 验证通过返回true，验证失败则返回false
 */
var validateLocalStrategyPassword = function(password) {
    return (this.provider !== 'local' || validator.isLength(password, 6));
};

/**
 * 对于使用本地策略的用户账户，验证属性值是否为合法的email格式
 * 对于使用其他策略新建的用户账户，不验证其属性值，直接通过验证
 *
 * @param {string} email 用户对象的电子邮件
 * @return {boolean} 验证通过返回true，验证失败则返回false
 */
var validateLocalStrategyEmail = function(email) {
    return ((this.provider !== 'local' && !this.updated) || validator.isEmail(email));
};

/**
 * 对于使用本地策略的用户账户，验证属性值是否为合法的手机号码
 * 对于使用其他策略新建的用户账户，不验证其属性值，直接通过验证
 *
 * @param {string} mobile 用户对象的手机号码
 * @return {boolean} 验证通过返回true，验证失败则返回false
 */
var validateLocalStrategyMobile = function(mobile) {
    return ((this.provider !== 'local' && !this.updated) || validator.isMobilePhone(mobile, 'zh-CN'));
};

// 定义用户对象的schema
var UserSchema = new Schema({
    // 姓名
    name: {
        type: String,
        trim: true,
        default: '',
        validate: [validateLocalStrategyProperty, 'Please fill in your name']
    },
    // 公司名
    companyName: {
        type: String,
        trim: true,
        default: '',
        validate: [validateLocalStrategyProperty, 'Please fill in your company name']
    },
    // 用户名
    username: {
        type: String,
        unique: 'Username already exists',
        required: 'Please fill in a username',
        lowercase: true,
        trim: true
    },
    // 密码
    password: {
        type: String,
        default: '',
        validate: [validateLocalStrategyPassword, 'Password should be at least 6 bits long']
    },
    // 加密用的salt值
    salt: {
        type: String
    },
    // 电子邮件地址
    email: {
        type: String,
        unique: 'Email address has already been used',
        lowercase: true,
        trim: true,
        default: '',
        validate: [validateLocalStrategyEmail, 'Please fill a valid email address']
    },
    // 手机号
    mobile: {
        type: String,
        trim: true,
        default: '',
        validate: [validateLocalStrategyMobile, 'Please fill a valid mobile phone number']
    },
    // 头像图片地址
    profileImageURL: {
        type: String,
        default: 'modules/users/client/img/profile/default.png'
    },
    // 登录提供方名称
    provider: {
        type: String,
        required: 'Provider is required'
    },
    // 登录提供方数据
    providerData: {},
    // 其他辅助登录提供方数据
    additionalProvidersData: {},
    // 角色
    roles: {
        type: [{
            type: String,
            enum: ['user', 'admin']
        }],
        default: ['user'],
        required: 'Please provide at least one role'
    },
    // 更新时间
    updated: {
        type: Date
    },
    // 创建时间
    created: {
        type: Date,
        default: Date.now
    },
    // 重置密码令牌
    resetPasswordToken: {
        type: String
    },
    // 重置密码令牌过期时间
    resetPasswordExpires: {
        type: Date
    }
});

// 在保存对象前，加密明文密码
UserSchema.pre('save', function (next) {
    if (this.password && this.isModified('password') && this.password.length >= 6) {
        this.salt = crypto.randomBytes(16).toString('base64');
        this.password = this.hashPassword(this.password);
    }
    next();
});

/**
 * 加密密码
 *
 * @param {string} password 明文密码
 * @return {string} 若明文密码与salt值已提供，返回加密后的密文密码，否则返回原明文密码
 */
UserSchema.methods.hashPassword = function (password) {
    if (this.salt && password) {
        return crypto.pbkdf2Sync(password, new Buffer(this.salt, 'base64'), 10000, 64).toString('base64');
    } else {
        return password;
    }
};

/**
 * 验证密码正确性
 *
 * @param {string} password 明文密码
 * @return {boolean} 验证通过返回true，验证失败则返回false
 */
UserSchema.methods.authenticate = function (password) {
  return this.password === this.hashPassword(password);
};

/**
 * 查找唯一的用户名
 *
 * @param {string} username 基本用户名
 * @param {number} suffix 后缀
 * @param {Function} callback 找到唯一的用户名后调用的回调方法
 */
UserSchema.statics.findUniqueUsername = function (username, suffix, callback) {
    var _this = this;
    var possibleUsername = username.toLowerCase() + (suffix || '');

    _this.findOne({
        username: possibleUsername
    }, function (err, user) {
        if (!err) {
            if (!user) {
                // 找到可用的用户名，调用回调方法
                callback(possibleUsername);
            } else {
                // 后缀名+1，递归调用直至找到可用的用户名
                return _this.findUniqueUsername(username, (suffix || 0) + 1, callback);
            }
        } else {
            callback(null);
        }
    });
};

mongoose.model('User', UserSchema);
