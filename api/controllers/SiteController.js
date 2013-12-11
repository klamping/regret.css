/**
 * SiteController
 *
 * @module      :: Controller
 * @description	:: A set of functions called `actions`.
 *
 *                 Actions contain code telling Sails how to respond to a certain type of request.
 *                 (i.e. do stuff, then send some JSON, show an HTML page, or redirect to another URL)
 *
 *                 You can configure the blueprint URLs which trigger these actions (`config/controllers.js`)
 *                 and/or override them with custom routes (`config/routes.js`)
 *
 *                 NOTE: The code you write here supports both HTTP and Socket.io automatically.
 *
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

var _ = require('lodash');

var capture = require('capture');

function capturePages (urls, cb) {
    console.log('Capturing: ' + urls);

    capture(urls, { out: './test/tmp' }, function (err) {
        console.log(err);
        cb('Pages captured');
    });
}

module.exports = {
    'new': function (req, res) {
        res.view();
    },

    create: function (req, res, next) {
        var params = req.params.all();

        var siteDetails = {
            name: params.name,
            status: 'Initialized'
        };

        // convert urls to an array
        var urls = params.urls.split('\n');

        // create a site from the details and return it as the response
        Site.create(siteDetails, function siteCreated (err, site) {
            if (err) return next(err);

            var siteId = site.id;

            // once we've created our site, we need to create pages

            // create urls for each url
            _.each(urls, function (url) {
                // trim since we may have a \r leftover from the new lines
                url = url.trim();

                // create a page for each url
                Page.create({
                    'url': url,
                    'site': siteId
                }, function (err, page) {
                    if (err) return next(err);
                });
            });

            res.redirect('/site/show/' + siteId);
        });
    },

    show: function (req, res, next) {
        Site.findOne(req.param('id'), function foundSite (err, site) {
            if (err) return next(err);
            if (!site) return next();

            // get all pages for a site
            Page.find({site: site.id}, function (err, pages) {
                res.view({
                    site: site,
                    pages: pages
                });
            });
        });
    },

    capture: function (req, res) {
        Site.findOne(req.param('id'), function foundSite (err, site) {
            if (err) return next(err);
            if (!site) return next();

            // get all pages for a site
            Page.find({site: site.id}, function (err, pages) {
                var urls = _.pluck(pages, 'url');

                capturePages(urls, function () {
                    res.redirect('/site/show/' + site.id);
                });
            });
        });
    },

    /**
    * Overrides for the settings in `config/controllers.js`
    * (specific to SiteController)
    */
    _config: {}


};
