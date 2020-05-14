const express = require('express');
const router = express.Router();
const userApp = require('../../application/user');
const HttpStatus = require('http-status-codes');
const authorize = require('../../middlewares/authorize');
const {ROLES} = require('../../config/enums');
const codeStrings = require('../../config/codeStrings');
const { check, validationResult } = require('express-validator');

router.get('/', authorize(ROLES.ADMIN), async (req, res) => {
    const users = await userApp.getUsers();
    res.status(HttpStatus.OK).json({users});
});

router.get('/:id', authorize(), async (req, res) => {
    const requestedId = parseInt(req.params.id);
    if (req.user.role === ROLES.ADMIN || req.user.id === requestedId) {
        const user = await userApp.getUser(requestedId);
        res.status(HttpStatus.OK).json({user});
    } else {
        res.status(HttpStatus.FORBIDDEN).json({codeString: codeStrings.FORBIDDEN_ERROR});
    }
});

router.post('/', [
    check('email').isEmail(),
    check('username').isAlphanumeric().isLength({ min: 3 }),
    check('password').isLength({ min: 5 }),
], async (req, res) => {
    const {email, username, password} = req.body;
    const user = await userApp.newUser(email, username, password);
    res.status(HttpStatus.OK).json({user});
});

module.exports = router;