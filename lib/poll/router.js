const express = require('express');
const pollService = require('./service');
const HttpStatus = require('http-status-codes');
const getIO = require('../channel/bootstrap').io;
const logger = require('bigscreen-logger');
const secure = require('../auth/service').basicAuth;

var router = express.Router();

router.post('/:id/winner', secure, (req, res) => {
	pollService.lotWinner(req.params.id, (err, winner) => {
		if (err) {
			return res.sendStatus(HttpStatus.BAD_REQUEST);
		}

		logger.info('Winner!:', winner._id, winner.firstName + ' ' + winner.lastName);
		res.json(winner);
	});
});

router.post('/:parent/screen', secure, (req, res) => {
	req.body.parent = req.params.parent;
	getIO().emit(req.params.parent + ':changeScreen', req.body);
	pollService.saveLastScreen({
		pollName: req.body.pollName,
        lastScreen: req.body.step
	}, err => {
        if(err) {
            logger.error(err);
            return res.sendStatus(HttpStatus.BAD_REQUEST);
        }

        res.sendStatus(HttpStatus.OK);
    });
});

router.get('/:id/participant', (req, res) => {
	pollService.getParticipants(req.params.id, (err, participants) => {
		if (err) {
			logger.error(err);
			return res.sendStatus(HttpStatus.BAD_REQUEST);
		}

		res.json(participants);
	});
});

router.get('/:id/answer', (req, res) => {
	pollService.getAnswers(req.params.id, (err, participants) => {
		if (err) {
			logger.error(err);
			return res.sendStatus(HttpStatus.BAD_REQUEST);
		}

		res.json(participants);
	});
});

router.get('/', (req, res) => {
	pollService.getPolls(req.query.parent, (err, data) => {
		if (err) {
			logger.error(err);
			return res.sendStatus(HttpStatus.BAD_REQUEST);
		}

		res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
		res.json(data);
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