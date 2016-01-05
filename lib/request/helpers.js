const logger = require('../logger/logger');

function parseResponse(body) {
	try {
		return JSON.parse(body);
	} catch(err) {
		logger.error(err);
	}
}

exports.parseResponse = parseResponse;