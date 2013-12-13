/* jshint node:true */
var mongoose = require('mongoose');

var schema = mongoose.Schema({
    url: {
        type: String,
        required: true
    },
    status: String,
    data: String,
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Capture', schema);