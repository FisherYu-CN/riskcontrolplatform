(function() {
    'use strict';

    // 为socket.io创建一个mock对象, 其主要功能通过chat模块
    // 中controller相关用例进行测试
    window.io = function() {

        this.cbs = {};

        this.on = function(msg, cb) {
            this.cbs[msg] = cb;
        };

        this.emit = function(msg, data) {
            this.cbs[msg](data);
        };

        this.removeListener = function(msg) {
            delete this.cbs[msg];
        };

        this.connect = function() {
            this.socket = {};
        };

        return this;
    };
})();
