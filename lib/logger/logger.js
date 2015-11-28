const winston = require('winston');

var logger = new (winston.Logger)({
    name: 'applogs',
    transports: [
        new (winston.transports.Console)({ level: 'info' }),
        new (winston.transports.File)({
            name: 'logs',
            filename: 'logs.log',
            level: 'debug'
        })
    ]
});

module.exports = logger;
