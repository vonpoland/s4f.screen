'use strict';

const R = require('ramda');
const connectionManager = require('../db/connectionManager');
const Poll = connectionManager.Poll;
const User = connectionManager.User;
const Vote = connectionManager.Vote;
const async = require('async');
const random = require('random-js')();
const logger = require('../logger/logger');
const userService = require('../user/service');

function lot(users) {
	var value = random.integer(0, users.length - 1);

	return users[value];
}
function lotWinner(votes, callback) {
	if (!votes) {
		return callback('not found');
	}

	var user = R.pipe(
		R.map(vote => vote.user.toString()),
		R.uniq,
		lot)
	(votes);

	callback(null, user);
}

function saveWinner(pollName, winner, callback) {
	Poll.findOne({name: pollName}, (err, poll) => {
		if (err || !poll) {
			return callback(err || 'poll not found cannot save');
		}

		if (!poll.winner) {
			poll.winner = winner;
		}

		poll.save(err => callback(err, poll.winner));
	});
}

function getWinner(pollName, callback) {
	async.waterfall([
		Vote.find.bind(Vote, {pollName: pollName}),
		lotWinner,
		User.findById.bind(User),
		saveWinner.bind(null, pollName)
	], callback);
}

function add(options, callback) {
	Poll.findOne({name: {$regex: new RegExp(options.pollName, 'i')}}, (err, poll) => {
		if (err || !poll) {
			return callback(err || 'poll not found');
		}

		poll.addVote(options.vote, err => callback(err, poll));
	});
}

function saveVote(data, callback) {
	var vote = new Vote({
		user: data.user.id,
		date: new Date(),
		option: data.vote,
		pollName: data.pollName
	});

	if (data.user.polls.indexOf(data.pollName) === -1) {
		data.user.polls.push(data.pollName);
	} else {
		logger.warn('already voted');
		return callback();
	}

	async.parallel([
		data.user.save.bind(data.user),
		vote.save.bind(vote)
	], callback);
}

function register(data, callback) {
	async.waterfall([
		User.findById.bind(User, data.user._id),
		userService.getUserImage,
		(user, done) => {
			if (!user) {
				return done({message: 'user not found'});
			}

			data.user = user;
			done(null, data);
		},
		saveVote
	], err => {
		if (err) {
			return callback(err);
		}

		callback(null, data);
	});
}

function getStatistics(name, callback) {
	Vote.find({pollName: name})
		.lean()
		.exec((err, votes) => {
			if (err || !votes) {
				return callback(err || 'VOTE NOT FOUND');
			}

			var grouped = R.groupBy(vote => vote.option)(votes);

			R.forEach(key => grouped[key] = grouped[key].length)(R.keys(grouped));
			callback(null, grouped);
		});
}

function getPoll(name, callback) {
	Poll.findOne({name: {$regex: new RegExp(name, 'i')}}).lean().exec((err, poll) => {
		if (err || !poll) {
			return callback(err || 'poll not found');
		}

		callback(null, {
			id: poll._id,
			name: poll.name,
			templateVote: poll.templateVote,
			templateResults: poll.templateResults,
			templateWon: poll.templateWon,
			data: poll.data,
			winner: poll.winner
		});
	});
}

function voted(user, pollName, callback) {
	Poll.findOne({name: pollName}, (err, poll) => {
		if (err) {
			return callback(err);
		}

		var result = poll.votes.filter(vote => vote.userId && (vote.userId.toString() === user.id)).pop();

		callback(null, !!result);
	});
}

function getParticipants(pollName, callback) {
	Vote.find({pollName: {$regex: new RegExp(pollName, 'i')}})
		.populate('user')
		.lean()
		.then(votes => votes.map(vote => vote.user))
		.then(users => callback(null, users), callback);
}

exports.voted = voted;
exports.add = add;
exports.getPoll = getPoll;
exports.getStatistics = getStatistics;
exports.register = register;
exports.lotWinner = getWinner;
exports.getParticipants = getParticipants;