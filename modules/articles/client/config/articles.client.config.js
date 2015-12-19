'use strict';

// Configuring the Articles module
angular.module('articles').run(['Menus',
    function (Menus) {
        // Add the articles dropdown item
        Menus.addMenuItem('sidebar', {
            title: 'Articles',
            state: 'articles',
            type: 'dropdown',
            class: 'fa-pencil',
            roles: ['*']
        });

        // Add the dropdown list item
        Menus.addSubMenuItem('sidebar', 'articles', {
            title: 'List Articles',
            state: 'articles.list'
        });

        // Add the dropdown create item
        Menus.addSubMenuItem('sidebar', 'articles', {
            title: 'Create Articles',
            state: 'articles.create',
            roles: ['user']
        });
    }
]);
