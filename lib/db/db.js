const connectionManager = require('bigscreen-db');
const config = require('config');
const logger = require('bigscreen-logger');

exports.Web = connectionManager.connect({
    connectionString: config.get('database.connection'),
    schema: ['vote', 'poll'],
    connectionOptions: {
        server: {pollSize: 5}
    }
}, err => {
    if (err) {
        return logger.error('error while connecting to Web db', err);
    }

    logger.info('Connection to Web db successful');
});