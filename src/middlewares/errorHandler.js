const HttpStatus = require('http-status-codes');
const codeStrings = require('../config/codeStrings');

function errorHandler(err, req, res, next) {
    if (err.message) {
        return res.status(400).json({status: 'ERR', message: err.message});
    }
    return res.status(500).json({status: 'ERR', message: codeStrings.UNKNOWN_ERROR});
}

module.exports = errorHandler;