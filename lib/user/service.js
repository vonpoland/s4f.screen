const fileService = require('../file/file');
const webPhotoPath = require('config').get('user.webPhotoPath');

function getUserImage(user, callback) {
	if (!user) {
		return callback({message: 'user not found'});
	}
	if (user && user.picture) {
		return callback(null, user);
	}

	fileService.getFile({
		url: user.pictureOriginal,
		id: user.id
	}, err => {
		if (err) {
			return callback(err);
		}
		user.picture = webPhotoPath.replace('{{id}}', user.id);
		callback(null, user);
	});
}

exports.getUserImage = getUserImage;