const {createLogger, format, transports} = require('winston');

const logger = createLogger({
    level: 'info',
    format: format.json(),
    defaultMeta: {},
    transports: [
        // new winston.transports.File({ filename: 'error.log', level: 'error' }),
        // new winston.transports.File({ filename: 'combined.log' })
    ]
});

if (process.env.NODE_ENV !== 'production') {
    logger.add(new transports.Console({
        format: format.simple(),
    }));
}

module.exports = logger;
