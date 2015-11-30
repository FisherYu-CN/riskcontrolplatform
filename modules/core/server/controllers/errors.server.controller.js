'use strict';

/**
 * 通过MongoDB唯一性（重复键值）错误，构造相应的本地化错误信息
 *
 * @param {Object} err MongoDB返回的错误对象
 * @returns {string} 本地化的唯一性错误信息
 */
var getUniqueErrorMessage = function (err) {
    var output = '';

    try {
        // 从MongoDB的错误信息中取出字段名称并构造相应信息，源错误信息通常符合以下模板：
        // E11000 duplicate key error index: rcp.<collection>.$_<field>_  dup key: { : 1.0 }
        var fieldName = err.errmsg.substring(err.errmsg.lastIndexOf('.$') + 2, err.errmsg.lastIndexOf('_1'));
        output = fieldName.charAt(0).toUpperCase() + fieldName.slice(1) + ' already exists';
    } catch (ex) {
        output = 'Unique field already exists';
    }

    return output;
};

/**
 * 从MongoDB返回的错误对象中获取错误信息
 *
 * @param {Object} err MongoDB返回的错误对象
 * @return {string} 错误信息
 */
exports.getErrorMessage = function (err) {
    var message = '';

    if (err.code) {
        // 错误代码11000与11001均为MongoDB唯一性错误
        switch (err.code) {
            case 11000:
            case 11001:
                message = getUniqueErrorMessage(err);
                break;
            default:
                message = 'Something went wrong';
        }
    } else {
        for (var errName in err.errors) {
            if (err.errors[errName].message) {
                message = err.errors[errName].message;
            }
        }
    }

    return message;
};
