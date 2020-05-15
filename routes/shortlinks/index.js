const express = require('express');
const shortenerApp = require('../../application/shortener');
const analyticsApp = require('../../application/analytics');
const HttpStatus = require('http-status-codes');
const authorize = require('../../middlewares/authorize');
const {ROLES} = require('../../config/enums');
const codeStrings = require('../../config/codeStrings');
const { param, check, validationResult } = require('express-validator');
const config = require('../../config/config');
const ObjectId = require('bson').ObjectID;

const router = express.Router();

function _toNormalUrl(url) {
    if (url.substring(0, 4) !== 'http') {
        url = 'http://' + url;
    }
    return url;
}

router.post('/', [
    authorize(),
    check('url').isURL(),
], async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
            codeString: codeStrings.INVALID_REQUEST,
            errors: errors.array()
        });
    }

    req.body.url = _toNormalUrl(req.body.url);

    try {
        const {url, preferredPath} = req.body;
        const link = await shortenerApp.generateShortLink(req.user.id, url, preferredPath);
        res.status(HttpStatus.OK).json({link: `${config.baseUrl}/r/${link.path}`});
    } catch (error) {
        next(error);
    }
});

router.get('/', authorize(), async (req, res) => {
    const links = await shortenerApp.getAllUserLinks(req.user.id);
    res.status(HttpStatus.OK).json({links});
});

router.get('/:id/stats', [
    authorize(),
    param('id').customSanitizer(value => new ObjectId(value)),
], async (req, res) => {
    const stats = await analyticsApp.getLinkStats(req.params.id);
    res.status(HttpStatus.OK).json({stats});
});

module.exports = router;