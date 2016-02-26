const express = require('express');
var passport = require('passport');
var BasicStrategy = require('passport-http').BasicStrategy;
var router = express.Router();
const bodyParser = require('body-parser');
const HttpStatus = require('http-status-codes');

router.use(bodyParser.json());
passport.use(new BasicStrategy(
	function (username, password, done) {
		if (username === 'admin' && password === 's4f1234@') {
			return done(null, {admin: true});
		}

		return done(null, false, {message: 'Wrong user data'});
	}
));

router.use(passport.initialize());

router.post('/login', (req, res, next) => {
	passport.authenticate('basic', (err, user)=> {
		if (err) {
			return res.sendStatus(HttpStatus.BAD_REQUEST);
		} else if(!user) {
			return res.sendStatus(HttpStatus.UNAUTHORIZED);
		}

		return res.json(user);
	})(req, res, next);
});

router.get('/me',
	passport.authenticate('basic', {session: false}),
	function (req, res) {
		res.json(req.user);
	});


module.exports = router;