'use strict';

const R = require('ramda');
const Poll = require('../db/connectionManager').Poll;
const async = require('async');

function validateVote(poll, vote) {
	return vote && poll.options.indexOf(vote) >= 0;
}

function add(options, callback) {
	Poll.findOne({_id: options.pollId}, (err, poll) => {
		if (err || !poll) {
			return callback(err || 'not found');
		}

		if (!validateVote(poll, options.vote)) {
			return callback('bad vote');
		}

		var vote = {
			option: options.vote,
			tempId: Poll.generateId()
		};

		poll.votes.push(vote);
		poll.save(err => {
			if (err) {
				return callback(err);
			}

			callback(null, vote.tempId);
		});
	});
}

function register(data, callback) {
	Poll.findOne({_id: data.pollId}, (err, poll) => {
		var vote = poll.votes.filter(vote => vote.tempId = data.voteId).pop();

		if (!vote) {
			callback('vote not found');
		}

		vote.userId = data.user.id;
		vote.tempId = null;

		if (data.user.polls.indexOf(data.pollId) === -1) {
			data.user.polls.push(data.pollId);
		}

		async.parallel([
			data.user.save,
			poll.save
		], err => {
			callback(err, {
				name: poll.name
			});
		});
	});
}

function statistics(id, callback) {
	Poll.findOne({name: id}, (err, poll) => {
		if (err || !poll) {
			return callback('VOTE NOT FOUND');
		}

		var grouped = R.groupBy(vote => vote.option)(poll.votes);

		R.forEach(key => grouped[key] = grouped[key].length)(R.keys(grouped));

		callback(null, {
			id: poll._id,
			name: poll.name,
			votes: grouped,
			templateVote: poll.templateVote,
			templateResults: poll.templateResults,
			data: poll.data
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

exports.voted = voted;
exports.add = add;
exports.statistics = statistics;
exports.register = register;
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