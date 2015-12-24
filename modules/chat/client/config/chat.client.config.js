'use strict';

// Configuring the Chat module
angular.module('chat').run(['Menus',
    function (Menus) {
        // Set side bar menu items
        Menus.addMenuItem('sidebar', {
            title: 'Chat',
            state: 'chat',
            position: 2
        });
    }
]);
