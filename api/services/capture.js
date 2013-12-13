/* jshint node:true */
var _ = require('lodash');
var Capture = require('../models/Capture.js');

var capture = require('Capture');

function capturePage (url, cb) {
    console.log('Capturing: ' + url);

    capture([url], { out: './shots/' }, function (err) {
        if (err) {
            console.log(err);
        }

        cb('Pages captured');
    });
}


var captureService = {
    // Return name/id of all Captures
    find: function(params, callback) {
        Capture.find(params.query, 'site date status', function (err, data) {
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
        }, function (err, data) {
            capturePage(data.url, callback);
        });
    }
};

module.exports = captureService;