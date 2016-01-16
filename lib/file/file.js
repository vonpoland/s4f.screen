const Download = require('download');
const photoPath = require('config').get('user.storePhotoPath');

function getFile(options, callback) {
	var download = new Download({mode: '755'});

	download
		.get(options.url)
		.rename(file => {
			file.basename = 'profile';
			file.extname = '.png';

			return file;
		})
		.dest(photoPath
			.replace('{{id}}', options.id))
		.run(callback);
}

exports.getFile = getFile;