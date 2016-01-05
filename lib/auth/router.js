const express = require('express');
const passport = require('passport');
const HttpStatus = require('http-status-codes');
const app = express();

var router = express.Router();

app.post('/api/login', (req, res, next) => {
	passport.authenticate('local', (err, user)=> {
		if (err || !user) {
			return res.sendStatus(HttpStatus.BAD_REQUEST);
		}

		req.logIn(user, function (err) {
			if (err) {
				return res.sendStatus(HttpStatus.BAD_REQUEST);
			}

			return res.json(user);
		});
	})(req, res, next);
});

module.exports = router;
