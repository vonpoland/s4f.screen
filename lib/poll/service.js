'use strict';

const R = require('ramda');

let polls = {};

function create(id, options) {
	polls[id] = {
		votes: []
	};

	if (typeof (options) === 'object') {
		Object.assign(polls[id], options);
	}
}

function add(options, callback) {
	var poll = polls[options.id];
	var user = options.user;
	var vote = options.vote;

	if (typeof (poll) === 'undefined') {
		return callback('VOTE NOT FOUND');
	}

	if (poll.votes.some(vote => vote.user.id === user.id)) {
		return callback('USER ALREADY VOTED');
	}

	poll.votes.push({
		vote: vote,
		user: user
	});

	callback(null);
}

function statistics(id, callback) {
	var poll = Object.assign({}, polls[id]);

	if (typeof (poll) === 'undefined') {
		return callback('VOTE NOT FOUND');
	}

	var grouped = R.groupBy(vote => vote.vote.option)(poll.votes);
	R.forEach(key => grouped[key] = grouped[key].length)
	(R.keys(grouped));

	callback(null, Object.assign(poll, {
		id: id,
		votes: grouped
	}));
}

exports.add = add;
exports.create = create;
exports.statistics = statistics;

create('tychy-konkurs', {
	templateVote: 'partials/tychy/vote-konkurs1.html',
	templateResults: 'partials/tychy/konkurs1.html',
	stepTemplates: {
		step1: {
			template: 'partials/tychy/step1.html',
			next: 'step2',
			timeout: 5000
		},
		step2: {
			template: 'partials/tychy/step2.html',
			next: 'step3',
			timeout: 5000
		},
		step3: {
			template: 'partials/tychy/step3.html',
			next: 'step1',
			timeout: 10000
		}
	}
});
create('ksw33', {templateVote: 'partials/ksw33/vote.html', templateResults: 'partials/ksw33/result.html'});
create('tychy', {
	templateVote: 'partials/tychy/vote.html', templateResults: 'partials/tychy/result.html',
	data: [
		{option: 'rutkowski', picture: 'partials/tychy/rutkowski.jpg'},
		{option: 'florek', picture: 'partials/tychy/florek.jpg'},
		{option: 'glanowski', picture: 'partials/tychy/galnowski.jpg'},
		{option: 'szumilas', picture: 'partials/tychy/szumilas.jpg'},
		{option: 'bukowiec', picture: 'partials/tychy/bukowiec.jpg'}
	]
});