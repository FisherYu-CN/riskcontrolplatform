'use strict';

// Setting up route
angular.module('articles').config(['$stateProvider',
    function ($stateProvider) {

        // Articles state routing
        $stateProvider
            .state('portal.articles', {
                url: '/articles',
                template: '<ui-view/>',
                redirectTo: 'portal.articles.list'
            })
            .state('portal.articles.list', {
                url: '',
                templateUrl: 'modules/articles/client/views/list-articles.client.view.html'
            })
            .state('portal.articles.create', {
                url: '/create',
                templateUrl: 'modules/articles/client/views/create-article.client.view.html',
                data: {
                    roles: ['user', 'admin']
                }
            })
            .state('portal.articles.view', {
                url: '/:articleId',
                templateUrl: 'modules/articles/client/views/view-article.client.view.html'
            })
            .state('portal.articles.edit', {
                url: '/:articleId/edit',
                templateUrl: 'modules/articles/client/views/edit-article.client.view.html',
                data: {
                    roles: ['user', 'admin']
                }
            });
    }
]);
