const User = require('../db/connectionManager').User;
const async = require('async');

function register(data, callback) {
	data.email = data.emails[0].value;

	if(!data.email) {
		return callback('invalid email');
	}

	var user = new User({
		creation: new Date(),
		firstName: data.first_name || data.name.givenName,
		lastName: data.last_name || data.name.familyName,
		email: data.email,
		picture: data.photos.length ? data.photos[0].value: null,
		role: ['registered']
	});

	user.save(callback);
}

function findOneOrCreate(profile, callback) {
	profile.email = profile.emails[0].value;

	async.waterfall([
		User.findOne.bind(User, ({email: profile.email})),
		(user, callback) => {
			if(user) {
				return callback(null, user);
			}

			register(profile, callback);
		}
	], callback);
}

exports.findOneOrCreate = findOneOrCreate;