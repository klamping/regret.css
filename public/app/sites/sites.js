/*globals dpd:false,alert:false,imagediff:false*/
angular.module('regret.sites', [])
.controller('Sites', function ($scope, sites) {
    $scope.sites = sites;
})
.controller('Site', function ($scope, $state, site) {
    $scope.site = site;

    $scope.delete = function () {
        dpd.sites.del(site.id, function () {
            // remove site from local copy of sites
            $scope.sites = _.reject($scope.sites, { id: site.id });

            // cleanup all captures for the site


            // go to main page
            $state.go('sites');
        });
    };

    $scope.capture = function (page) {
        var fullUrl = site.url + page.path;

        dpd.capture.post({
            url: fullUrl
        }, function (capture, error) {
            if (!error) {
                console.log(capture);
            } else {
                console.log(error);
            }
        });
    };

    $scope.viewCaptures = function (index) {
        var page = $scope.site.pages[index];

        dpd.captures.get({ 'url': site.url + page.path }, function (captures) {
            $scope.site.pages[index].captures = captures;
            $scope.$digest();
        });
    };

    $scope.accept = function (capture) {
        // TODO mark all before this as accepted

        dpd.captures.put(capture.id, { 'accepted': true }, function () {
            $scope.$digest();
        });
    };

    $scope.diff = function (capture) {
        // get last accepted capture
        var lastAccepted = $('.page-capture.accepted img')[0];
        var current = $('#capture-' + capture.id)[0];
        var currentImg = $(current).find('img')[0];

        var diff = imagediff.diff(currentImg, lastAccepted);

        // Now create a canvas,
        var canvas = imagediff.createCanvas(diff.width, diff.height);

        // get its context
        var context = canvas.getContext('2d');

        // and finally draw the ImageData diff.
        context.putImageData(diff, 0, 0);

        // Add the canvas element to the container.
        current.appendChild(canvas);
    };
})
.controller('Create', function ($scope, $state) {
    $scope.site = {
        pages: []
    };

    $scope.page = {};

    $scope.addPage = function () {
        $scope.site.pages.push($scope.page);
        $scope.page = {};
        $('#page-name').focus();
    };

    $scope.removePage = function (index) {
        $scope.site.pages.splice(index, 1);
        $('#page-name').focus();
    };

    $scope.create = function () {
        var site = angular.copy($scope.site);

        dpd.sites.post(site, function (site, error) {
            if (!error) {
                $scope.sites.push(site);
                $state.go('sites.site', { id: site.id });
            } else {
                alert(error);
            }
        });
    };
});