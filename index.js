const mongoose = require('mongoose');
const connectionsConfig = require('./config/connections');
const logger = require('./utils/logger');
const app = require('./app');
const http = require('http');

async function connectToMongo() {
    mongoose.connect(
        `mongodb://${connectionsConfig.mongo.host}:${connectionsConfig.mongo.port}/${connectionsConfig.mongo.dbName}`,
        {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true}
    );
    logger.info(`connect to mongo (${connectionsConfig.mongo.host}:${connectionsConfig.mongo.port})`);
}

async function startHttpServer() {
    function onError(error) {
        if (error.syscall !== 'listen') {
            throw error;
        }
        const bind = typeof port === 'string'
            ? 'Pipe ' + port
            : 'Port ' + port;
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

    app.set('port', connectionsConfig.app.port);

    const server = http.createServer(app);

    server.listen(connectionsConfig.app.port);
    server.on('error', onError);
    server.on('listening', onListening);
}

async function main() {
    await connectToMongo();
    await startHttpServer();
}

main();
