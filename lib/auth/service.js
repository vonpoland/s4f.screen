var passport = require('passport');
var BasicStrategy = require('passport-http').BasicStrategy;
var config = require('config').security;

exports.setupAuth = function(app) {
	passport.use(new BasicStrategy(
		function (username, password, done) {
			if (username === config.user && password === config.password) {
				return done(null, {admin: true});
			}

			return done(null, false, {message: 'Wrong user data'});
		}
	));

	app.use(passport.initialize());
};

exports.basicAuth = passport.authenticate('basic', {session: false});