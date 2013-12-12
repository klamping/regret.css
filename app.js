/* jshint node:true */
var feathers = require('feathers');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017');

var site = require('./api/services/site.js');

feathers()
    .configure(feathers.socketio())
    .use(feathers.static(__dirname + '/public'))
    .use('/sites', site)
    .listen(8000);