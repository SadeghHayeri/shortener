const jwt = require('jsonwebtoken');
const {jwt: jwtConfig} = require('../config/secrets');
const HttpStatus = require('http-status-codes');
const codeStrings = require('../config/codeStrings');

function authorize(roles = []) {
    if (typeof roles === 'string') {
        roles = [roles];
    }

    return [
        async (req, res, next) => {
            const {jwt: token} = req.body;
            try {
                req.user = await jwt.verify(token, jwtConfig.secret, jwtConfig.options);
                next();
            } catch (error) {
                next(new Error(codeStrings.AUTHENTICATION_FAILED))
            }
        },

        (req, res, next) => {
            if (roles.length && !roles.includes(req.user.role)) {
                return res.status(HttpStatus.FORBIDDEN).json({codeString: codeStrings.FORBIDDEN});
            }
            next();
        }
    ];
}

module.exports = authorize;
