/* jshint node:true */

var mongoose = require('mongoose');

var pageSchema = mongoose.Schema({
    url: {
        type: String,
        required: true
    }
});

var siteSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    children: [pageSchema]
});

module.exports = mongoose.model('Site', siteSchema);