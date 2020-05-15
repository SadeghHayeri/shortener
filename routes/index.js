const express = require('express');
const router = express.Router();

const authenticateRouter = require('./authenticate');
const usersRouter = require('./users');
const shortLinksRouter = require('./shortlinks');
const redirectRouter = require('./r');

router.use('/v1/authenticate', authenticateRouter);
router.use('/v1/users', usersRouter);
router.use('/v1/shortlinks', shortLinksRouter);
router.use('/r', redirectRouter);

module.exports = router;