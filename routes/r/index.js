const express = require('express');
const shortenerApp = require('../../application/shortener');
const analyticsApp = require('../../application/analytics');
const HttpStatus = require('http-status-codes');
const authorize = require('../../middlewares/authorize');
const {ROLES} = require('../../config/enums');
const codeStrings = require('../../config/codeStrings');
const { param, check, validationResult } = require('express-validator');
const browser = require('browser-detect');

const router = express.Router();

router.get('/:path', param('path').isAlpha().isLength({min: 10, max:10}), async (req, res, next) => {
    try {
        const link = await shortenerApp.getLinkByPath(req.params.path);

        const browserAgent = browser(req.headers['user-agent']);
        analyticsApp.addView(
            link.id,
            browserAgent.name || 'UNKNOWN',
            browserAgent.mobile ? 'MOBILE' : 'DESKTOP'
        );

        res.redirect(link.url);
    } catch (error) {
        if (error.message === codeStrings.LINK_NOT_FOUND) {
            res.send('404 - PAGE NOT FOUND!');
        }
    }
});

module.exports = router;