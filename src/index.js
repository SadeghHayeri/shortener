const mongoose = require('mongoose');
const {mongo: mongoConfig, app: appConfig} = require('./config/connections');
const logger = require('./utils/logger');
const app = require('./app');
const http = require('http');
const User = require('./models/user');

async function connectToMongo() {
    mongoose.connect(
        `mongodb://${mongoConfig.host}:${mongoConfig.port}/${mongoConfig.dbName}`,
        {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true}
    );
    logger.info(`connect to mongo (${mongoConfig.user}:${mongoConfig.password}:${mongoConfig.host}:${mongoConfig.port})`);
}

async function startHttpServer() {
    function onError(error) {
        if (error.syscall !== 'listen') {
            throw error;
        }
        const bind = 'Port ' + appConfig.port;
        switch (error.code) {
            case 'EACCES':
                logger.error(bind + ' requires elevated privileges');
                process.exit(1);
                break;
            case 'EADDRINUSE':
                logger.error(bind + ' is already in use');
                process.exit(1);
                break;
            default:
                throw error;
        }
    }

    function onListening() {
        const addr = server.address();
        const bind = typeof addr === 'string'
            ? 'pipe ' + addr
            : 'port ' + addr.port;
        logger.info('Listening on ' + bind);
    }

    app.set('port', appConfig.port);

    const server = http.createServer(app);

    server.listen(appConfig.port);
    server.on('error', onError);
    server.on('listening', onListening);
}

async function main() {
    await connectToMongo();
    await startHttpServer();
}

main();
