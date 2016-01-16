'use strict';

const expect = require('expect.js');
const userService = require('../../../lib/user/service');
const db = require('../../../lib/db/connectionManager');
const fs = require('fs');
const path = require("path");
const facebookProfile1 = {
	emails: [{value: 'test1@user.pl'}],
	first_name: 'andrzej1',
	last_name: 'kowalski1',
	id: 'test1',
	photos: [{value: 'https://graph.facebook.com/10205553357378784/picture?type=large'}]
};

const facebookProfile2 = {
	emails: [{value: 'test2@user.pl'}],
	name: {givenName: 'andrzej2', familyName: 'kowalski22'},
	id: 'test2',
	photos: [{value: 'https://graph.facebook.com/1739809859586833/picture?type=large'}]
};

describe('userService tests', () => {
	before(done => db.User.remove({}, done));
	it('should register first user and check if all fields are stored correctly', done => {
		userService.findOneOrCreate(facebookProfile1, (err, user) => {
			expect(err).to.be(null);
			let photPath = path.join(__dirname, '../../../public', user.picture);
			expect(fs.existsSync(photPath)).to.be(true);
			fs.unlinkSync(photPath);
			done();
		});
	});

	it('should register second user and check if all fields are stored correctly', done => {
		userService.findOneOrCreate(facebookProfile2, (err, user) => {
			expect(err).to.be(null);
			let photPath = path.join(__dirname, '../../../public', user.picture);
			expect(fs.existsSync(photPath)).to.be(true);
			fs.unlinkSync(photPath);
			done();
		});
	});
});