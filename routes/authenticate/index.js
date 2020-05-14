const express = require('express');
const router = express.Router();
const authenticateApp = require('../../application/authenticate');
const HttpStatus = require('http-status-codes');
const { check, validationResult } = require('express-validator');

router.post('/', [
    check('usernameOrEmail').exists(),
    check('password').exists(),
], async (req, res) => {
    const {usernameOrEmail, password} = req.body;
    const {user, token} = await authenticateApp.authenticate(usernameOrEmail, password);
    res.status(HttpStatus.OK).json({user, token});
});

module.exports = router;
