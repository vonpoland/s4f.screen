'use strict';

const expect = require('expect.js');
const oneSecond = 1000;
const oneMinute = 60 * oneSecond;
const fiveMinutes = 5 * oneMinute;
const voteService = require('./voteService');

describe('poll service tests', () => {
	it('should vote for given option', function (done) {

		this.timeout(fiveMinutes);
		voteService.voteMany(1, done);
	});
});