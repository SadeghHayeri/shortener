const express = require('express');
const router = express.Router();

const authenticateRouter = require('./authenticate');

router.use('/authenticate', authenticateRouter);

module.exports = router;