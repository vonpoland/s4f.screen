const express = require('express');
const passport = require('passport');
const HttpStatus = require('http-status-codes');

var router = express.Router();

router.get('/me',
	passport.authenticate('facebook-token'),
	(req, res) => {
		if (!req.user) {
			return res.sendStatus(HttpStatus.NOT_FOUND);
		}

		res.json({
			polls: req.user.polls
		});
	});
