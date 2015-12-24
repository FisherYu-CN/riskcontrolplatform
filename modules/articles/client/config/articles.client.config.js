'use strict';

// Configuring the Articles module
angular.module('articles').run(['Menus',
    function (Menus) {
        // Add the articles dropdown item
        Menus.addMenuItem('sidebar', {
            title: 'Articles',
            state: 'portal.articles',
            type: 'dropdown',
            class: 'fa-pencil',
            roles: ['*'],
            position: 1
        });

        // Add the dropdown list item
        Menus.addSubMenuItem('sidebar', 'portal.articles', {
            title: 'List Articles',
            state: 'portal.articles.list'
        });

        // Add the dropdown create item
        Menus.addSubMenuItem('sidebar', 'portal.articles', {
            title: 'Create Articles',
            state: 'portal.articles.create',
            roles: ['user']
        });
    }
]);
