/*globals dpd:false*/
angular.module('regret', [
    'ui.router',
    'regret.sites'
])
.config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/sites-ui');

    $stateProvider
    .state('sites', {
        url: '/sites-ui',
        templateUrl: 'app/sites/sites.tpl.html',
        controller: 'Sites',
        resolve: {
            sites: function ($q) {
                var deferred = $q.defer();

                dpd.sites.get(function (sites) {
                    deferred.resolve(sites);
                });

                return deferred.promise;
            }
        }
    })
    .state('sites.site', {
        url: '/site/:id',
        templateUrl: 'app/sites/site.tpl.html',
        controller: 'Site',
        resolve: {
            site: function ($q, $stateParams) {
                var deferred = $q.defer();

                dpd.sites.get($stateParams.id, function (site) {
                    deferred.resolve(site);
                });

                return deferred.promise;
            }
        }
    })
    .state('sites.create', {
        url: '/create',
        templateUrl: 'app/sites/create.tpl.html',
        controller: 'Create'
    });
});