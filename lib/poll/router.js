const express = require('express');
const pollService = require('./service');
const HttpStatus = require('http-status-codes');
const logger = require('bigscreen-logger');

var router = express.Router();

router.get('/:id/participant', (req, res) => {
	pollService.getParticipants(req.params.id, (err, participants) => {
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