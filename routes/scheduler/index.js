const express = require('express');
const analyticsApp = require('../../application/analytics');
const HttpStatus = require('http-status-codes');
const authorize = require('../../middlewares/authorize');

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