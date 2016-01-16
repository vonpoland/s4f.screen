const User = require('../db/connectionManager').User;
const async = require('async');
const fileService = require('../file/file');
const webPhotoPath = require('config').get('user.webPhotoPath');

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
		picture: data.picture,
		role: ['registered']
	});

	user.save(callback);
}

function getUserImage(profile, user, callback) {
	if(user && user.picture) {
		return callback(null, user);
	}

	fileService.getFile({
		url: profile.picture,
		id: profile.id
	}, err => {
		if(err) {
			return callback(err);
		}
		profile.picture = webPhotoPath.replace('{{id}}', profile.id);
		callback(null, user);
	});
}

function findOneOrCreate(profile, callback) {
	profile.email = profile.emails[0].value;
	profile.picture = profile.photos.length ? profile.photos[0].value: null;

	async.waterfall([
		User.findOne.bind(User, ({email: profile.email})),
		getUserImage.bind(null, profile),
		(user, callback) => {
			if(user) {
				return callback(null, user);
			}

			register(profile, callback);
		}
	], callback);
}

exports.findOneOrCreate = findOneOrCreate;