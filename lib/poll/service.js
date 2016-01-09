'use strict';

const R = require('ramda');
const connectionManager = require('../db/connectionManager');
const Poll = connectionManager.Poll;
const User = connectionManager.User;
const Vote = connectionManager.Vote;
const async = require('async');
const random = require('random-js')();

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

		if(!poll.winner) {
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
	Poll.findOne({name: options.pollName}, (err, poll) => {
		if (err || !poll) {
			return callback(err || 'poll not found');
		}

		poll.addVote(options.vote, err => callback(err, poll));
	});
}

function register(data, callback) {
	var vote = new Vote({
		user: data.user.id,
		date: new Date(),
		option: data.vote,
		pollName: data.pollName
	});

	if (data.user.polls.indexOf(data.pollName) === -1) {
		data.user.polls.push(data.pollName);
	} else {
		return callback();
	}

	async.parallel([
		data.user.save.bind(data.user),
		vote.save.bind(vote)
	], callback);
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
	async.parallel([
			done => Poll.findOne({name: name}).lean().exec(done),
			done => getStatistics(name, done)
		],
		(err, data) => {
			if (err) {
				return callback(err);
			}

			var poll = data[0];
			var grouped = data[1];

			callback(null, {
				id: poll._id,
				name: poll.name,
				votes: grouped,
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
	Vote.find({pollName: pollName}, {user: 1})
		.populate('user')
		.lean()
		.then(votes => votes.map(vote => vote.user))
		.then((users) => callback(null, users), callback);
}

exports.voted = voted;
exports.add = add;
exports.getPoll = getPoll;
exports.getStatistics = getStatistics;
exports.register = register;
exports.lotWinner = getWinner;
exports.getParticipants = getParticipants;

//create('tychy-konkurs', {
//	templateVote: 'partials/tychy/mobile/vote.html',
//	templateResults: 'partials/tychy/konkurs1.html',
//	stepTemplates: {
//		step1: {
//			template: 'partials/tychy/step1.html',
//			next: 'step2',
//			timeout: 5000
//		},
//		step2: {
//			template: 'partials/tychy/step2.html',
//			next: 'step3',
//			timeout: 5000
//		},
//		step3: {
//			template: 'partials/tychy/step3.html',
//			next: 'step1',
//			timeout: 10000
//		}
//	}
//});
//create('ksw33', {templateVote: 'partials/ksw33/vote.html', templateResults: 'partials/ksw33/result.html'});
//create('tychy', {
//	templateVote: 'partials/tychy/vote.html', templateResults: 'partials/tychy/result.html',
//	data: [
//		{option: 'rutkowski', picture: 'partials/tychy/rutkowski.jpg'},
//		{option: 'florek', picture: 'partials/tychy/florek.jpg'},
//		{option: 'glanowski', picture: 'partials/tychy/galnowski.jpg'},
//		{option: 'szumilas', picture: 'partials/tychy/szumilas.jpg'},
//		{option: 'bukowiec', picture: 'partials/tychy/bukowiec.jpg'}
//	]
//});