const Redis = require("ioredis");
const {redis: redisConfig} = require('../config/connections');
const logger = require('./logger');

logger.info(`connect to redis (${redisConfig.host}:${redisConfig.port})`)
module.exports = {
    master: new Redis({
        host: redisConfig.host,
        port: redisConfig.port,
    }),
    slave: new Redis({
        host: redisConfig.host,
        port: redisConfig.port,
    }),
}
