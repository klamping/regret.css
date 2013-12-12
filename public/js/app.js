angular.module('regret', [])
    .config(function($routeProvider) {
        $routeProvider;
        // $routeProvider
        //     .when(ROUTE_PATHS.login, {
        //         templateUrl: 'views/login.html',
        //         controller: 'LoginCtrl',
        //         layout: 'sidebar',
        //         title: 'Login to Encore'
        //     });
    })
    .controller('SitesCtrl', function ($scope, SitesSvc) {
        $scope.sites = [];

        SitesSvc.listing().then(function (sites) {
            console.log(sites);
        });
    })
    .factory('SitesSvc', function ($resource) {
        var apiPath = '/sites/:id/';
        var snapshots = $resource(apiPath, {
                id: '@id'
            }, {
                create: {
                    method: 'POST',
                    params: {
                        id: '@snapshotid'
                    }
                },
                retrieve: {
                    method: 'GET',
                    params: {
                        id: '@snapshotid'
                    }
                },
                update: {
                    method: 'PUT',
                    params: {
                        id: '@snapshotid'
                    }
                },
                delete: {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    params: {
                        id: '@snapshotid'
                    }
                }
            });

        return snapshots;
    });
