const request = require('request');
const config = require('config').get('facebook');
const HttpStatus = require('http-status-codes');
const logger = require('../logger/logger');
const parseResponse = require('../request/helpers').parseResponse;
const passport = require('passport');
const userService = require('../user/service');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const oneHour = 60000 * 60;
const schema = require('../db/connectionManager');

var FacebookTokenStrategy = require('passport-facebook-token');

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

exports.setupPassport = function (app) {
	passport.serializeUser((user, done) => done(null, user.id));
	passport.deserializeUser((id, callback) => schema.User.findById(id, callback));
	passport.use(new FacebookTokenStrategy({
			clientID: config.get('appId'),
			clientSecret: config.get('secret'),
			profileUrl: config.get('userInfo'),
			enableProof: true
		}, function (accessToken, refreshToken, profile, done) {
			userService.findOneOrCreate(profile, done);
		}
	));

	app.use(session({
		secret: 'keyboard cat',
		saveUninitialized: true,
		resave: true,
		cookie: {maxAge: oneHour},
		store: new MongoStore({
			mongooseConnection: schema.getConnection()
		})
	}));
	app.use(passport.initialize());
	app.use(passport.session());
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