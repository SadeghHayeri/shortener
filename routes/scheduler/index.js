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

router.post('/store', authorize('ADMIN'), async (req, res, next) => {
    try {
        await analyticsApp.storeOnlineStats();
        res.status(HttpStatus.OK).send('ok');
    } catch (error) {
        next(error);
    }
});

module.exports = router;