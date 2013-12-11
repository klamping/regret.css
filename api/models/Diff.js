/**
 * Capture
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {
    attributes: {
        captures: {
            type: 'array',
            required: true
        },
        status: 'string',
        data: 'json'
    }
};
