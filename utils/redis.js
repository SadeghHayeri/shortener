const Redis = require("ioredis");
const {redis: redisConfig} = require('../config/connections');
const logger = require('./logger');

function getRedis(config) {
    return new Redis({
        host: config.host,
        port: config.port,
        family: 4,
    });
}

logger.info(`connect to redis (${redisConfig.host}:${redisConfig.port})`)
module.exports = {
    master: getRedis(redisConfig),
    slave: getRedis(redisConfig),
}
