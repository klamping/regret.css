/* jshint node:true */
var mongoose = require('mongoose');

var schema = mongoose.Schema({
    site: {
        type: String,
        required: true
    },
    status: String,
    data: String,
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Site', schema);