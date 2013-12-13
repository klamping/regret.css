var socket = io.connect('http://localhost:8000/');

angular.module('regret', ['ngRoute', 'ngResource'])
    .config(function($routeProvider, $locationProvider) {
        // $locationProvider.html5Mode(true);

        $routeProvider
            .when('/', {
                templateUrl:'/views/main.html'
            })
            .when('/site/new', {
                controller:'SiteCreateCtrl',
                templateUrl:'/views/new-site.html'
            })
            .when('/site/:id', {
                controller:'SiteCtrl',
                templateUrl:'/views/site.html'
            })
            .otherwise({
                redirectTo:'/'
            });
    })
    .run(function() {
        console.log('running app');
    })
    .service('SitesSvc', function ($resource) {

        var apiPath = '/api/sites/:id/';
        var sites = $resource(apiPath, {
                id: '@id'
            }, {
                listing: {
                    method: 'GET'
                },
                create: {
                    method: 'POST'
                },
                retrieve: {
                    method: 'GET'
                },
                update: {
                    method: 'PUT'
                }
            });

        return sites;
    })
    .controller('SiteCtrl', function ($scope, SitesSvc, $location, $routeParams) {
        var id = $routeParams.id;
        var loadSite = function () {
            SitesSvc.retrieve({ id: id }).$promise.then(function (data) {
                $scope.site = data.site;
            });
        };

        $scope.deleteSite = function () {
            SitesSvc.delete({ id: id }).$promise.then(function () {
                $scope.site = null;
                $location.path('/');
            });
        };

        loadSite();
    })
    .controller('SiteCreateCtrl', function ($scope, SitesSvc, $location) {
        $scope.createSite = function () {
            var data = {
                name: $scope.name,
                urls: $scope.urls
            };

            SitesSvc.create(data).$promise.then(function (data) {
                $location.path('/site/' + data._id);
            });
        };
    })
    .directive('sitesNav', function () {
        return {
            restrict: 'E',
            templateUrl: '/views/sites-nav.html',
            controller: function ($scope, SitesSvc) {
                $scope.loadSites = function () {
                    SitesSvc.listing().$promise.then(function (data) {
                        $scope.sites = data.sites;
                    });
                };
            },
            link: function ($scope) {
                // TODO hook into socket.io to automatically update
                $scope.loadSites();

                // update list on creation/remove
                socket.on('api/sites removed', $scope.loadSites);
                socket.on('api/sites created', $scope.loadSites);
            }
        };
    });