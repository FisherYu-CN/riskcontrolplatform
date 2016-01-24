'use strict';

// Setting up route
angular.module('users').config(['$stateProvider',
    function ($stateProvider) {
        // Users state routing
        $stateProvider
            .state('portal.users', {
                url: '/users',
                template: '<ui-view/>',
                redirectTo: 'portal.users.profile',
                data: {
                    roles: ['user']
                }
            })
            .state('portal.users.profile', {
                url: '/profile',
                templateUrl: 'modules/users/client/views/settings/edit-profile.client.view.html'
            })
            .state('portal.users.password', {
                url: '/password',
                templateUrl: 'modules/users/client/views/settings/change-password.client.view.html'
            })
            .state('portal.users.picture', {
                url: '/picture',
                templateUrl: 'modules/users/client/views/settings/change-profile-picture.client.view.html'
            })
            .state('signup', {
                url: '/signup',
                templateUrl: 'modules/users/client/views/authentication/signup.client.view.html',
                data: {
                    specialClass: 'gray-bg'
                }
            })
            .state('signin', {
                url: '/signin',
                templateUrl: 'modules/users/client/views/authentication/signin.client.view.html',
                data: {
                    specialClass: 'gray-bg'
                }
            })
            .state('password', {
                url: '/password',
                template: '<ui-view/>',
                redirectTo: 'password.forgot',
                data: {
                    specialClass: 'gray-bg',
                    ignoreState: true
                }
            })
            .state('password.forgot', {
                url: '/forgot',
                templateUrl: 'modules/users/client/views/password/forgot-password.client.view.html'
            })
            .state('password.reset', {
                url: '/reset',
                template: '<ui-view/>'
            })
            .state('password.reset.invalid', {
                url: '/invalid',
                templateUrl: 'modules/users/client/views/password/reset-password-invalid.client.view.html'
            })
            .state('password.reset.success', {
                url: '/success',
                templateUrl: 'modules/users/client/views/password/reset-password-success.client.view.html'
            })
            .state('password.reset.form', {
                url: '/:token',
                templateUrl: 'modules/users/client/views/password/reset-password.client.view.html'
            });
    }
]);
