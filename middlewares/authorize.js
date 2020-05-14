const expressJwt = require('express-jwt');
const {jwt} = require('../config/secrets');
const HttpStatus = require('http-status-codes');
const codeStrings = require('../config/codeStrings');

function authorize(roles = []) {
    if (typeof roles === 'string') {
        roles = [roles];
    }

    return [
        expressJwt({secret: jwt.secret}), // TODO: Specify jwt algorithms (security)

        (req, res, next) => {
            if (roles.length && !roles.includes(req.user.role)) {
                return res.status(HttpStatus.FORBIDDEN).json({codeString: codeStrings.FORBIDDEN_ERROR});
            }
            next();
        }
    ];
}

module.exports = authorize;
