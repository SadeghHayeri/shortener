const express = require('express');
const userApp = require('../../application/user');
const HttpStatus = require('http-status-codes');
const authorize = require('../../middlewares/authorize');
const {ROLES} = require('../../config/enums');
const codeStrings = require('../../config/codeStrings');
const { check, validationResult } = require('express-validator');

const router = express.Router();

router.get('/', authorize(ROLES.ADMIN), async (req, res) => {
    const users = await userApp.getUsers();
    res.status(HttpStatus.OK).json({users});
});

router.get('/:id', authorize(), async (req, res, next) => {
    try {
        if (req.user.role === ROLES.ADMIN || req.user.id === req.params.id) {
            const user = await userApp.getUser(req.params.id);
            res.status(HttpStatus.OK).json({user});
        } else {
            res.status(HttpStatus.FORBIDDEN).json({codeString: codeStrings.FORBIDDEN});
        }
    } catch (error) {
        next(error);
    }
});

router.post('/', [
    check('email').isEmail(),
    check('username').isAlphanumeric().isLength({ min: 3 }).withMessage('should have minimum length 3'),
    check('password').isLength({ min: 5 }),
], async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
                codeString: codeStrings.INVALID_REQUEST,
                errors: errors.array()
            });
        }

        const {email, username, password} = req.body;
        const user = await userApp.newUser(email, username, password);
        res.status(HttpStatus.OK).json({user});
    } catch (error) {
        next(error);
    }
});

module.exports = router;