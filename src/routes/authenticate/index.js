const express = require('express');
const userApp = require('../../application/user');
const HttpStatus = require('http-status-codes');

const router = express.Router();

router.post('/store', async (req, res, next) => {
    try {
        const {username, email, password} = req.body;
        const {user, token} = await userApp.authenticate(username, email, password);
        res.status(HttpStatus.OK).json({user, token});
    } catch (error) {
        next(error);
    }
});

module.exports = router;
