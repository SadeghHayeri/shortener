const dotenv = require('dotenv');

dotenv.config();

const config = {
    app: {
        host: process.env.HOST || 'localhost',
        port: Number(process.env.PORT) || 8000,
    },
    redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: Number(process.env.REDIS_PORT) || 6379,
    },
    mongo: {
        host: process.env.MONGO_HOST || 'localhost',
        port: Number(process.env.MONGO_PORT) || 27017,
        dbName: process.env.MONGO_DB_NAME || 'shortener',
        user: process.env.MONGO_USER || 'admin',
        password: process.env.MONGO_PASSWORD || 'password',
    },
};

module.exports = config;
