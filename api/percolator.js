/*jshint node:true*/
var Percolator = require('percolator').Percolator;
var CRUDCollection = require('percolator').CRUDCollection;
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017');

var db = mongoose.connection;

var schema = {
    description: 'A site is referenced by pages.',
    type: 'object',
    properties: {
        name: {
            title: 'name',
            type: 'string',
            required: true
        }
    }
};

var pageSchema = mongoose.Schema({
    name: String
});

var Page = mongoose.model('Page', pageSchema);


var linkCollection = new CRUDCollection({

    schema: schema,

    create: function(req, res, obj, cb) {
        Page.insert(obj, function(err, id) {
            if (err) {
                return res.status.internalServerError(err);
            }
            cb();
        });
    },

    update: function(req, res, id, obj, cb) {
        Page.update(id, obj, function(err) {
            if (err) {
                return res.status.internalServerError(err);
            }
            cb();
        });
    },

    destroy: function(req, res, id, cb) {
        Page.remove(id, function(err) {
            if (err) {
                return res.status.internalServerError(err);
            }
            cb();
        });
    },

    list: function(req, res, cb) {
        Page.find(function(err, objects) {
            return cb(err, objects);
        });
    },

    fetch: function(req, res, cb) {
        Page.findById(req.uri.child(), function(err, foundObject) {
            if (err) {
                if (err === 'Not Found') {
                    return cb(true);
                }
                return res.status.internalServerError(err);
            }
            cb(null, foundObject);
        });
    }

});

var app = {
    port: 3001
};
var server = new Percolator(app);

server.route('/links', linkCollection.handler);
server.route('/links/:id', linkCollection.wildcard);

server.listen(function() {
    console.log(server.server.router.routes);
    console.log('Listening on port ', app.port);
});