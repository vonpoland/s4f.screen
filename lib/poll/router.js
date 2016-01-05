const express = require('express');
const pollService = require('./service');
const HttpStatus = require('http-status-codes');
const io = require('../channel/bootstrap').io;
const passport = require('passport');
const logger = require('../logger/logger');

var router = express.Router();

router.post('/:id/vote/:option', (req, res) => {
	var pollId = req.params.id;
	var option = req.params.option;

	pollService.add({
		pollId: pollId,
		vote: option
	}, (err, voteId) => {
		if (err) {
			return res.sendStatus(HttpStatus.BAD_REQUEST);
		}

		pollService.statistics(pollId, (err, data) => {
			if (err) {
				return;
			}

			io().emit('vote', data);
		});

		res.json({voteId: voteId});
	});
});

router.get('/:id/voted', passport.authenticate('facebook-token'), (req, res) => {
	if (!req.user) {
		return res.sendStatus(HttpStatus.NOT_FOUND);
	}

	pollService.voted(req.user, req.params.id, (err, result) => {
		if (err) {
			logger.error(err);
			return res.sendStatus(HttpStatus.BAD_REQUEST);
		}

		res.sendStatus(result ? HttpStatus.OK : HttpStatus.NOT_FOUND);
	});
});

router.post('/:id/register/:voteId',
	passport.authenticate('facebook-token'),
	(req, res) => {
		if (!req.user) {
			return res.sendStatus(HttpStatus.NOT_FOUND);
		}

		pollService.register({
			pollId: req.params.id,
			voteId: req.params.voteId,
			user: req.user
		}, (err, data) => {
			if (err) {
				logger.error(err);
				return res.sendStatus(HttpStatus.BAD_REQUEST);
			}

			res.json(data);
		});
	});

router.get('/:id', (req, res) => {
	var pollId = req.params.id;
	pollService.statistics(pollId, (err, data) => {
		if (err) {
			return res.sendStatus(HttpStatus.BAD_REQUEST);
		}

		res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
		res.json(data);
	});
});

module.exports = router;