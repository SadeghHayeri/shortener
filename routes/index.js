const express = require('express');
const router = express.Router();

const authenticateRouter = require('./authenticate');
const usersRouter = require('./users');
const shortLinksRouter = require('./shortlinks');
const redirectRouter = require('./r');

router.use('/authenticate', authenticateRouter);
router.use('/users', usersRouter);
router.use('/shortlinks', shortLinksRouter);
router.use('/r', redirectRouter);

module.exports = router;