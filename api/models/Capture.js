/**
 * Capture
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

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
    }
};
