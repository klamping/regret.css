/* jshint node:true */
var feathers = require('feathers');
var mongoose = require('mongoose');
var _ = require('lodash');

mongoose.connect('mongodb://localhost:27017');

var site = require('./api/services/site.js');
var capture = require('./api/services/capture.js');

var captureSite = function (req, res) {
    site.get(req.params.id, {}, function (err, siteInfo) {
        _.each(siteInfo.site.children, function (page) {
            capture.create({
                url: page.url
            }, null, function (err) {
                if (err) {
                    console.log(err);
                }
                console.log('Site Captured');
            });
        });

        res.send('hello world');
    });
};


feathers()
    .configure(feathers.socketio())
    .use(feathers.static(__dirname + '/public'))
    .use('/api/sites', site)
    .use('/api/capture', capture)
    .get('/api/site/capture/:id', captureSite)
    .listen(8000);