const express = require('express');
const pollService = require('./service');
const HttpStatus = require('http-status-codes');
const io = require('../channel/bootstrap').io;
const logger = require('../logger/logger');

var router = express.Router();

router.post('/:id/vote/:option', (req, res) => {
	var pollName = req.params.id;
	var option = req.params.option;

	pollService.add({
		pollName: pollName,
		vote: option
	}, (err, poll) => {
		if (err) {
			logger.error(err);
			return res.sendStatus(HttpStatus.BAD_REQUEST);
		}
		io().emit('vote', poll);
		res.json({});
	});
});

router.post('/:id/winner', (req, res) => {
	pollService.lotWinner(req.params.id, (err, winner) => {
		if (err) {
			return res.sendStatus(HttpStatus.BAD_REQUEST);
		}

		logger.info('Winner!:', winner._id, winner.firstName + ' ' + winner.lastName);
		res.json(winner);
	});
});

router.post('/:id/screen/:name', (req, res) => {
	var stay = req.body.stay;

	io().emit('changeScreen', {
		screen: req.params.name,
		stay: stay
	});

	res.sendStatus(HttpStatus.OK);
});

router.post('/:id/voted', (req, res) => {
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

router.post('/:id/register/:vote',
	(req, res) => {
		if (!req.body) {
			return res.sendStatus(HttpStatus.NOT_FOUND);
		}

		pollService.register({
			pollName: req.params.id,
			vote: req.params.vote,
			user: req.body
		}, (err, data)  => {
			if (err) {
				logger.error(err);
				return res.sendStatus(HttpStatus.BAD_REQUEST);
			}

			io().emit('newParticipant', data.user);
			res.json({});
		});
	});

router.get('/:id/participants', (req, res) => {
	pollService.getParticipants(req.params.id, (err, participants) => {
		if (err) {
			logger.error(err);
			return res.sendStatus(HttpStatus.BAD_REQUEST);
		}

		res.json(participants);
	});
});

router.get('/:id', (req, res) => {
	pollService.getPoll(req.params.id, (err, data) => {
		if (err) {
			logger.error(err);
			return res.sendStatus(HttpStatus.BAD_REQUEST);
		}

		res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
		res.json(data);
	});
});

module.exports = router;