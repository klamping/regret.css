/* jshint node:true */
var _ = require('lodash');
var Site = require('../models/Site.js');

var siteService = {
    // Return name/id of all sites
    find: function(params, callback) {
        Site.find(params.query, 'name', function (err, data) {
            data = {
                'sites': data
            };
            callback(err, data);
        });
    },

    // gets details of a specific site
    get: function(id, params, callback) {
        Site.findById(id, function (err, data) {
            data = {
                'site': data
            };
            callback(err, data);
        });
    },

    update: function(id, data, params, callback) {
        Site.findByIdAndUpdate(id, data, callback);
    },

    remove: function(id, params, callback) {
        Site.findByIdAndRemove(id, callback);
    },

    // Create a new Site with the given data
    create: function(data, params, callback) {
        var siteData = _.isEmpty(data) ? params : data;

        var urls = siteData.urls.split(',');

        var pages = [];

        _.each(urls, function (url) {
            pages.push({ 'url': url });
        });

        Site.create({
            name: siteData.name,
            children: pages
        }, callback);
    }
};

module.exports = siteService;