const express = require('express');
const shortenerApp = require('../../application/shortener');
const analyticsApp = require('../../application/analytics');
const HttpStatus = require('http-status-codes');
const authorize = require('../../middlewares/authorize');
const {ROLES} = require('../../config/enums');
const codeStrings = require('../../config/codeStrings');
const { param, check, validationResult } = require('express-validator');
const config = require('../../config/config');

const router = express.Router();

router.post('/', [
    authorize(),
    check('url').isURL(),
], async (req, res) => {
    const {url, preferredPath} = req.body;
    const link = await shortenerApp.generateShortLink(req.user.id, url, preferredPath);
    res.status(HttpStatus.OK).json({link: `${config.baseUrl}/r/${link.path}`});
});

router.get('/', authorize(), async (req, res) => {
    const links = await shortenerApp.getAllUserLinks(req.user.id);
    res.status(HttpStatus.OK).json({links});
});

router.get('/:id/stats', [
    authorize(),
    param('id').customSanitizer(value => ObjectId(value)),
], async (req, res) => {
    const stats = await analyticsApp.getLinkStats(req.params.id);
    res.status(HttpStatus.OK).json({stats});
});

module.exports = router;