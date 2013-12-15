/* jshint node:true */
var _ = require('lodash');
var Capture = require('../models/Capture.js');

var capture = require('Capture');
var urlUtil = require('url');
var S = require('string');
var path = require('path');

function capturePage (url, cb) {
    var timestamp = Date.now();
    var outpath = '/shots/' + timestamp;

    capture([url], { out: './public' + outpath }, function (err) {
        if (err) {
            cb(err);
        }

        // TODO this is cut straight from 'capture'
        // it'd be better for capture to return the path, however...
        // capture doesn't look like it's maintained anymore
        // so the best best it to leave as is until a
        // custom screenshot tool can be built (or a better one found)
        var urlParts = urlUtil.parse(url, true),
            filename = urlParts.pathname;

        if (S(filename).endsWith('/')) {
            filename += 'index'; // Append
        }

        var filePath = path.join('/', outpath,
            urlParts.hostname.replace(/\./g, '-'),
            './' + filename + '.png');

        cb(filePath);
    });
}

var captureService = {
    // Return name/id of all Captures
    find: function(params, callback) {
        Capture.find(params.query, function (err, data) {
            data = {
                'captures': data
            };
            callback(err, data);
        });
    },

    // gets details of a specific Capture
    get: function(id, params, callback) {
        Capture.findById(id, function (err, data) {
            data = {
                'capture': data
            };
            callback(err, data);
        });
    },

    update: function(id, data, params, callback) {
        Capture.findByIdAndUpdate(id, data, callback);
    },

    remove: function(id, params, callback) {
        Capture.findByIdAndRemove(id, callback);
    },

    // Create a new Capture with the given data
    create: function(data, params, callback) {
        var CaptureData = _.isEmpty(data) ? params : data;

        Capture.create({
            url: CaptureData.url,
            status: 'Capturing'
        }, function (err, capture) {
            if (err) {
                callback(err);
            }
            capturePage(capture.url, function (response) {
                // if response was a string, something good happened
                if (typeof response == 'string') {
                    // save filepath to capture
                    capture.data = response;
                    capture.status = 'Completed';
                    capture.save(callback);
                } else {
                    callback(response);
                }
            });
        });
    }
};

module.exports = captureService;