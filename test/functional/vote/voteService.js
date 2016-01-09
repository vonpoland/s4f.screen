'use strict';

const async = require('async');
const R = require('ramda');
const random = require('random-js')();
const request = require('request');
const pollName = 'tychy-konkurs';
const votePath = 'http://localhost:8085/api/poll/' + pollName + '/vote/';
const expect = require('expect.js');
const registerPath = 'http://localhost:8085/api/poll/' + pollName + '/register/';

function registerVote(vote, index, callback) {
	request.post(registerPath + vote, {}, (err, data) => {
		console.info('registering end:' + index, data.body);
		if (err) {
			console.info('registering error:' + index);
			expect().fail(err);
			return;
		}
		callback();
	});
}

exports.voteMany = function (limit, done) {
	var array = R.range(0, limit);

	async.each(array, (index, callback) => {
		let option = random.integer(0, 1) ? 'tychy' : 'kluczbork';
		let latency = random.integer(100, 3000);

		setTimeout(() => {
			console.info('index start:' + index);
			request.post(votePath + option, {}, err => {
				console.info('index end:' + index);
				if (err) {
					console.info('index error:' + index);
					expect().fail(err);
				} else {
					registerVote(option, index, callback);
				}
			});
		}, latency);

	}, done);
};
