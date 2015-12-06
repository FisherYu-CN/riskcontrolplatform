'use strict';

// Socket服务，主要包装了Socket.io库的基本功能
angular.module('core').service('Socket', ['Authentication', '$state', '$timeout',
    function (Authentication, $state, $timeout) {

        /**
         * 连接到Socket服务器，只允许已登录用户调用
         */
        this.connect = function () {
            if (Authentication.user) {
                this.socket = io();
            }
        };

        // 直接调用方法连接到Socket服务器
        this.connect();

        /**
         * 包装Socket的on方法，主要负责监听特定事件并执行回调函数
         *
         * @param {string} eventName 事件名称
         * @param {Function} callback 回调函数
         */
        this.on = function (eventName, callback) {
            if (this.socket) {
                this.socket.on(eventName, function (data) {
                    // 此处使用$timeout服务调用回调函数，是为了在
                    // 回调函数执行完成后确保会调用$apply()方法来更新页面
                    $timeout(function () {
                        callback(data);
                    });
                });
            }
        };

        /**
         * 包装Socket的emit方法，主要负责给所有客户端广播一个事件及消息数据
         *
         * @param {string} eventName 事件名称
         * @param {Object} data 消息数据
         */
        this.emit = function (eventName, data) {
            if (this.socket) {
                this.socket.emit(eventName, data);
            }
        };

        /**
         * 包装Socket的removeListener方法，主要负责删除针对特定事件的监听器
         *
         * @param {string} eventName 事件名称
         */
        this.removeListener = function (eventName) {
            if (this.socket) {
                this.socket.removeListener(eventName);
            }
        };
    }
]);
