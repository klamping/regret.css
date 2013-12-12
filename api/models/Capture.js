/**
 * Capture
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

var capture = require('Capture');

module.exports = {
    attributes: {
        page: {
            type: 'integer',
            required: true
        },
        status: 'string',
        startTime: 'datetime',
        finishTime: 'datetime',
        data: 'json'
    },

    // Lifecycle Callbacks
    afterCreate: function(values, next) {
        console.log('after', values);
        capture('http://localhost:9000', { out: './shots/' }, function (err) {
            console.log(err);
            values.status = 'completed';
            values.finishTime = new Date();
            values.data = {
                path: '/shots/localhost/index.png'
            };
            next();
        });
    }
};
