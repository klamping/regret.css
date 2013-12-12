/* jshint node:true */
var feathers = require('feathers');

var siteService = {
    sites: [],

    // Return all todos from this service
    find: function(params, callback) {
        callback(null, this.sites);
    },

    // Create a new Todo with the given data
    create: function(data, params, callback) {
        data.id = this.sites.length;
        this.sites.push(data);

        callback(null, data);
    }
};

feathers()
    .configure(feathers.socketio())
    .use('/sites', siteService)
    .listen(8000);