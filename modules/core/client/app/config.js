'use strict';

/**
 * 初始化平台的全局应用配置管理对象，所有其他模块统一通过本对象注册其模块及依赖
 *
 * @return {Object} 应用配置对象
 */
var ApplicationConfiguration = (function () {
    // 初始化全局应用模块相关参数，包括模块名称与依赖的其他模块
    var applicationModuleName = 'rcp';
    var applicationModuleVendorDependencies = ['ngResource', 'ngAnimate', 'ngMessages', 'ui.router', 'ui.bootstrap', 'ui.utils', 'angularFileUpload'];

    /**
     * 注册一个垂直模块
     *
     * @param {string} moduleName 新模块名称
     * @param {Array} dependencies 新模块锁依赖的其他模块的名称数组
     */
    var registerModule = function (moduleName, dependencies) {
        // 注册模块并将本模块添加到全局模块依赖模块的数组中
        angular.module(moduleName, dependencies || []);
        angular.module(applicationModuleName).requires.push(moduleName);
    };

    return {
        applicationModuleName: applicationModuleName,
        applicationModuleVendorDependencies: applicationModuleVendorDependencies,
        registerModule: registerModule
    };
})();
