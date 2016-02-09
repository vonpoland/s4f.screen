const request = require('request');
const config = require('config').get('facebook');
const HttpStatus = require('http-status-codes');
const logger = require('../logger/logger');
const parseResponse = require('../request/helpers').parseResponse;
const passport = require('passport');
const session = require('express-session');
const schema = require('../db/connectionManager');

exports.validateToken = function (req, res, next) {
	request(config.validateToken + req.query.token, function (err, response, body) {
		if (err) {
			logger.error(err);
			return res.sendStatus(HttpStatus.BAD_REQUEST);
		}
		var data = parseResponse(body);

		if (data && data.id === config.get('appId')) {
			return next();
		}

		logger.warn(data);
		res.sendStatus(HttpStatus.BAD_REQUEST);
	});
};

exports.facebookAuth = function () {
	if (config.skipSecurity) {
		return function (req, res, next) {
			schema.User
				.findOne({})
				.exec((err, user) => {
					req.user = user;
				next();
			});
		};
	} else {
		return passport.authenticate('facebook-token');
	}
};